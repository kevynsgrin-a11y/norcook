import { NextResponse } from 'next/server'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'Newsletter service is not configured.' },
      { status: 503 },
    )
  }

  const body = (await request.json().catch(() => null)) as
    | { email?: unknown }
    | null
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 })
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, source: 'norcook-homepage' }),
    cache: 'no-store',
  })

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Newsletter provider rejected the request.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ accepted: true }, { status: 202 })
}
