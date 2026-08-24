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
  const main = page.locator('#main-content')
  await expect(main).toBeVisible()
  await expect(main).toHaveAttribute('tabindex', '-1')
  await expect(main).toBeFocused()
})

test('the cookie settings dialog manages focus', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('norcook-consent-v1', 'essential')
  })
  await page.goto('/')

  const opener = page.locator('button[aria-controls="consent-dialog"]')
  await opener.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).toBeFocused()
  await expect(opener).toHaveAttribute('aria-expanded', 'true')

  // Tab cycles inside the dialog rather than escaping to the page behind it.
  for (let i = 0; i < 6; i += 1) await page.keyboard.press('Tab')
  await expect(dialog.locator(':focus')).toHaveCount(1)

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(opener).toBeFocused()
  await expect(opener).toHaveAttribute('aria-expanded', 'false')
})

test('the first-visit consent dialog traps focus without silently implying consent', async ({
  page,
}) => {
  await page.goto('/')
  const dialog = page.getByRole('dialog', { name: 'Your privacy choice' })
  await expect(dialog).toBeVisible()
  await expect(dialog).toBeFocused()
  await expect(dialog).toHaveAttribute('aria-modal', 'true')

  // Escape must not dismiss a choice the visitor has not made.
  await page.keyboard.press('Escape')
  await expect(dialog).toBeVisible()

  // A first visit has two active actions plus the privacy link. Tab must cycle
  // through those controls without reaching the background page.
  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press('Tab')
    expect(
      await dialog.evaluate(
        (element) => element === document.activeElement || element.contains(document.activeElement),
      ),
    ).toBe(true)
  }

  await page.getByRole('button', { name: 'Essential only' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('the mobile navigation closes on Escape and returns focus to its trigger', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    window.localStorage.setItem('norcook-consent-v1', 'essential')
  })
  await page.goto('/')

  const trigger = page.getByRole('button', { name: 'Toggle navigation menu' })
  await trigger.click()
  await expect(page.locator('#mobile-navigation')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.locator('#mobile-navigation')).toHaveCount(0)
  await expect(trigger).toBeFocused()
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
