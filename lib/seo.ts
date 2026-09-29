// Query-aligned <title>/<meta description> helpers for the 2026-09-29
// fenalår/bidos SERP push. Query/position data lives in the PR description.
// The fenalar override deliberately does not use the word "Recipe": that
// page is a serving guide for professionally produced fenalår (the home-cure
// method was withdrawn 2026-07-21) and the title must not claim otherwise.
const SITE = 'Norcook'

type SeoRecipe = { slug: string; name: string; description: string }

// slug -> title fragment before ` | ${SITE}`.
const TITLE_OVERRIDES: Record<string, string> = {
  // GSC Sep: "fenalår" 12, "fenalar" 9, "fenalår recipe" 9, "fenalår
  // oppskrift" 8 — serving guide phrasing, no "Recipe" claim (header note).
  fenalar: 'Fenalår — Norwegian Cured Leg of Lamb',
  // GSC Sep: "bidos" 18, "bidos stew" 6, "bidos norway" 9, "bidos food" 8, "bidos soup" 15
  bidos: 'Bidos Recipe — Norwegian Reindeer Stew',
  // GSC Sep: "bergensk fiskesuppe" 10, "bergen fish soup" 11 / "bergen fish soup recipe" 8
  fiskesuppe: 'Bergensk Fiskesuppe — Norwegian Fish Soup',
  // GSC Sep: "finnbiff recipe" 7
  finnbiff: 'Finnbiff Recipe — Norwegian Reindeer Stew',
}

const DESCRIPTION_OVERRIDES: Record<string, string> = {
  fenalar:
    'How to buy, slice, and serve fenalår, Norway’s PGI dry-cured leg of lamb. Skjæres i tynne skiver og serveres kaldt med flatbrød.',
  bidos:
    'Bidos, the Sámi celebration stew of reindeer meat and root vegetables in a rich broth — Norway’s northern classic, explained.',
  fiskesuppe:
    'Bergen’s famous fish soup — bergensk fiskesuppe — a creamy, saffron-tinted broth loaded with fresh coastal fish.',
}

export function recipeSeoTitle(recipe: SeoRecipe): string {
  const base = TITLE_OVERRIDES[recipe.slug] ?? `${recipe.name} Recipe`
  return `${base} | ${SITE}`
}

export function recipeSeoDescription(recipe: SeoRecipe): string {
  const base = DESCRIPTION_OVERRIDES[recipe.slug] ?? recipe.description
  return base.slice(0, 155)
}
