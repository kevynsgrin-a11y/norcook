import type { MetadataRoute } from 'next'
import { RECIPES } from '@/lib/recipes'
import { absoluteUrl, CONTENT_REVIEW_DATE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${CONTENT_REVIEW_DATE}T00:00:00.000Z`)
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
    ...RECIPES.map((recipe) => ({
      url: absoluteUrl(`/recipes/${recipe.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: [absoluteUrl(recipe.image)],
    })),
  ]
}
