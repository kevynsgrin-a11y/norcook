import { RECIPES, getRegion, type Recipe } from '@/lib/recipes'

/**
 * Lightweight in-memory search over the recipe index. The corpus is small
 * (77 recipes) and fully available at build time, so a scored substring match
 * across the fields a reader would actually type is more than sufficient — no
 * external search service required.
 */
export function searchRecipes(query: string): Recipe[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const terms = q.split(/\s+/).filter(Boolean)

  const scored = RECIPES.map((recipe) => {
    const region = getRegion(recipe.region)
    const haystacks = {
      name: recipe.name.toLowerCase(),
      description: recipe.description.toLowerCase(),
      ingredients: [
        ...recipe.mainIngredients,
        ...(recipe.ingredients ?? []),
      ]
        .join(' ')
        .toLowerCase(),
      region: `${region?.name ?? ''} ${region?.label ?? ''}`.toLowerCase(),
    }

    let score = 0
    for (const term of terms) {
      if (haystacks.name.includes(term)) score += 10
      if (haystacks.ingredients.includes(term)) score += 4
      if (haystacks.description.includes(term)) score += 2
      if (haystacks.region.includes(term)) score += 3
    }
    return { recipe, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.recipe.name.localeCompare(b.recipe.name))
    .map((s) => s.recipe)
}
