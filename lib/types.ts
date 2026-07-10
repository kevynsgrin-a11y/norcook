/**
 * Core domain types for the Shoreburst platform.
 *
 * These mirror the normalized PostgreSQL schema in `lib/data/schema.sql`.
 * In production these would be the row shapes returned by the database layer.
 */

export interface Creator {
  id: string
  handle: string
  name: string
  avatarUrl: string
  bio: string
  verified: boolean
  followers: number
  /** Stripe Connect account id (mocked) — used for payout routing. */
  stripeAccountId: string
}

export interface Macros {
  /** grams of protein per serving */
  protein: number
  /** grams of carbohydrates per serving */
  carbs: number
  /** grams of fat per serving */
  fats: number
  /** total kilocalories per serving */
  calories: number
}

export interface Ingredient {
  id: string
  name: string
  /** display quantity, e.g. "2 tbsp" */
  quantity: string
  /** Instacart-friendly measurement unit, e.g. "tablespoon" */
  unit: string
  /** numeric amount for the Instacart line item */
  amount: number
}

export interface InstructionStep {
  id: string
  order: number
  text: string
  /** seconds into the video where this step begins (maps to JSON-LD startOffset) */
  startOffset: number
  /** seconds into the video where this step ends (maps to JSON-LD endOffset) */
  endOffset: number
}

export interface AffiliateLink {
  id: string
  ingredientId: string
  retailer: string
  url: string
  /** commission rate as a fraction, e.g. 0.08 = 8% */
  commissionRate: number
}

export interface Recipe {
  id: string
  slug: string
  title: string
  description: string
  cuisine: string
  /** total time in minutes */
  totalTimeMinutes: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  /** HLS (.m3u8) or mp4 fallback source used until a Mux asset exists. */
  videoSrc: string
  /**
   * Mux playback id. When present, playback is served from Mux
   * (https://stream.mux.com/<id>.m3u8) instead of `videoSrc`. Populate this
   * from an uploaded Mux asset (see lib/mux.ts) to go fully live.
   */
  muxPlaybackId?: string
  posterUrl: string
  durationSeconds: number
  creator: Creator
  macros: Macros
  ingredients: Ingredient[]
  steps: InstructionStep[]
  affiliateLinks: AffiliateLink[]
  /**
   * Viral Coefficient Score — the primary weighting metric used to rank the
   * feed. Higher = more viral. Computed from engagement velocity, shares,
   * completion rate, and recency. Stored as a sorted-set score in Redis.
   */
  viralCoefficientScore: number
  likes: number
  shares: number
  saves: number
  publishedAt: string
  tags: string[]
}

export type AbVariant = 'A' | 'B'
