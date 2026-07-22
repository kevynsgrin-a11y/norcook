import type { MetadataRoute } from 'next'
import { RECIPES } from '@/lib/recipes'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // Only indexable routes belong here. /search and /saved are intentionally
  // noindex, so they are excluded to avoid a contradictory sitemap signal.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  const recipeRoutes: MetadataRoute.Sitemap = RECIPES.map((recipe) => ({
    url: `${SITE_URL}/recipes/${recipe.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...recipeRoutes]
}
