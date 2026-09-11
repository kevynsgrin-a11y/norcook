/**
 * Ingredient nutrition lookup backed by a committed build-time artifact
 * (lib/data/ingredient-nutrition.json), derived from the TrueAPI portfolio
 * ingredient dictionary (USDA FoodData Central data resolved offline).
 *
 * No runtime API calls: everything is static data joined at build time.
 * Refresh: DICTIONARY_PATH=<updated bundle> node scripts/build-nutrition.mjs
 */
import nutritionArtifact from './data/ingredient-nutrition.json'

export type Per100gNutrition = {
  kcal?: number
  protein_g?: number
  fat_g?: number
  carbs_g?: number
  fiber_g?: number
  sugar_g?: number
  sodium_mg?: number
  calcium_mg?: number
  iron_mg?: number
  potassium_mg?: number
}

export type IngredientNutrition = {
  /** Dictionary key (normalized ingredient name) that produced the match. */
  key: string
  display: string
  fdcId: number | null
  name: string | null
  dataType: string | null
  confidence: number | null
  per100g: Per100gNutrition
}

export const NUTRITION_ATTRIBUTION = 'Nutrition data: USDA FoodData Central'
export const NUTRITION_SOURCE_URL = 'https://fdc.nal.usda.gov'
export const NUTRITION_FETCHED_AT: string | null = nutritionArtifact.fetchedAt ?? null
export const NUTRITION_COVERAGE = nutritionArtifact.coverage as {
  resolved: number
  total: number
}

/** Normalize an ingredient string to the dictionary key form. */
function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

/**
 * Strip a leading quantity ("500 g", "2 tbsp", "1/2 tsp", "6", a "For the
 * filling:" prefix) so a full ingredient line can match its dictionary key.
 * Mirrors how the dictionary keys were derived from these ingredient lines.
 */
function stripQuantity(line: string): string {
  return line
    .replace(/^\s*(?:for the (?:filling|topping|glaze|icing|syrup)\s*:)?\s*/i, '')
    .replace(
      /^\s*(?:\d+(?:[./]\d+)?\s*)?(?:(?:x\s)?(?:g|kg|ml|l|tbsp|tsp|tablespoons?|teaspoons?|cups?|cloves?|pinch(?:es)?|dash|handfuls?|sheets?|slices?|sticks?|cans?|tins?|packets?|bunches?|sprigs?|portions?|litres?|liters?)\s+)?/i,
      '',
    )
    .trim()
}

const entries = nutritionArtifact.entries as Record<
  string,
  {
    display: string
    fdcId: number | null
    name: string | null
    dataType: string | null
    confidence: number | null
    per100g: Per100gNutrition
  }
>

function toNutrition(key: string, entry: (typeof entries)[string]): IngredientNutrition {
  return {
    key,
    display: entry.display,
    fdcId: entry.fdcId,
    name: entry.name,
    dataType: entry.dataType,
    confidence: entry.confidence,
    per100g: entry.per100g,
  }
}

/**
 * Look up per-100g nutrition for a full ingredient line (e.g.
 * "1 kg reindeer meat, ideally on the bone"). Matching is layered and
 * conservative: exact line, then the line minus its leading quantity, then
 * the first comma clause — every layer must still hit a dictionary name that
 * FoodData Central actually resolved, so no number is ever invented.
 * Returns null when unresolved; callers render nothing in that case.
 */
export function nutritionForIngredientLine(line: string): IngredientNutrition | null {
  const exact = normalize(line)
  if (entries[exact]?.per100g) return toNutrition(exact, entries[exact])

  const stripped = normalize(stripQuantity(line))
  if (stripped && entries[stripped]?.per100g) return toNutrition(stripped, entries[stripped])

  const clause = stripped.split(',')[0]
  if (clause && clause !== stripped && entries[clause]?.per100g) {
    return toNutrition(clause, entries[clause])
  }
  return null
}
