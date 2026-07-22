import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

for (const route of ['/', '/recipes/gravlaks', '/missing-accessibility-route']) {
  test(`has no automated WCAG A/AA violations on ${route}`, async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('norcook-consent-v1', 'essential')
    })
    await page.goto(route)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })
}

test('keeps the primary mobile journey free of horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    window.localStorage.setItem('norcook-consent-v1', 'essential')
  })
  await page.goto('/')
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
})
