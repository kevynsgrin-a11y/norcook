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
  const favourite = page
    .getByRole('button', { name: /^Save .+ to saved recipes$/ })
    .first()
  await favourite.click()
  await expect(
    page.getByRole('button', { name: /^Remove .+ from saved recipes$/ }).first(),
  ).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(
    page.getByRole('button', { name: /^Remove .+ from saved recipes$/ }).first(),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('script[src*="vercel"]')).toHaveCount(0)
})

test('saves from a recipe page and manages the collection on /saved', async ({
  page,
}) => {
  await page.goto('/recipes/gravlaks')
  const save = page.getByRole('button', {
    name: 'Save Gravlaks to saved recipes',
  })
  await expect(save).toHaveAttribute('aria-pressed', 'false')
  await save.click()
  await expect(
    page.getByRole('button', { name: 'Remove Gravlaks from saved recipes' }),
  ).toHaveAttribute('aria-pressed', 'true')

  await page.goto('/saved')
  await expect(page.getByText('Saved on this device')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Gravlaks' })).toBeVisible()

  // Un-saving must empty the grid immediately, with no reload.
  await page
    .getByRole('button', { name: 'Remove Gravlaks from saved recipes' })
    .click()
  await expect(page.getByRole('heading', { name: 'Nothing saved yet' })).toBeVisible()
})

test('clears the whole collection behind a confirmation', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('norcook-favorite:gravlaks', 'true')
    window.localStorage.setItem('norcook-favorite:skillingsboller', 'true')
  })
  await page.goto('/saved')
  await expect(page.locator('article')).toHaveCount(2)

  await page.getByRole('button', { name: 'Clear all' }).click()
  // Nothing is removed until the second, explicit confirmation.
  await expect(page.getByText('Remove all 2 recipes?')).toBeVisible()
  await expect(page.locator('article')).toHaveCount(2)

  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.locator('article')).toHaveCount(2)

  await page.getByRole('button', { name: 'Clear all' }).click()
  await page.getByRole('button', { name: 'Yes, clear all' }).click()
  await expect(page.getByRole('heading', { name: 'Nothing saved yet' })).toBeVisible()
  await expect(page.locator('article')).toHaveCount(0)
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

test('emits complete Recipe JSON-LD across a sample of pages', async ({ page }) => {
  for (const slug of [
    'skillingsboller',
    'gravlaks',
    'farikal',
    'lefse',
    'bidos',
  ]) {
    await page.goto(`/recipes/${slug}`)
    const raw = await page.locator('script[type="application/ld+json"]').textContent()
    const recipe = JSON.parse(raw ?? '{}')
    expect(recipe['@type'], slug).toBe('Recipe')
    expect(recipe.name, slug).toBeTruthy()
    expect(recipe.recipeIngredient.length, slug).toBeGreaterThan(0)
    expect(recipe.recipeInstructions.length, slug).toBeGreaterThan(0)
    expect(recipe.dateModified, slug).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    // Unsupported claims must never reappear, and no author may be asserted
    // while no operator is published.
    expect(recipe.aggregateRating, slug).toBeUndefined()
    expect(recipe.author, slug).toBeUndefined()
  }
})

test('every ordinary recipe carries an evidence block', async ({ page }) => {
  await page.goto('/recipes/skillingsboller')
  await expect(
    page.getByRole('heading', { name: 'How this page was made' }),
  ).toBeVisible()
  await expect(page.getByText('Content last checked')).toBeVisible()
  await expect(page.getByText(/checked, not\s+reviewed/)).toBeVisible()
  await expect(
    page.getByText('No page-level sources are recorded for this recipe yet.'),
  ).toBeVisible()
  // The editorial policy forbids claiming a page was reviewed.
  await expect(page.getByText('Last reviewed')).toHaveCount(0)
})

test('region hubs are real pages with their own links and evidence', async ({
  page,
}) => {
  await page.goto('/regions/sapmi')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(
    page.locator('a[href^="/recipes/"]').filter({ hasText: 'View Recipe' }),
  ).not.toHaveCount(0)
  const recipeLinks = await page.locator('a[href^="/recipes/"]').count()
  expect(recipeLinks).toBeGreaterThanOrEqual(8)
  await expect(
    page.getByRole('heading', { name: 'Ingredient and kitchen glossary' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Sources and status' })).toBeVisible()
  await expect(page.getByText('Content last checked:')).toBeVisible()

  const raw = await page.locator('script[type="application/ld+json"]').textContent()
  const hub = JSON.parse(raw ?? '{}')
  expect(hub['@type']).toBe('CollectionPage')
  expect(hub.mainEntity.itemListElement.length).toBeGreaterThanOrEqual(8)
})

test('seasonal hubs are real pages', async ({ page }) => {
  await page.goto('/seasons/jul')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const recipeLinks = await page.locator('a[href^="/recipes/"]').count()
  expect(recipeLinks).toBeGreaterThanOrEqual(8)
  await expect(page.getByRole('heading', { name: 'Sources and status' })).toBeVisible()
})

test('a recipe links back to its region hub', async ({ page }) => {
  await page.goto('/recipes/bidos')
  await page.getByRole('link', { name: /Sápmi/ }).first().click()
  await expect(page).toHaveURL(/\/regions\/sapmi$/)
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

test('every sitemap URL returns 200 and is indexable', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  const paths = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  )
  expect(paths.length).toBeGreaterThan(80)
  // /saved is noindex and device-specific; it must never be advertised.
  expect(paths).not.toContain('/saved')

  for (const path of paths) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    const body = await response.text()
    expect(body, path).not.toContain('name="robots" content="noindex')
  }
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
  await expect(
    page.getByText('No email address is collected on this site today.'),
  ).toBeVisible()
  // The acceptance criterion: no conversion control at all, not a disabled one.
  await expect(page.locator('input[name="email"]')).toHaveCount(0)
  await expect(page.getByText('Free Download')).toHaveCount(0)

  await page.getByRole('button', { name: 'Cookie Settings' }).click()
  await expect(page.getByRole('heading', { name: 'Your privacy choice' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Allow analytics' })).toBeDisabled()
})
