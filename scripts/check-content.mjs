import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const [recipes, safety, recipePage, recipeCard, newsletter] = await Promise.all([
  readFile(path.join(root, 'lib', 'recipes.ts'), 'utf8'),
  readFile(path.join(root, 'lib', 'recipe-safety.ts'), 'utf8'),
  readFile(path.join(root, 'app', 'recipes', '[slug]', 'page.tsx'), 'utf8'),
  readFile(path.join(root, 'components', 'recipe-card.tsx'), 'utf8'),
  readFile(path.join(root, 'components', 'newsletter.tsx'), 'utf8'),
])

const safetySensitiveSlugs = [
  'fenalar',
  'gravlaks',
  'rokt-roye',
  'spekemat',
  'sursild',
  'rakfisk',
]
const failures = []

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
if (recipePage.includes('recipe.rating') || recipePage.includes('recipe.reviews')) {
  failures.push('Recipe pages must not display unsupported ratings or review counts')
}
if (recipeCard.includes('recipe.rating') || recipeCard.includes('recipe.reviews')) {
  failures.push('Recipe cards must not display unsupported ratings or review counts')
}
if (newsletter.includes('40,000')) {
  failures.push('Newsletter must not display an unsupported readership claim')
}
if (/\brating:|\breviews:/.test(recipes)) {
  failures.push('Recipe source must not retain unsupported rating or review data')
}
if (recipes.includes('it guarantees safety')) {
  failures.push('Absolute food-safety guarantees are prohibited')
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Content checks pass: ${recipeCount} recipes and ${safetySensitiveSlugs.length} safety records.`)
