import type {
  AffiliateLink,
  Ingredient,
  InstructionStep,
  Recipe,
} from '@/lib/types'
import { creators } from '@/lib/data/creators'

/**
 * Public sample HLS streams used until Mux assets exist. Recipes cycle these
 * by index; swap `videoSrc` (or set `muxPlaybackId`) to go fully live.
 */
export const SAMPLE_HLS = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwLxg.m3u8',
  'https://test-streams.mux.dev/pts_shift/master.m3u8',
  'https://test-streams.mux.dev/tos_ismc/main.m3u8',
]

/** General grocery delivery/pickup — everyday pantry items (butter, flour, cream, potatoes...). */
const GENERAL_RETAILERS: { retailer: string; urlBase: string }[] = [
  { retailer: 'Instacart', urlBase: 'https://www.instacart.com/products/search?k=' },
  { retailer: 'Amazon Fresh', urlBase: 'https://www.amazon.com/s?k=' },
  { retailer: 'Whole Foods Market', urlBase: 'https://www.wholefoodsmarket.com/search?text=' },
]

/**
 * Specialty retailers for ingredients a typical US/UK grocer won't stock —
 * game meats, Nordic pantry staples, and hard-to-find aromatics. These are
 * the real revenue opportunity: a generic grocery affiliate program pays
 * pennies on a bag of flour, but a specialty purveyor converts hard because
 * there's nowhere else nearby to buy reindeer or lingonberries.
 */
const SPECIALTY_RETAILERS: { retailer: string; urlBase: string }[] = [
  { retailer: 'ScandiKitchen', urlBase: 'https://www.scandikitchen.co.uk/?s=' },
  { retailer: "D'Artagnan", urlBase: 'https://www.dartagnan.com/catalogsearch/result/?q=' },
  { retailer: 'IKEA Swedish Food Market', urlBase: 'https://www.ikea.com/us/en/search/?q=' },
]

/** Ingredient-name substrings that route to a specialty Nordic/game retailer instead of general grocery. */
const SPECIALTY_KEYWORDS = [
  'reindeer',
  'venison',
  'elk',
  'moose',
  'game broth',
  'ptarmigan',
  'juniper',
  'lingonberr',
  'cloudberr',
  'multer',
  'cardamom',
  'brunost',
  'brown cheese',
  'lutefisk',
  'klippfisk',
  'tørrfisk',
  'torrfisk',
  'dried cod',
  'rakfisk',
  'suovas',
  'arctic char',
  'røye',
  'hartshorn',
  'ammonium bicarbonate',
  'potato flour',
  'potato starch',
  'rye flour',
  'barley flour',
  'pearl sugar',
  'crown dill',
  'mandelpotet',
  'rennet',
  'suet',
  'animal blood',
  'pork casing',
  'birch',
]

function isSpecialtyIngredient(name: string): boolean {
  const lower = name.toLowerCase()
  return SPECIALTY_KEYWORDS.some((kw) => lower.includes(kw))
}

/** Compact ingredient tuple: [name, quantity, unit, amount]. */
export type IngredientSeed = [name: string, quantity: string, unit: string, amount: number]

/** Compact recipe seed — expanded into a full `Recipe` by `buildRecipe`. */
export interface RecipeSeed {
  slug: string
  title: string
  desc: string
  /** creator key in the `creators` roster */
  creator: keyof typeof creators
  cuisine: string
  /** poster path under /public */
  poster: string
  difficulty: Recipe['difficulty']
  minutes: number
  servings: number
  /** video length in seconds (steps are timed evenly across this) */
  duration: number
  /** Viral Coefficient Score — primary feed ranking weight */
  vcs: number
  /** [protein, carbs, fats, calories] per serving */
  macros: [number, number, number, number]
  ingredients: IngredientSeed[]
  /** ordered step instruction texts (timed automatically) */
  steps: string[]
  tags: string[]
  /** ISO published date */
  publishedAt: string
}

/** Deterministic small hash from a string, for stable pseudo-random spread. */
function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function slugToId(slug: string): string {
  return `rec_${slug.replace(/-/g, '_')}`
}

/** Expand a compact seed into a fully-typed, schema-valid Recipe. */
export function buildRecipe(seed: RecipeSeed, index: number): Recipe {
  const id = slugToId(seed.slug)
  const [protein, carbs, fats, calories] = seed.macros

  const ingredients: Ingredient[] = seed.ingredients.map(
    ([name, quantity, unit, amount], i) => ({
      id: `${id}_i${i + 1}`,
      name,
      quantity,
      unit,
      amount,
    }),
  )

  // Time steps evenly across the video duration for JSON-LD start/endOffset.
  const n = seed.steps.length
  const steps: InstructionStep[] = seed.steps.map((text, i) => ({
    id: `${id}_s${i + 1}`,
    order: i + 1,
    text,
    startOffset: Math.round((i / n) * seed.duration),
    endOffset: Math.round(((i + 1) / n) * seed.duration),
  }))

  // Prioritize hard-to-find specialty ingredients (reindeer, cardamom, lingonberry...)
  // ahead of everyday pantry staples, then cap at 5 shoppable links per recipe.
  const specialty = ingredients.filter((ing) => isSpecialtyIngredient(ing.name))
  const general = ingredients.filter((ing) => !isSpecialtyIngredient(ing.name))
  const linkedIngredients = [...specialty, ...general].slice(0, Math.min(5, ingredients.length))

  const affiliateLinks: AffiliateLink[] = linkedIngredients.map((ing, i) => {
    const pool = isSpecialtyIngredient(ing.name) ? SPECIALTY_RETAILERS : GENERAL_RETAILERS
    const { retailer, urlBase } = pool[(hash(seed.slug) + i) % pool.length]
    return {
      id: `${id}_a${i + 1}`,
      ingredientId: ing.id,
      retailer,
      url: `${urlBase}${encodeURIComponent(ing.name)}`,
      commissionRate: 0.05 + ((hash(ing.name) % 6) / 100),
    }
  })

  // Derive engagement from VCS with a stable per-slug jitter.
  const j = hash(seed.slug)
  const likes = Math.round(seed.vcs * 1800 + (j % 40000))
  const shares = Math.round(seed.vcs * 190 + (j % 6000))
  const saves = Math.round(seed.vcs * 720 + (j % 20000))

  return {
    id,
    slug: seed.slug,
    title: seed.title,
    description: seed.desc,
    cuisine: seed.cuisine,
    totalTimeMinutes: seed.minutes,
    servings: seed.servings,
    difficulty: seed.difficulty,
    videoSrc: SAMPLE_HLS[index % SAMPLE_HLS.length],
    posterUrl: seed.poster,
    durationSeconds: seed.duration,
    creator: creators[seed.creator],
    macros: { protein, carbs, fats, calories },
    ingredients,
    steps,
    affiliateLinks,
    viralCoefficientScore: seed.vcs,
    likes,
    shares,
    saves,
    publishedAt: seed.publishedAt,
    tags: seed.tags,
  }
}
