import { expect, test } from '@playwright/test'

test('the skip link is the first stop and lands in the main landmark', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('norcook-consent-v1', 'essential')
  })
  await page.goto('/')

  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to main content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main-content$/)
  await expect(page.locator('#main-content')).toBeVisible()
})

test('the cookie settings dialog manages focus', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('norcook-consent-v1', 'essential')
  })
  await page.goto('/')

  const opener = page.getByRole('button', { name: 'Cookie Settings' })
  await opener.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).toBeFocused()

  // Tab cycles inside the dialog rather than escaping to the page behind it.
  for (let i = 0; i < 6; i += 1) await page.keyboard.press('Tab')
  await expect(dialog.locator(':focus')).toHaveCount(1)

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(opener).toBeFocused()
})

test('the first-visit consent banner takes focus without trapping it', async ({
  page,
}) => {
  await page.goto('/')
  const banner = page.getByRole('region', { name: 'Your privacy choice' })
  await expect(banner).toBeVisible()
  await expect(banner).toBeFocused()

  // No trap: Tab must be able to leave a banner the visitor has not answered.
  await page.keyboard.press('Escape')
  await expect(banner).toBeVisible()

  await page.getByRole('button', { name: 'Essential only' }).click()
  await expect(
    page.getByRole('region', { name: 'Your privacy choice' }),
  ).toHaveCount(0)
})

test('interactive elements carry a visible focus indicator', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('norcook-consent-v1', 'essential')
  })
  await page.goto('/')

  const outline = await page
    .getByRole('button', { name: 'All Regions' })
    .evaluate((element) => {
      element.focus()
      const style = getComputedStyle(element)
      return { width: style.outlineWidth, style: style.outlineStyle }
    })
  expect(outline.style).not.toBe('none')
  expect(parseFloat(outline.width)).toBeGreaterThan(0)
})
