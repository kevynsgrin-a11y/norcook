import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import {
  HONEYPOT_FIELD,
  MAX_BODY_BYTES,
  MAX_EMAIL_LENGTH,
  PROVIDER_TIMEOUT_MS,
  RATE_LIMIT_PER_HOUR,
} from '@/lib/newsletter-contract'
import { CONSENT_VERSION, SITE_URL } from '@/lib/site'

/**
 * POST /api/newsletter — the only server route on the site, and dormant until
 * an operator sets NEWSLETTER_WEBHOOK_URL. Documented in docs/newsletter-api.md.
 *
 * Deliberate design choices:
 * - A repeat address gets the same 202 as a new one. Answering 409 for
 *   "already subscribed" would turn a public endpoint into a subscriber
 *   enumeration oracle.
 * - Nothing here logs a raw address. docs/analytics-event-model.md lists the
 *   email address as excluded from telemetry; server logs hold to the same line.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_WINDOW_MS = 60 * 60 * 1000

/** Per-instance and best-effort: a serverless fleet does not share this map. */
const attemptsByIp = new Map<string, number[]>()

type Outcome =
  | 'accepted'
  | 'honeypot'
  | 'invalid'
  | 'rate_limited'
  | 'rejected_origin'
  | 'oversized'
  | 'unsupported_media_type'
  | 'provider_error'
  | 'provider_timeout'
  | 'unconfigured'

function hashEmail(email: string) {
  return createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 16)
}

function logOutcome(fields: {
  outcome: Outcome
  startedAt: number
  emailHash?: string
}) {
  console.log(
    JSON.stringify({
      event: 'newsletter_subscribe',
      outcome: fields.outcome,
      emailHash: fields.emailHash,
      consentVersion: CONSENT_VERSION,
      durationMs: Date.now() - fields.startedAt,
    }),
  )
}

function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || 'unknown'
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const recent = (attemptsByIp.get(ip) ?? []).filter(
    (at) => now - at < RATE_WINDOW_MS,
  )
  if (recent.length >= RATE_LIMIT_PER_HOUR) {
    attemptsByIp.set(ip, recent)
    return true
  }
  recent.push(now)
  attemptsByIp.set(ip, recent)
  // Bound the map so a long-lived instance cannot grow it without limit.
  if (attemptsByIp.size > 10_000) {
    for (const [key, times] of attemptsByIp) {
      if (!times.some((at) => now - at < RATE_WINDOW_MS)) attemptsByIp.delete(key)
    }
  }
  return false
}

/** Only rejects a *stated* foreign origin, so non-browser callers still work. */
function hasForeignOrigin(request: Request) {
  const site = request.headers.get('sec-fetch-site')
  if (site && site !== 'same-origin') return true
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(SITE_URL).origin) return true
  return false
}

export async function POST(request: Request) {
  const startedAt = Date.now()

  // A JSON content-type forces a CORS preflight this route never answers, which
  // is what closes off a cross-site `<form enctype="text/plain">` submission.
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    logOutcome({ outcome: 'unsupported_media_type', startedAt })
    return NextResponse.json(
      { error: 'Send application/json.' },
      { status: 415 },
    )
  }

  if (hasForeignOrigin(request)) {
    logOutcome({ outcome: 'rejected_origin', startedAt })
    return NextResponse.json({ error: 'Origin not allowed.' }, { status: 403 })
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > MAX_BODY_BYTES) {
    logOutcome({ outcome: 'oversized', startedAt })
    return NextResponse.json({ error: 'Request body too large.' }, { status: 413 })
  }

  const ip = clientIp(request)
  if (isRateLimited(ip)) {
    logOutcome({ outcome: 'rate_limited', startedAt })
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': '3600' } },
    )
  }

  const body = (await request.json().catch(() => null)) as
    | Record<string, unknown>
    | null

  // Answer a bot exactly as a person, so filling the trap teaches it nothing.
  if (typeof body?.[HONEYPOT_FIELD] === 'string' && body[HONEYPOT_FIELD]) {
    logOutcome({ outcome: 'honeypot', startedAt })
    return NextResponse.json({ accepted: true }, { status: 202 })
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (!EMAIL_PATTERN.test(email) || email.length > MAX_EMAIL_LENGTH) {
    logOutcome({ outcome: 'invalid', startedAt })
    return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 })
  }

  if (body?.consentVersion !== CONSENT_VERSION) {
    logOutcome({ outcome: 'invalid', startedAt, emailHash: hashEmail(email) })
    return NextResponse.json(
      { error: 'Unrecognised consent version.' },
      { status: 400 },
    )
  }

  // Checked last on purpose: a malformed or cross-site request is answered the
  // same way whether or not a provider is configured, so the endpoint never
  // reports its own readiness to a caller that failed validation.
  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL
  if (!webhookUrl) {
    logOutcome({ outcome: 'unconfigured', startedAt, emailHash: hashEmail(email) })
    return NextResponse.json(
      { error: 'Newsletter service is not configured.' },
      { status: 503 },
    )
  }

  let response: Response
  try {
    response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        source: 'norcook-homepage',
        consentVersion: CONSENT_VERSION,
        consentedAt: new Date().toISOString(),
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    })
  } catch (error) {
    // 504 and 502 are kept distinct so logs separate "never answered" from
    // "answered no". Neither is retried here: a retry would duplicate a signup
    // the provider may already have accepted.
    const timedOut = error instanceof Error && error.name === 'TimeoutError'
    logOutcome({
      outcome: timedOut ? 'provider_timeout' : 'provider_error',
      startedAt,
      emailHash: hashEmail(email),
    })
    return NextResponse.json(
      { error: 'Newsletter provider could not be reached.' },
      { status: timedOut ? 504 : 502 },
    )
  }

  if (!response.ok) {
    logOutcome({
      outcome: 'provider_error',
      startedAt,
      emailHash: hashEmail(email),
    })
    return NextResponse.json(
      { error: 'Newsletter provider rejected the request.' },
      { status: 502 },
    )
  }

  logOutcome({ outcome: 'accepted', startedAt, emailHash: hashEmail(email) })
  return NextResponse.json({ accepted: true }, { status: 202 })
}
