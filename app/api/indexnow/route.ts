import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import sitemap from '@/app/sitemap'
import { absoluteUrl, SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
const MAX_URLS_PER_REQUEST = 10_000
const INDEXNOW_KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/
const SITE_ORIGIN = new URL(SITE_URL).origin

/**
 * Authenticated, opt-in dispatch for URLs that are already present in the
 * canonical sitemap. It is intentionally not called by a build, deploy, or
 * page request: an editor or release job must submit only URLs that were just
 * added or materially updated. Deletions require a separately reviewed path,
 * because this safety-first endpoint permits only URLs still in the sitemap.
 */
export async function POST(request: Request) {
  const key = process.env.INDEXNOW_KEY
  const authToken = process.env.INDEXNOW_AUTH_TOKEN

  if (!key || !authToken || !INDEXNOW_KEY_PATTERN.test(key)) {
    return response({ error: 'IndexNow dispatch is not configured.' }, 503)
  }

  if (!hasValidBearerToken(request, authToken)) {
    return response({ error: 'Unauthorized.' }, 401)
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return response({ error: 'Request body must be JSON.' }, 400)
  }

  const urls = getUrls(payload)
  if (!urls || urls.length === 0 || urls.length > MAX_URLS_PER_REQUEST) {
    return response(
      { error: `Provide between 1 and ${MAX_URLS_PER_REQUEST} canonical URLs.` },
      400,
    )
  }

  let urlList: string[]
  try {
    urlList = [...new Set(urls.map(normalizeSameOriginUrl))]
  } catch {
    return response(
      { error: 'Every URL must be an absolute, canonical URL on this host.' },
      422,
    )
  }

  const publishedUrls = new Set(sitemap().map((entry) => entry.url))
  if (urlList.some((url) => !publishedUrls.has(url))) {
    return response(
      { error: 'Only URLs currently advertised by the canonical sitemap may be submitted.' },
      422,
    )
  }

  try {
    const upstream = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key,
        keyLocation: absoluteUrl(`/${key}.txt`),
        urlList,
      }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!upstream.ok) {
      return response(
        {
          error: 'IndexNow did not accept this URL batch.',
          indexNowStatus: upstream.status,
        },
        502,
      )
    }

    return response(
      {
        submitted: urlList.length,
        indexNowStatus: upstream.status,
      },
      202,
    )
  } catch {
    return response({ error: 'IndexNow request failed before completion.' }, 502)
  }
}

function getUrls(payload: unknown): string[] | undefined {
  if (!payload || typeof payload !== 'object' || !('urls' in payload)) return undefined
  const urls = payload.urls
  if (!Array.isArray(urls) || urls.some((url) => typeof url !== 'string')) return undefined
  return urls
}

function normalizeSameOriginUrl(value: string): string {
  const url = new URL(value)
  if (url.origin !== SITE_ORIGIN || url.username || url.password) {
    throw new Error('URL must be canonical and same-origin')
  }
  url.hash = ''
  return url.toString()
}

function hasValidBearerToken(request: Request, expected: string): boolean {
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return false

  const received = Buffer.from(authorization.slice('Bearer '.length))
  const secret = Buffer.from(expected)
  return received.length === secret.length && timingSafeEqual(received, secret)
}

function response(body: Record<string, string | number>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}
