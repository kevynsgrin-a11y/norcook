// Query-aligned <title>/<meta description> helpers for the 2026-09-29
// fenalår/bidos SERP push. Query/position data lives in the PR description.
// The fenalar override deliberately does not use the word "Recipe": that
// page is a serving guide for professionally produced fenalår (the home-cure
// method was withdrawn 2026-07-21) and the title must not claim otherwise.
// Titles carry no brand suffix here — app/layout.tsx appends "— Norcook"
// via its title template, and the SERP budget is ~60 characters (the first
// deploy doubled the suffix; this keeps titles single-branded).
type SeoRecipe = { slug: string; name: string; description: string }

// slug -> title text (brand appended by the layout template).
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
  // DFS Oct 4: "sodd" #11 (590 vol); GSC 28d page pos 7.9 (35i).
  sodd: 'Sodd Recipe — Norwegian Celebration Meatball Soup',
  // DFS Oct 4: "skillingsboller" #18 (260 vol), "skillingsboller
  // recipe" #19 (40 vol) — recipe-dish, so "Recipe" stays in the title.
  skillingsboller: 'Skillingsboller Recipe — Bergen Cinnamon Buns',
  // Batch B Oct 4 (12-mo GSC): sursild 181i pos 9.8, plukkfisk 176i pos
  // 8.8, multekrem 146i pos 10.1 — all on bare default titles.
  sursild: 'Sursild Recipe — Norwegian Pickled Herring',
  plukkfisk: 'Plukkfisk Recipe — Norwegian Fish & Potato Hash',
  multekrem: 'Multekrem Recipe — Norwegian Cloudberry Cream',
}

const DESCRIPTION_OVERRIDES: Record<string, string> = {
  fenalar:
    'How to buy, slice, and serve fenalår, Norway’s PGI dry-cured leg of lamb. Skjæres i tynne skiver og serveres kaldt med flatbrød.',
  bidos:
    'Bidos, the Sámi celebration stew of reindeer meat and root vegetables in a rich broth — Norway’s northern classic, explained.',
  fiskesuppe:
    'Bergen’s famous fish soup — bergensk fiskesuppe — a creamy, saffron-tinted broth loaded with fresh coastal fish.',
  sodd:
    'Sodd, Norway’s celebration soup — a clear, fragrant broth of mutton and beef meatballs with potatoes and root vegetables.',
  skillingsboller:
    'Skillingsboller, the Bergen cinnamon bun — airy cardamom dough coiled around a molten butter-and-sugar core. The viral bakery recipe.',
  sursild:
    'Sursild, Norway’s pickled herring — a bright sweet-sour brine with onion, bay and peppercorns. The koldtbord anchor, made at home.',
  plukkfisk:
    'Plukkfisk, the west-coast fish and potato hash — poached fish “plucked” into cream, browned, finished with crisp bacon.',
  multekrem:
    'Multekrem, Sápmi’s cloud-and-cream dessert — amber cloudberries folded through softly whipped, lightly sweetened cream.',
}

export function recipeSeoTitle(recipe: SeoRecipe): string {
  return TITLE_OVERRIDES[recipe.slug] ?? `${recipe.name} Recipe`
}

export function recipeSeoDescription(recipe: SeoRecipe): string {
  const base = DESCRIPTION_OVERRIDES[recipe.slug] ?? recipe.description
  return base.slice(0, 155)
}
