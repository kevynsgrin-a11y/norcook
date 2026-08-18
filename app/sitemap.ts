import type { MetadataRoute } from 'next'
import { RECIPES, REGIONS } from '@/lib/recipes'
import { SEASON_SLUGS } from '@/lib/season-hubs'
import { absoluteUrl, CONTENT_REVIEW_DATE, HUB_CHECKED_DATE } from '@/lib/site'

/**
 * Every URL here must return 200 and must be indexable. `/saved` is deliberately
 * absent: it is noindex and device-specific. Both properties are asserted
 * against a running build by tests/e2e/site.spec.ts ("every sitemap URL returns
 * 200 and is indexable"), runnable on its own with `pnpm check:sitemap`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${CONTENT_REVIEW_DATE}T00:00:00.000Z`)
  const hubsLastModified = new Date(`${HUB_CHECKED_DATE}T00:00:00.000Z`)
  const staticRoutes = [
    '/',
    '/editorial-policy',
    '/affiliate-disclosure',
    '/privacy',
    '/terms',
  ]

  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '/' ? 1 : 0.4,
    })),
    ...REGIONS.map((region) => ({
      url: absoluteUrl(`/regions/${region.slug}`),
      lastModified: hubsLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...SEASON_SLUGS.map((season) => ({
      url: absoluteUrl(`/seasons/${season}`),
      lastModified: hubsLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...RECIPES.map((recipe) => ({
      url: absoluteUrl(`/recipes/${recipe.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: [absoluteUrl(recipe.image)],
    })),
  ]
}
