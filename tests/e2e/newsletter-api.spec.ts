import http from 'node:http'
import { expect, test } from '@playwright/test'

/**
 * The route is dormant in CI (no NEWSLETTER_WEBHOOK_URL), which is exactly why
 * these run green: they lock the request contract in place before an operator
 * arrives, so switching the provider on cannot quietly change the shape.
 * See docs/newsletter-api.md.
 */

const VALID = { email: 'reader@example.com', consentVersion: 'norcook-consent-v1' }

/**
 * The route rate-limits on the leftmost x-forwarded-for entry, so every test
 * claims its own client identity. Sharing one would make the suite spend its
 * own budget and turn a CI retry into a wall of 429s.
 */
let nextClient = 0
const asClient = (workerIndex: number, extra: Record<string, string> = {}) => ({
  'Content-Type': 'application/json',
  // Playwright runs this spec in several workers against one shared server.
  // Include the actual worker index so each test's client identity is unique
  // across that server, not merely inside an individual test process.
  'X-Forwarded-For': `10.${workerIndex + 1}.0.${(nextClient += 1)}`,
  ...extra,
})

test('rejects a non-JSON body before anything else', async ({ request }, testInfo) => {
  const response = await request.post('/api/newsletter', {
    headers: asClient(testInfo.workerIndex, { 'Content-Type': 'text/plain' }),
    data: 'email=reader@example.com',
  })
  // This is the cross-site `<form enctype="text/plain">` vector.
  expect(response.status()).toBe(415)
})

test('rejects a stated cross-site origin', async ({ request }, testInfo) => {
  const response = await request.post('/api/newsletter', {
    headers: asClient(testInfo.workerIndex, { Origin: 'https://evil.example' }),
    data: VALID,
  })
  expect(response.status()).toBe(403)
})

test('rejects an oversized body', async ({ request }, testInfo) => {
  const response = await request.post('/api/newsletter', {
    headers: asClient(testInfo.workerIndex),
    data: { ...VALID, padding: 'x'.repeat(4000) },
  })
  expect(response.status()).toBe(413)
})

test('rejects an oversized body that declares no length', async ({ baseURL }, testInfo) => {
  // A chunked request carries no Content-Length, so the cap has to hold against
  // the bytes actually read. Sent through node:http because Playwright's request
  // API always sets Content-Length, which is the very header this bypasses.
  const oversized = JSON.stringify({ ...VALID, padding: 'x'.repeat(200_000) })
  const url = new URL('/api/newsletter', baseURL ?? 'http://127.0.0.1:3000')

  const status = await new Promise<number>((resolve, reject) => {
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: asClient(testInfo.workerIndex, { 'Transfer-Encoding': 'chunked' }),
      },
      (res) => {
        res.resume()
        res.on('end', () => resolve(res.statusCode ?? 0))
      },
    )
    req.on('error', reject)
    req.end(oversized)
  })

  expect(status).toBe(413)
})

test('rejects a malformed email', async ({ request }, testInfo) => {
  const response = await request.post('/api/newsletter', {
    headers: asClient(testInfo.workerIndex),
    data: { ...VALID, email: 'not-an-email' },
  })
  expect(response.status()).toBe(400)
})

test('rejects a missing or stale consent version', async ({ request }, testInfo) => {
  const missing = await request.post('/api/newsletter', {
    headers: asClient(testInfo.workerIndex),
    data: { email: VALID.email },
  })
  expect(missing.status()).toBe(400)

  const stale = await request.post('/api/newsletter', {
    headers: asClient(testInfo.workerIndex),
    data: { ...VALID, consentVersion: 'norcook-consent-v0' },
  })
  expect(stale.status()).toBe(400)
})

test('reports 503 for a well-formed request while dormant', async ({ request }, testInfo) => {
  const response = await request.post('/api/newsletter', {
    headers: asClient(testInfo.workerIndex),
    data: VALID,
  })
  expect(response.status()).toBe(503)
})

test('accepts a same-origin request from the host it is served from', async ({
  request,
  baseURL,
}, testInfo) => {
  // The site's own form sends its Origin. Rejecting anything but the canonical
  // production host would 403 every submission on localhost and on previews.
  const response = await request.post('/api/newsletter', {
    headers: asClient(testInfo.workerIndex, {
      Origin: new URL(baseURL ?? 'http://127.0.0.1:3000').origin,
      'Sec-Fetch-Site': 'same-origin',
    }),
    data: VALID,
  })
  expect(response.status()).toBe(503)
})

test('answers a filled honeypot exactly as it answers a person', async ({
  request,
}, testInfo) => {
  // 202 and nothing relayed: a bot must not be able to tell it was caught.
  const response = await request.post('/api/newsletter', {
    headers: asClient(testInfo.workerIndex),
    data: { ...VALID, company: 'Acme Ltd' },
  })
  expect(response.status()).toBe(202)
})

test('rate limits a single client and says how long to wait', async ({ request }, testInfo) => {
  const headers = asClient(testInfo.workerIndex)
  const statuses: number[] = []
  for (let i = 0; i < 6; i += 1) {
    const response = await request.post('/api/newsletter', { headers, data: VALID })
    statuses.push(response.status())
    if (response.status() === 429) {
      expect(response.headers()['retry-after']).toBeTruthy()
    }
  }
  expect(statuses.slice(0, 5)).toEqual([503, 503, 503, 503, 503])
  expect(statuses[5]).toBe(429)
})

test('answers 405 to any other method', async ({ request }) => {
  const response = await request.get('/api/newsletter')
  expect(response.status()).toBe(405)
})

test('the API is disallowed to crawlers', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Disallow: /api/')
})
