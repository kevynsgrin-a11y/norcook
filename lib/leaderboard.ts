import 'server-only'
import { redis } from '@/lib/data/mock-redis'
import { getAllRecipes } from '@/lib/data/recipes'
import type { Recipe } from '@/lib/types'

/**
 * Trending leaderboard, backed by a Redis sorted set keyed on each recipe's
 * Viral Coefficient Score (VCS). The feed and masonry grid read their initial
 * order from here so the first paint is server-rendered and instant.
 */

const TRENDING_KEY = 'shoreburst:trending'

/** Seed/refresh the sorted set from the source of truth (idempotent). */
function ensureSeeded(): void {
  if (redis.zcard(TRENDING_KEY) > 0) return
  for (const recipe of getAllRecipes()) {
    redis.zadd(TRENDING_KEY, recipe.viralCoefficientScore, recipe.id)
  }
}

/**
 * Returns recipes ordered by VCS (highest first). This is the hot path for the
 * initial page load — a single sorted-set range read instead of a table scan.
 */
export function getTrendingRecipes(limit = 50): Recipe[] {
  ensureSeeded()
  const ranked = redis.zrevrangeWithScores(TRENDING_KEY, 0, limit - 1)
  const byId = new Map(getAllRecipes().map((r) => [r.id, r]))
  return ranked
    .map(({ member }) => byId.get(member))
    .filter((r): r is Recipe => Boolean(r))
}

/** Top N trending entries with their live scores — used by the leaderboard rail. */
export function getLeaderboard(limit = 5): Array<{ recipe: Recipe; score: number; rank: number }> {
  ensureSeeded()
  const byId = new Map(getAllRecipes().map((r) => [r.id, r]))
  return redis
    .zrevrangeWithScores(TRENDING_KEY, 0, limit - 1)
    .map(({ member, score }, i) => {
      const recipe = byId.get(member)
      return recipe ? { recipe, score, rank: i + 1 } : null
    })
    .filter((x): x is { recipe: Recipe; score: number; rank: number } => Boolean(x))
}

/** Simulate live engagement bumping a recipe up the leaderboard. */
export function bumpViralScore(recipeId: string, delta: number): number {
  ensureSeeded()
  return redis.zincrby(TRENDING_KEY, delta, recipeId)
}
