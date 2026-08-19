/**
 * Page-level provenance for ordinary (non-safety-sensitive) recipes.
 *
 * The site publishes no individual byline: no legal operator, editorial owner,
 * or qualified food-safety reviewer has been named yet, and the editorial policy
 * forbids claiming a page was "reviewed" until one is. So this layer records
 * what is true — when the content was last checked, which sources back it, and
 * what has been adapted or left uncertain — and says so plainly when a recipe
 * has no page-level source yet.
 *
 * The map is deliberately sparse. An entry is added only when a real, checked
 * source or a real caveat exists; every other recipe falls back to the site-wide
 * checked date and the honest empty state.
 */

export type ProvenanceSource = {
  label: string
  url: string
  publisher: string
}

export type RecipeProvenance = {
  /** Overrides the site-wide CONTENT_REVIEW_DATE when a page was checked later. */
  checkedOn?: string
  sources?: ProvenanceSource[]
  /** Adaptation, substitution, or an uncertainty worth stating outright. */
  note?: string
}

export const RECIPE_PROVENANCE: Record<string, RecipeProvenance> = {
  fenalar: {
    note: 'The home dry-curing method previously published here was withdrawn. This page is a serving guide for professionally produced fenalår and does not describe a preservation process.',
  },
  gravlaks: {
    note: 'An earlier version of this page carried a 24-hour home-freezing rule for parasite control. It was unsupported and has been removed; the food-safety callout above links the applicable guidance instead.',
  },
  rakfisk: {
    note: 'This page describes how rakfisk is bought, kept and served. It deliberately does not teach the fermentation, which needs controlled salt, temperature and verification.',
  },
  sursild: {
    note: 'Written as a refrigerated pickle from commercially salted herring. No shelf-stable canning process is implied or tested here.',
  },
  spekemat: {
    note: 'A serving and pairing guide for cured meats from inspected producers, not a home-curing method.',
  },
  'rokt-roye': {
    note: 'Written around commercially cold-smoked char. Cold smoking is treated here as a flavour step, not a preservation step.',
  },
  skillingsboller: {
    note: 'Quantities follow common Bergen bakery proportions rather than any single documented original; the cardamom level is a deliberate editorial choice and is heavier than most Swedish versions.',
  },
  lutefisk: {
    note: 'Written for pre-soaked lutefisk bought ready to cook. The lye treatment itself is a producer process and is described as history, not as instructions.',
  },
  smalahove: {
    note: 'Written for a prepared, salted and smoked head from a producer. Preparation of the raw head is not covered.',
  },
}

export function getRecipeProvenance(slug: string): RecipeProvenance | undefined {
  return RECIPE_PROVENANCE[slug]
}
