import type { Recipe } from '@/lib/recipes'
import { getRegion } from '@/lib/recipes'
import { SITE_NAME, absoluteUrl } from '@/lib/site'

/**
 * schema.org/Recipe structured data for rich results.
 *
 * Note: aggregateRating / reviewCount are intentionally omitted. The rating and
 * review numbers in the dataset are placeholders, and emitting them as
 * machine-readable review markup would misrepresent them to search engines
 * (and risks a structured-data manual action). Add them back here only once
 * they are backed by real review data.
 */
export function RecipeJsonLd({ recipe }: { recipe: Recipe }) {
  const region = getRegion(recipe.region)

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description,
    image: [absoluteUrl(recipe.image)],
    url: absoluteUrl(`/recipes/${recipe.slug}`),
    recipeCuisine: 'Norwegian',
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    keywords: recipe.mainIngredients.join(', '),
    recipeIngredient: recipe.ingredients ?? recipe.mainIngredients,
  }

  if (region) data.recipeCategory = `${region.name} — ${region.label}`

  if (recipe.steps && recipe.steps.length > 0) {
    data.recipeInstructions = recipe.steps.map((step) => ({
      '@type': 'HowToStep',
      text: step,
    }))
  }

  return (
    <script
      type="application/ld+json"
      // Structured data is built from our own static dataset, not user input.
      // Escape '<' so a stray '</script>' in any field can't break out of the
      // script element (defence-in-depth for future, less-trusted data).
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
