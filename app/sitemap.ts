import type { MetadataRoute } from 'next'
import { RECIPES, REGIONS } from '@/lib/recipes'
import { REGION_HUBS } from '@/lib/region-hubs'
import { SEASON_HUBS, SEASON_SLUGS } from '@/lib/season-hubs'
import { getRecipeContentModifiedOn } from '@/lib/recipe-provenance'
import { absoluteUrl } from '@/lib/site'

// These dates must match the explicit "Updated" line on each public page.
// Pages without an explicit, published freshness record intentionally omit
// `lastmod` rather than borrowing the archive-wide review date.
const STATIC_PAGE_FRESHNESS = {
  '/privacy': '2026-08-23',
  '/terms': '2026-08-23',
} as const

/**
 * Every URL here must return 200 and must be indexable. `/saved` is deliberately
 * absent: it is noindex and device-specific. Both properties are asserted
 * against a running build by tests/e2e/site.spec.ts ("every sitemap URL returns
 * 200 and is indexable"), runnable on its own with `pnpm check:sitemap`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    // Only the pages that visibly carry an explicit "Updated" line publish
    // `lastmod`. Do not turn a shared archive check into a claim that
    // every static page changed on the same day.
    { path: '/' },
    { path: '/editorial-policy' },
    { path: '/affiliate-disclosure' },
    { path: '/privacy', contentUpdatedOn: STATIC_PAGE_FRESHNESS['/privacy'] },
    { path: '/terms', contentUpdatedOn: STATIC_PAGE_FRESHNESS['/terms'] },
  ]

  return [
    ...staticRoutes.map(({ path, contentUpdatedOn }) => ({
      url: absoluteUrl(path),
      ...(contentUpdatedOn
        ? { lastModified: asSitemapDate(contentUpdatedOn) }
        : {}),
    })),
    ...REGIONS.map((region) => {
      const contentUpdatedOn = REGION_HUBS[region.slug].contentUpdatedOn

      return {
        url: absoluteUrl(`/regions/${region.slug}`),
        ...(contentUpdatedOn ? { lastModified: asSitemapDate(contentUpdatedOn) } : {}),
      }
    }),
    ...SEASON_SLUGS.map((season) => {
      const contentUpdatedOn = SEASON_HUBS[season].contentUpdatedOn

      return {
        url: absoluteUrl(`/seasons/${season}`),
        ...(contentUpdatedOn ? { lastModified: asSitemapDate(contentUpdatedOn) } : {}),
      }
    }),
    ...RECIPES.map((recipe) => {
      const contentUpdatedOn = getRecipeContentModifiedOn(recipe.slug)

      return {
        url: absoluteUrl(`/recipes/${recipe.slug}`),
        ...(contentUpdatedOn ? { lastModified: asSitemapDate(contentUpdatedOn) } : {}),
        images: [absoluteUrl(recipe.image)],
      }
    }),
  ]
}

function asSitemapDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`)
}
