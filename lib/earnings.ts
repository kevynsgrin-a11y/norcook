import type { Creator, Recipe } from '@/lib/types'
import { getAllCreators, getRecipesByCreator } from '@/lib/data/recipes'

export const PLATFORM_FEE_RATE = 0.2

export interface RevenueStream {
  label: 'Ad Revenue' | 'Affiliate' | 'Instacart'
  cents: number
}

export interface CreatorEarnings {
  creator: Creator
  recipeCount: number
  totalViews: number
  streams: RevenueStream[]
  grossCents: number
  platformFeeCents: number
  netCents: number
}

/**
 * Deterministically derive earnings from a creator's content so the dashboard
 * is stable across renders. In production these numbers come from aggregated
 * ad-server reports, affiliate postbacks, and Instacart conversion webhooks.
 */
function recipeRevenueCents(r: Recipe): RevenueStream[] {
  // Treat VCS + engagement as a proxy for monetizable reach.
  const reach = r.likes + r.shares * 4 + r.saves * 2
  const ad = Math.round(reach * 0.9 + r.viralCoefficientScore * 120)
  const affiliate = Math.round(
    r.affiliateLinks.reduce((sum, l) => sum + l.commissionRate * 100, 0) * (r.saves / 50 + 8),
  )
  const instacart = Math.round((r.saves / 3 + r.shares / 5) * 11)
  return [
    { label: 'Ad Revenue', cents: ad },
    { label: 'Affiliate', cents: affiliate },
    { label: 'Instacart', cents: instacart },
  ]
}

export function getCreatorEarnings(creator: Creator): CreatorEarnings {
  const recipes = getRecipesByCreator(creator.id)
  const totals = new Map<RevenueStream['label'], number>()
  let totalViews = 0

  for (const r of recipes) {
    totalViews += r.likes + r.saves + r.shares
    for (const s of recipeRevenueCents(r)) {
      totals.set(s.label, (totals.get(s.label) ?? 0) + s.cents)
    }
  }

  const streams: RevenueStream[] = [...totals.entries()].map(([label, cents]) => ({
    label,
    cents,
  }))
  const grossCents = streams.reduce((sum, s) => sum + s.cents, 0)
  const platformFeeCents = Math.round(grossCents * PLATFORM_FEE_RATE)

  return {
    creator,
    recipeCount: recipes.length,
    totalViews,
    streams,
    grossCents,
    platformFeeCents,
    netCents: grossCents - platformFeeCents,
  }
}

export function getAllCreatorEarnings(): CreatorEarnings[] {
  return getAllCreators()
    .map(getCreatorEarnings)
    .sort((a, b) => b.netCents - a.netCents)
}
