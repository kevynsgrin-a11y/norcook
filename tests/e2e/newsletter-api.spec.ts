import { expect, test } from '@playwright/test'

/**
 * The route is dormant in CI (no NEWSLETTER_WEBHOOK_URL), which is exactly why
 * these run green: they lock the request contract in place before an operator
 * arrives, so switching the provider on cannot quietly change the shape.
 * See docs/newsletter-api.md.
 */

const VALID = { email: 'reader@example.com', consentVersion: 'norcook-consent-v1' }

test('rejects a non-JSON body before anything else', async ({ request }) => {
  const response = await request.post('/api/newsletter', {
    headers: { 'Content-Type': 'text/plain' },
    data: 'email=reader@example.com',
  })
  // This is the cross-site `<form enctype="text/plain">` vector.
  expect(response.status()).toBe(415)
})

test('rejects a stated cross-site origin', async ({ request }) => {
  const response = await request.post('/api/newsletter', {
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://evil.example',
    },
    data: VALID,
  })
  expect(response.status()).toBe(403)
})

test('rejects an oversized body', async ({ request }) => {
  const response = await request.post('/api/newsletter', {
    headers: { 'Content-Type': 'application/json' },
    data: { ...VALID, padding: 'x'.repeat(4000) },
  })
  expect(response.status()).toBe(413)
})

test('rejects a malformed email', async ({ request }) => {
  const response = await request.post('/api/newsletter', {
    headers: { 'Content-Type': 'application/json' },
    data: { ...VALID, email: 'not-an-email' },
  })
  expect(response.status()).toBe(400)
})

test('rejects a missing or stale consent version', async ({ request }) => {
  const missing = await request.post('/api/newsletter', {
    headers: { 'Content-Type': 'application/json' },
    data: { email: VALID.email },
  })
  expect(missing.status()).toBe(400)

  const stale = await request.post('/api/newsletter', {
    headers: { 'Content-Type': 'application/json' },
    data: { ...VALID, consentVersion: 'norcook-consent-v0' },
  })
  expect(stale.status()).toBe(400)
})

test('reports 503 for a well-formed request while dormant', async ({ request }) => {
  const response = await request.post('/api/newsletter', {
    headers: { 'Content-Type': 'application/json' },
    data: VALID,
  })
  expect(response.status()).toBe(503)
})

test('answers 405 to any other method', async ({ request }) => {
  const response = await request.get('/api/newsletter')
  expect(response.status()).toBe(405)
})

test('the API is disallowed to crawlers', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Disallow: /api/')
})
