import type { Creator, Recipe } from '@/lib/types'
import { creators } from '@/lib/data/creators'
import { buildRecipe } from '@/lib/data/recipe-builder'
import { RECIPE_SEEDS } from '@/lib/data/recipe-seeds'

/**
 * The recipe catalog. 100 recipes are expanded from compact seeds
 * (see recipe-seeds.ts) into fully-typed Recipe objects by `buildRecipe`.
 * In production this would come from PostgreSQL (see lib/data/schema.sql);
 * video sources are public sample HLS streams until Mux assets exist
 * (swap `videoSrc`, or set `muxPlaybackId`, to go fully live).
 *
 * Recipes are sorted by Viral Coefficient Score (VCS) — the same ranking
 * the vertical feed uses — so the highest-performing content leads.
 */
export const recipes: Recipe[] = RECIPE_SEEDS.map((seed, i) => buildRecipe(seed, i)).sort(
  (a, b) => b.viralCoefficientScore - a.viralCoefficientScore,
)

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug)
}

export function getAllRecipes(): Recipe[] {
  return recipes
}

export function getAllCreators(): Creator[] {
  return Object.values(creators)
}

export function getCreatorByHandle(handle: string): Creator | undefined {
  return Object.values(creators).find((c) => c.handle === handle)
}

export function getRecipesByCreator(creatorId: string): Recipe[] {
  return recipes.filter((r) => r.creator.id === creatorId)
}
