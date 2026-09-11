#!/usr/bin/env node
/**
 * Build the site-shaped ingredient nutrition artifact from the portfolio
 * ingredient dictionary (USDA FoodData Central data, resolved offline).
 *
 * The dictionary is a committed build-time artifact — no runtime API calls.
 *
 * Usage:
 *   node scripts/build-nutrition.mjs
 *   DICTIONARY_PATH=<path-to-updated-bundle> node scripts/build-nutrition.mjs
 *   node scripts/build-nutrition.mjs <path-to-updated-bundle>
 *
 * Reads (default: committed subset at lib/data/ingredient-dictionary.json):
 *   { entries: { "<normalized>": { display, sites[], resolved, fdcId, name,
 *                                  dataType, confidence, per100g } } }
 *
 * Writes lib/data/ingredient-nutrition.json:
 *   { source, attribution, sourceUrl, fetchedAt, coverage: {resolved, total},
 *     entries: { "<normalized>": { display, fdcId, name, dataType,
 *                                  confidence, per100g } } }   // resolved only
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const SITE_ID = 'norcook'
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dictionaryPath =
  process.env.DICTIONARY_PATH ||
  process.argv[2] ||
  path.join(repoRoot, 'lib', 'data', 'ingredient-dictionary.json')
const outPath = path.join(repoRoot, 'lib', 'data', 'ingredient-nutrition.json')

const dictionary = JSON.parse(await readFile(dictionaryPath, 'utf8'))

const siteEntries = Object.entries(dictionary.entries ?? {}).filter(
  ([, entry]) => Array.isArray(entry.sites) && entry.sites.includes(SITE_ID),
)

const resolved = {}
for (const [key, entry] of siteEntries) {
  if (!entry.resolved || !entry.per100g) continue
  resolved[key] = {
    display: entry.display ?? key,
    fdcId: entry.fdcId ?? null,
    name: entry.name ?? null,
    dataType: entry.dataType ?? null,
    confidence: entry.confidence ?? null,
    per100g: entry.per100g,
  }
}

const artifact = {
  source: 'TrueAPI portfolio ingredient dictionary (USDA FoodData Central)',
  attribution: 'Nutrition data: USDA FoodData Central',
  sourceUrl: 'https://fdc.nal.usda.gov',
  fetchedAt: dictionary.fetchedAt ?? null,
  coverage: { resolved: Object.keys(resolved).length, total: siteEntries.length },
  entries: resolved,
}

await writeFile(outPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8')

console.log(
  `[build-nutrition] ${artifact.coverage.resolved}/${artifact.coverage.total} ` +
    `site ingredients resolved; wrote ${path.relative(repoRoot, outPath)} ` +
    `(fetchedAt ${artifact.fetchedAt ?? 'unknown'})`,
)

// Guard: a refresh that resolves nothing is almost certainly a bad bundle.
if (artifact.coverage.resolved === 0 && artifact.coverage.total > 0) {
  console.error('[build-nutrition] no site ingredients resolved — refusing to ship an empty artifact')
  process.exit(1)
}
