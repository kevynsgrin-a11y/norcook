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
const seasonSlugLists = [...seasonHubs.matchAll(/recipeSlugs: \[([\s\S]*?)\]/g)]
if (!seasonSlugLists.length) failures.push('Season hubs must link recipes')
seasonSlugLists.forEach((match, index) => {
  const count = (match[1].match(/'/g) ?? []).length / 2
  if (count < 8) {
    failures.push(`Season hub ${index + 1} links ${count} recipes; at least 8 are required`)
  }
})
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
if (!newsletter.includes('HONEYPOT_FIELD') || !newsletter.includes('CONSENT_VERSION')) {
  failures.push('The newsletter form must send the documented contract fields')
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(
  `Content checks pass: ${recipeCount} recipes, ${safetySensitiveSlugs.length} safety records, ` +
    `${regionSlugs.length} region hubs, ${seasonSlugLists.length} season hubs.`,
)
