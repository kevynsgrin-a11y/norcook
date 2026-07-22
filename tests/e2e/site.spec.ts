import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('norcook-consent-v1', 'essential')
  })
})

test('progressively renders and searches the recipe index', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'The Cultural Guide to Norway Through Food' }),
  ).toBeVisible()
  await expect(page.locator('#recipes article')).toHaveCount(12)

  await page.getByRole('button', { name: /Show 12 more/ }).click()
  await expect(page.locator('#recipes article')).toHaveCount(24)

  await page.getByRole('searchbox', { name: 'Search recipes' }).fill('gravlaks')
  await page.getByRole('button', { name: 'Explore' }).click()
  await expect(page).toHaveURL(/\?q=gravlaks#recipes$/)
  await expect(page.getByText('1 result for “gravlaks”')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Gravlaks', exact: true })).toBeVisible()
})

test('persists a favourite without analytics consent', async ({ page }) => {
  await page.goto('/')
  const favourite = page.getByRole('button', { name: 'Save to favorites' }).first()
  await favourite.click()
  await expect(
    page.getByRole('button', { name: 'Remove from favorites' }).first(),
  ).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(
    page.getByRole('button', { name: 'Remove from favorites' }).first(),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('script[src*="vercel"]')).toHaveCount(0)
})

test('shows safety evidence and Recipe JSON-LD', async ({ page }) => {
  await page.goto('/recipes/gravlaks')
  await expect(page.getByRole('heading', { name: 'Read before preparing this recipe' })).toBeVisible()
  await expect(page.getByText('Qualified reviewer pending', { exact: false })).toBeVisible()
  await expect(page.getByRole('link', { name: /Food and Drug Administration/ })).toHaveAttribute(
    'href',
    /fda\.gov/,
  )

  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent()
  expect(jsonLd).toBeTruthy()
  const recipe = JSON.parse(jsonLd ?? '{}')
  expect(recipe['@type']).toBe('Recipe')
  expect(recipe.name).toBe('Gravlaks')
  expect(recipe.aggregateRating).toBeUndefined()
})

test('serves a branded 404 and discovery files', async ({ page, request }) => {
  const response = await page.goto('/this-route-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'This trail ends before the kitchen' })).toBeVisible()

  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Sitemap: https://www.norcook.app/sitemap.xml')
  const sitemap = await request.get('/sitemap.xml')
  expect(await sitemap.text()).toContain('/recipes/gravlaks')
})

test('sends the expected security headers', async ({ request }) => {
  const response = await request.get('/')
  expect(response.headers()['content-security-policy']).toContain("frame-ancestors 'none'")
  expect(response.headers()['x-content-type-options']).toBe('nosniff')
  expect(response.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(response.headers()['permissions-policy']).toContain('camera=()')
  expect(response.headers()['x-frame-options']).toBe('DENY')
  expect(response.headers()['strict-transport-security']).toBe('max-age=63072000')
})

test('shows honest default privacy and newsletter states', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Newsletter signups are not open yet.')).toBeVisible()
  await page.getByRole('button', { name: 'Cookie Settings' }).click()
  await expect(page.getByRole('heading', { name: 'Your privacy choice' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Allow analytics' })).toBeDisabled()
})
