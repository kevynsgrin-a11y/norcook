import path from 'node:path'
import { test } from '@playwright/test'

// Full-page visual capture is intentionally comprehensive (eight routes at
// each viewport). It can exceed Playwright's default 30 seconds when sharing
// local CPU with the functional suite, so give the review artifact a bounded,
// explicit allowance instead of creating a false regression failure.
test.setTimeout(60_000)

/**
 * Capture-only spec backing `desktopMobileScreenshotsReviewed` in
 * docs/release-checklist.md. CI uploads `screenshots/` as an artifact for a
 * human to look at before release.
 *
 * Deliberately not a pixel diff: font rasterisation and GPU differences across
 * runners make `toHaveScreenshot` a reliable source of false reds, and a gate
 * that cries wolf is a gate somebody eventually switches off.
 */

const OUT_DIR = path.join(process.cwd(), 'screenshots')

const ROUTES = [
  ['home', '/'],
  ['region-hub', '/regions/vestlandet'],
  ['season-hub', '/seasons/jul'],
  ['recipe-safety', '/recipes/gravlaks'],
  ['recipe-ordinary', '/recipes/skillingsboller'],
  ['saved', '/saved'],
  ['privacy', '/privacy'],
  ['not-found', '/this-route-does-not-exist'],
] as const

const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
] as const

for (const [viewportName, viewport] of VIEWPORTS) {
  test(`captures the review set at ${viewportName}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    // Settle the consent banner and populate /saved, so the captures show the
    // states a reader actually meets rather than empty shells.
    await page.addInitScript(() => {
      window.localStorage.setItem('norcook-consent-v1', 'essential')
      window.localStorage.setItem('norcook-favorite:gravlaks', 'true')
      window.localStorage.setItem('norcook-favorite:skillingsboller', 'true')
    })

    for (const [name, route] of ROUTES) {
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      await page.screenshot({
        path: path.join(OUT_DIR, `${name}-${viewportName}.png`),
        fullPage: true,
      })
    }
  })
}
