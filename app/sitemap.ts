import type { MetadataRoute } from 'next'
import { getAllCreators, getAllRecipes } from '@/lib/data/recipes'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL}/dashboard`, changeFrequency: 'daily', priority: 0.5 },
  ]

  const recipeRoutes: MetadataRoute.Sitemap = getAllRecipes().map((recipe) => ({
    url: `${SITE_URL}/recipe/${recipe.slug}`,
    lastModified: recipe.publishedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const creatorRoutes: MetadataRoute.Sitemap = getAllCreators().map((creator) => ({
    url: `${SITE_URL}/creator/${creator.handle}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...recipeRoutes, ...creatorRoutes]
}
