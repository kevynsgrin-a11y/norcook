/**
 * Core domain types for the Norcook catalog data layer.
 *
 * These model the shape consumed by `lib/data/recipe-builder.ts` and
 * `lib/data/creators.ts`. In production these map to the `creators` and
 * `recipes` tables (plus their related `ingredients`, `steps`, and
 * `affiliate_links` rows).
 */

/** A content creator whose recipes appear in the feed. Maps to a Stripe Connect account for payouts. */
export interface Creator {
  id: string
  handle: string
  name: string
  avatarUrl: string
  bio: string
  verified: boolean
  followers: number
  /** Stripe Connect account id used for payout routing. */
  stripeAccountId: string
}

/** A single measured ingredient line for a recipe. */
export interface Ingredient {
  id: string
  name: string
  /** Human-readable quantity as displayed, e.g. "2 tbsp" or "to taste". */
  quantity: string
  /** Canonical unit, e.g. "gram", "deciliter", "each". */
  unit: string
  /** Numeric amount used for scaling and shopping-list math. */
  amount: number
}

/** An ordered, video-timed instruction step. */
export interface InstructionStep {
  id: string
  order: number
  text: string
  /** Start time (seconds) within the recipe video, for JSON-LD clips. */
  startOffset: number
  /** End time (seconds) within the recipe video, for JSON-LD clips. */
  endOffset: number
}

/** A shoppable affiliate link tied to a specific ingredient. */
export interface AffiliateLink {
  id: string
  ingredientId: string
  retailer: string
  url: string
  /** Fractional commission rate, e.g. 0.05 for 5%. */
  commissionRate: number
}

/** Per-serving macronutrient breakdown. */
export interface Macros {
  protein: number
  carbs: number
  fats: number
  calories: number
}

/** Recipe difficulty tiers. */
export type Difficulty = 'easy' | 'medium' | 'hard'

/** A fully-expanded, schema-valid recipe as produced by `buildRecipe`. */
export interface Recipe {
  id: string
  slug: string
  title: string
  description: string
  cuisine: string
  totalTimeMinutes: number
  servings: number
  difficulty: Difficulty
  /** HLS/MP4 source for the recipe video. */
  videoSrc: string
  /** Optional Mux playback id; when set, use in place of `videoSrc`. */
  muxPlaybackId?: string
  posterUrl: string
  durationSeconds: number
  creator: Creator
  macros: Macros
  ingredients: Ingredient[]
  steps: InstructionStep[]
  affiliateLinks: AffiliateLink[]
  /** Viral Coefficient Score — primary feed ranking weight. */
  viralCoefficientScore: number
  likes: number
  shares: number
  saves: number
  /** ISO published date. */
  publishedAt: string
  tags: string[]
}
