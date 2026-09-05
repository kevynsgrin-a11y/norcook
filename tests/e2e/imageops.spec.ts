import { expect, test } from '@playwright/test'
import visuals from '../../lib/imageops-visuals.json'

const assets = Object.values(visuals)
for (const route of [...new Set(assets.flatMap(asset => asset.routes))]) {
  test(`approved visuals render in their reviewed context: ${route}`, async ({ page }) => {
    await page.goto(route)
    for (const asset of assets.filter(asset => asset.routes.includes(route))) {
      const media = page.locator(`[data-imageops-asset="${asset.file}"]`).first()
      await media.scrollIntoViewIfNeeded()
      await expect(media).toBeVisible()
      if (asset.url.endsWith('.mp4')) {
        await expect(media).toHaveAttribute('controls', '')
        await expect(media).not.toHaveAttribute('autoplay')
        await expect(media).toHaveAttribute('preload', 'none')
        await expect(media).toHaveAttribute('src', asset.url)
      } else {
        await expect.poll(() => media.evaluate(element => {
          const img = element as HTMLImageElement
          return img.complete && img.naturalWidth > 0
        })).toBe(true)
        const src = await media.getAttribute('src')
        expect(decodeURIComponent(src ?? '')).toContain(asset.url)
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  })
}

test('reviewed dish identity is shared by recipe heroes, schema and recipe cards', async ({ page }) => {
  for (const [slug, asset] of [['skillingsboller', visuals.buns], ['eplekake', visuals.apple]] as const) {
    await page.goto(`/recipes/${slug}`)
    const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? '{}')
    expect(schema.image).toEqual([`https://www.norcook.app${asset.url}`])
    await expect(page.getByText('Hero image: AI-created serving illustration; your finished bake may differ.')).toBeVisible()
    await page.goto(`/?q=${slug}#recipes`)
    const card = page.locator('#recipes article').filter({ has: page.locator(`a[href="/recipes/${slug}"]`) })
    await expect(card).toHaveCount(1)
    expect(decodeURIComponent(await card.locator('img').getAttribute('src') ?? '')).toContain(asset.url)
  }
})
