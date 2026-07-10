import type { Recipe } from '@/lib/types'

/**
 * Builds a merged schema.org graph combining a `Recipe` and a `VideoObject`.
 *
 * The key trick for the "anti-blog" experience: each recipe instruction is a
 * `HowToStep` whose `video` is a `Clip` with `startOffset`/`endOffset` mapping
 * to the exact moment in the source video. This gives search engines deep-linked
 * "key moments" that jump straight to the relevant cooking step.
 */
export function buildRecipeJsonLd(recipe: Recipe, baseUrl: string) {
  const recipeUrl = `${baseUrl}/recipe/${recipe.slug}`
  const isoDuration = (mins: number) => `PT${mins}M`

  const hasParts = recipe.steps.map((step) => ({
    '@type': 'Clip',
    name: `Step ${step.order}`,
    startOffset: step.startOffset,
    endOffset: step.endOffset,
    url: `${recipeUrl}#step-${step.order}`,
  }))

  const videoObject = {
    '@type': 'VideoObject',
    name: recipe.title,
    description: recipe.description,
    thumbnailUrl: [`${baseUrl}${recipe.posterUrl}`],
    contentUrl: recipe.videoSrc,
    uploadDate: recipe.publishedAt,
    duration: `PT${Math.round(recipe.durationSeconds)}S`,
    hasPart: hasParts,
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: [`${baseUrl}${recipe.posterUrl}`],
    author: {
      '@type': 'Person',
      name: recipe.creator.name,
      url: `${baseUrl}/creator/${recipe.creator.handle}`,
    },
    datePublished: recipe.publishedAt,
    recipeCuisine: recipe.cuisine,
    recipeCategory: recipe.tags[0],
    keywords: recipe.tags.join(', '),
    recipeYield: `${recipe.servings} servings`,
    totalTime: isoDuration(recipe.totalTimeMinutes),
    recipeIngredient: recipe.ingredients.map((i) => `${i.quantity} ${i.name}`),
    nutrition: {
      '@type': 'NutritionInformation',
      calories: `${recipe.macros.calories} kcal`,
      proteinContent: `${recipe.macros.protein} g`,
      carbohydrateContent: `${recipe.macros.carbs} g`,
      fatContent: `${recipe.macros.fats} g`,
    },
    recipeInstructions: recipe.steps.map((step) => ({
      '@type': 'HowToStep',
      name: `Step ${step.order}`,
      text: step.text,
      url: `${recipeUrl}#step-${step.order}`,
      video: {
        '@type': 'Clip',
        name: `Step ${step.order}`,
        startOffset: step.startOffset,
        endOffset: step.endOffset,
        url: `${recipeUrl}#step-${step.order}`,
      },
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      ratingCount: recipe.likes,
    },
    video: videoObject,
  }
}
