import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()

const read = (...segments) => readFile(path.join(root, ...segments), 'utf8')

const [
  recipes,
  safety,
  provenance,
  regionHubs,
  seasonHubs,
  recipePage,
  recipeCard,
  saveButton,
  newsletter,
  newsletterRoute,
  envExample,
  sitemap,
  governance,
  nutritionArtifactRaw,
] = await Promise.all([
  read('lib', 'recipes.ts'),
  read('lib', 'recipe-safety.ts'),
  read('lib', 'recipe-provenance.ts'),
  read('lib', 'region-hubs.ts'),
  read('lib', 'season-hubs.ts'),
  read('app', 'recipes', '[slug]', 'page.tsx'),
  read('components', 'recipe-card.tsx'),
  read('components', 'save-recipe-button.tsx'),
  read('components', 'newsletter.tsx'),
  read('app', 'api', 'newsletter', 'route.ts'),
  read('.env.example'),
  read('app', 'sitemap.ts'),
  read('lib', 'governance.ts'),
  read('lib', 'data', 'ingredient-nutrition.json'),
])

const safetySensitiveSlugs = [
  'fenalar',
  'gravlaks',
  'rokt-roye',
  'spekemat',
  'sursild',
  'rakfisk',
]
const regionSlugs = [
  'sapmi',
  'vestlandet',
  'sorlandet',
  'ostlandet',
  'modern-viral',
]
const failures = []

// --- Recipe corpus and safety set ------------------------------------------

for (const slug of safetySensitiveSlugs) {
  if (!recipes.includes(`slug: '${slug}'`)) failures.push(`Missing recipe ${slug}`)
  const key = slug.includes('-') ? `'${slug}':` : `${slug}:`
  if (!safety.includes(key)) failures.push(`Missing safety record ${slug}`)
}

const recipeBlock = recipes
  .split('const BASE_RECIPES: Recipe[] = [')[1]
  .split('export const RECIPES')[0]
const recipeCount = [...recipeBlock.matchAll(/^\s{4}slug: '/gm)].length
if (recipeCount !== 77) failures.push(`Expected 77 recipes, found ${recipeCount}`)
if (!safety.includes("status: 'Qualified reviewer pending'")) {
  failures.push('Safety content must expose its pending review status')
}
for (const required of [
  'CONFIGURED_LEGAL_OPERATOR',
  'isCompleteLegalOperator',
  'CONFIGURED_FOOD_SAFETY_REVIEWS',
  'isCompleteFoodSafetyReview',
  'getQualifiedFoodSafetyReview',
  'REQUIRED_SENSITIVE_RECIPE_SLUGS',
]) {
  if (!governance.includes(required)) {
    failures.push(`Governance configuration must retain its ${required} guard`)
  }
}
if (!safety.includes('getQualifiedFoodSafetyReview')) {
  failures.push('Safety records must resolve qualified review through the governance gate')
}
if ((safety.match(/url: 'https:\/\//g) ?? []).length < 5) {
  failures.push('Safety content must retain authority source URLs')
}

// --- No unsupported social proof, anywhere ---------------------------------

for (const [name, source] of [
  ['Recipe pages', recipePage],
  ['Recipe cards', recipeCard],
  ['The save control', saveButton],
]) {
  if (source.includes('recipe.rating') || source.includes('recipe.reviews')) {
    failures.push(`${name} must not display unsupported ratings or review counts`)
  }
}
if (/\brating:|\breviews:/.test(recipes)) {
  failures.push('Recipe source must not retain unsupported rating or review data')
}
if (recipes.includes('it guarantees safety')) {
  failures.push('Absolute food-safety guarantees are prohibited')
}

// --- Provenance layer (audit issue 15) -------------------------------------

if (!recipePage.includes('RecipeProvenanceBlock')) {
  failures.push('Every recipe page must render the provenance block')
}
if (recipePage.includes('Last reviewed')) {
  failures.push(
    'Recipe pages may not claim a review: /editorial-policy permits "checked", not "reviewed"',
  )
}
for (const [name, source] of [
  ['lib/recipes.ts', recipes],
  ['lib/recipe-provenance.ts', provenance],
  ['lib/region-hubs.ts', regionHubs],
  ['lib/season-hubs.ts', seasonHubs],
]) {
  if (/^\s*(author|byline|reviewer):/m.test(source)) {
    failures.push(
      `${name} must not name an author, byline or reviewer while no operator is published`,
    )
  }
}
if (!recipePage.includes('dateModified')) {
  failures.push('Recipe JSON-LD must carry a dateModified freshness signal')
}
if (/author:/.test(recipePage.split('const jsonLd')[1]?.split('return (')[0] ?? '')) {
  failures.push('Recipe JSON-LD must not assert an author')
}

// --- Hubs (audit issue 16) --------------------------------------------------

for (const slug of regionSlugs) {
  const key = slug.includes('-') ? `'${slug}':` : `${slug}:`
  if (!regionHubs.includes(key)) failures.push(`Missing region hub ${slug}`)
}
for (const [name, source] of [
  ['lib/region-hubs.ts', regionHubs],
  ['lib/season-hubs.ts', seasonHubs],
  ['lib/recipe-provenance.ts', provenance],
]) {
  const urls = source.match(/url: '([^']*)'/g) ?? []
  if (urls.some((url) => !url.includes("'https://"))) {
    failures.push(`${name} may only cite https sources`)
  }
  if (/\b(reviewed by|is safe|validated)\b/i.test(source)) {
    failures.push(`${name} may not claim a page was reviewed, safe or validated`)
  }
}
// Resolve every referenced slug against the corpus. Counting quoted strings
// would pass a hub full of typos, and getRecipesBySlugs drops unknown slugs
// silently, so a hub could quietly render fewer recipes than it claims.
const corpusSlugs = new Set(
  [...recipes.matchAll(/^\s{4}slug: '([^']+)'/gm)].map((match) => match[1]),
)
const seasonSlugLists = [...seasonHubs.matchAll(/recipeSlugs: \[([\s\S]*?)\]/g)]
if (!seasonSlugLists.length) failures.push('Season hubs must link recipes')
seasonSlugLists.forEach((match, index) => {
  const slugs = [...match[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1])
  const unknown = slugs.filter((slug) => !corpusSlugs.has(slug))
  if (unknown.length) {
    failures.push(
      `Season hub ${index + 1} references recipes that do not exist: ${unknown.join(', ')}`,
    )
  }
  const resolved = slugs.length - unknown.length
  if (resolved < 8) {
    failures.push(
      `Season hub ${index + 1} resolves ${resolved} recipes; at least 8 are required`,
    )
  }
})
const provenanceSlugs = [...provenance.matchAll(/^  '?([a-z0-9-]+)'?: \{$/gm)].map(
  (match) => match[1],
)
const unknownProvenance = provenanceSlugs.filter((slug) => !corpusSlugs.has(slug))
if (unknownProvenance.length) {
  failures.push(
    `Provenance records reference recipes that do not exist: ${unknownProvenance.join(', ')}`,
  )
}
for (const [name, source] of [
  ['lib/region-hubs.ts', regionHubs],
  ['lib/season-hubs.ts', seasonHubs],
]) {
  // Hubs carry HUB_CHECKED_DATE, never the recipe archive's older date: a page
  // may not claim it was checked before it existed.
  if (source.includes('CONTENT_REVIEW_DATE')) {
    failures.push(`${name} must use HUB_CHECKED_DATE, not the recipe archive's date`)
  }
}
if (!sitemap.includes('/regions/') || !sitemap.includes('/seasons/')) {
  failures.push('The sitemap must advertise the region and season hubs')
}
if (sitemap.includes("'/saved'")) {
  failures.push('The sitemap must not advertise the noindex /saved route')
}

// --- Monetization posture (audit issue 18) ---------------------------------

if (newsletter.includes('40,000')) {
  failures.push('Newsletter must not display an unsupported readership claim')
}
if (/Free Download/i.test(newsletter)) {
  failures.push('Newsletter must not advertise a download that does not exist')
}
if (!newsletter.includes('No email address is collected')) {
  failures.push('The dormant newsletter must state plainly that no email is collected')
}

// --- Dormant-by-default and the route contract (audit issue 19) -------------

if (/^NEXT_PUBLIC_(ANALYTICS|NEWSLETTER)_ENABLED=true/m.test(envExample)) {
  failures.push('.env.example must ship with optional processing disabled')
}
if (/^NEWSLETTER_WEBHOOK_URL=.+/m.test(envExample)) {
  failures.push('.env.example must not ship a provider webhook')
}
for (const required of ['HONEYPOT_FIELD', 'CONSENT_VERSION', 'AbortSignal.timeout']) {
  if (!newsletterRoute.includes(required)) {
    failures.push(`The newsletter route must keep its ${required} control`)
  }
}
if (!newsletterRoute.includes('emailHash')) {
  failures.push('The newsletter route must log a hash, never a raw email address')
}
if (/console\.log\([^)]*\bemail\b[^)]*\)/.test(newsletterRoute.replace(/emailHash/g, ''))) {
  failures.push('The newsletter route must never log a raw email address')
}
if (/name="email"|onSubmit=|JSON\.stringify\(/.test(newsletter)) {
  failures.push(
    'The dormant newsletter must not ship an email collection form or request body',
  )
}

// --- Ingredient nutrition artifact (TrueAPI dictionary join) -----------------

// The nutrition artifact is a committed build-time product of the portfolio
// ingredient dictionary; it must always carry provenance and only resolved
// entries, so nothing on a page can render an invented number.
let nutritionArtifact
try {
  nutritionArtifact = JSON.parse(nutritionArtifactRaw)
} catch {
  failures.push('lib/data/ingredient-nutrition.json must be valid JSON')
}
if (nutritionArtifact) {
  if (typeof nutritionArtifact.fetchedAt !== 'string' || !nutritionArtifact.fetchedAt) {
    failures.push('Nutrition artifact must carry a fetchedAt snapshot stamp')
  }
  if (nutritionArtifact.sourceUrl !== 'https://fdc.nal.usda.gov') {
    failures.push('Nutrition artifact must attribute USDA FoodData Central')
  }
  const nutritionEntries = Object.entries(nutritionArtifact.entries ?? {})
  if (!nutritionEntries.length) {
    failures.push('Nutrition artifact must contain at least one resolved entry')
  }
  for (const [key, entry] of nutritionEntries) {
    if (!entry || typeof entry.per100g !== 'object' || entry.per100g === null) {
      failures.push(`Nutrition entry "${key}" must carry per100g data`)
      break
    }
    if (entry.fdcId === undefined || entry.name === undefined || entry.dataType === undefined) {
      failures.push(`Nutrition entry "${key}" must carry FoodData Central provenance`)
      break
    }
  }
  if (
    nutritionArtifact.coverage?.resolved !== nutritionEntries.length ||
    typeof nutritionArtifact.coverage?.total !== 'number' ||
    nutritionArtifact.coverage.total < nutritionEntries.length
  ) {
    failures.push('Nutrition artifact coverage counts must match its entries')
  }
  if (!recipes.includes('nutritionForIngredientLine')) {
    failures.push('lib/recipes.ts must join ingredient nutrition through lib/nutrition')
  }
  if (!recipePage.includes('NUTRITION_ATTRIBUTION') || !recipePage.includes('NUTRITION_SOURCE_URL')) {
    failures.push('Recipe pages must attribute USDA FoodData Central where its numbers show')
  }
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(
  `Content checks pass: ${recipeCount} recipes, ${safetySensitiveSlugs.length} safety records, ` +
    `${regionSlugs.length} region hubs, ${seasonSlugLists.length} season hubs, ` +
    `${nutritionArtifact?.coverage?.resolved ?? 0}/${nutritionArtifact?.coverage?.total ?? 0} ingredient names nutrition-resolved.`,
)
