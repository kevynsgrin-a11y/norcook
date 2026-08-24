import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

for (const route of [
  '/',
  '/recipes/gravlaks',
  '/recipes/skillingsboller',
  '/regions/sapmi',
  '/seasons/jul',
  '/saved',
  '/privacy',
  '/missing-accessibility-route',
]) {
  test(`has no automated WCAG A/AA violations on ${route}`, async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('norcook-consent-v1', 'essential')
      // Populate /saved so the grid, Clear all and export controls are scanned,
      // not just the empty state.
      window.localStorage.setItem('norcook-favorite:gravlaks', 'true')
    })
    await page.goto(route)
    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze()
    expect(results.violations).toEqual([])
  })
}

test('scans the consent banner, which every other test seeds away', async ({
  page,
}) => {
  await page.goto('/')
  const dialog = page.getByRole('dialog', { name: 'Your privacy choice' })
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveAttribute('aria-modal', 'true')
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze()
  expect(results.violations).toEqual([])
})

test('scans the cookie settings dialog', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('norcook-consent-v1', 'essential')
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Cookie Settings' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze()
  expect(results.violations).toEqual([])
})

for (const route of ['/', '/regions/vestlandet', '/recipes/gravlaks']) {
  test(`keeps ${route} free of horizontal overflow on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.addInitScript(() => {
      window.localStorage.setItem('norcook-consent-v1', 'essential')
    })
    await page.goto(route)
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
  })
}

for (const theme of ['light', 'dark'] as const) {
  test(`keeps the hero header contrast-safe across responsive breakpoints in ${theme} mode`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme })
    await page.addInitScript((savedTheme) => {
      window.localStorage.setItem('norcook-consent-v1', 'essential')
      window.localStorage.setItem('nordisk-theme', savedTheme)
    }, theme)

    await page.setViewportSize({ width: 320, height: 844 })
    await page.goto('/')

    for (const width of [320, 375, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 })
      await page.evaluate(
        () => new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve())),
      )

      const header = page.locator('header')
      await expect(header).toBeVisible()
      const background = await header.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      )
      expect(background).not.toBe('rgba(0, 0, 0, 0)')
      expect(background).not.toBe('transparent')

      const results = await new AxeBuilder({ page })
        .include('header')
        .withTags(WCAG)
        .analyze()
      expect(
        results.violations.filter((violation) => violation.id === 'color-contrast'),
      ).toEqual([])
    }
  })
}
