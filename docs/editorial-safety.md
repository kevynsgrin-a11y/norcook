# Editorial food-safety gate

The structured safety set currently covers:

- `fenalar` — home-curing instructions withdrawn;
- `gravlaks` — raw cured fish and parasite controls;
- `rokt-roye` — cold-smoked ready-to-eat fish;
- `spekemat` — commercially produced ready-to-eat cured meat;
- `sursild` — refrigerated pickle, not shelf-stable canning;
- `rakfisk` — commercially produced fermented fish.

Every entry must retain a category, visible review status, review date,
safeguards, and links to public-health authorities. `pnpm check:content` blocks
release if an entry or its source coverage disappears.

The current status is **Qualified reviewer pending**. Before any page can claim
qualified review, add a complete, independently confirmed record to
`lib/governance.ts`: reviewer name and credentials, recipe scope, evidence
reference, date, decision, and next review date. The configuration rejects
partial or placeholder records and applies a review only to the recipe slugs it
explicitly lists. Preservation instructions require a validated process;
general editorial review is not a substitute.

## Page provenance for ordinary recipes

Every recipe — not only the safety-sensitive six — renders
`components/recipe-provenance.tsx`, which states the editorial owner, a
*checked* date (defaulting to `CONTENT_REVIEW_DATE` in `lib/site.ts`), the
page-level sources when `lib/recipe-provenance.ts` holds any, and an explicit
"no page-level sources are recorded yet" line when it does not.

Three rules are enforced by `pnpm check:content`:

1. The provenance block must stay wired into the recipe template.
2. The recipe template may not contain the string "Last reviewed" — a page may
   say it was *checked*, never that it was *reviewed*, until a named specialist
   records scope, evidence, date and decision.
3. No `author:`, `byline:` or `reviewer:` key may appear in the recipe, hub or
   provenance data. This is the standing guard against re-introducing the
   fabricated creator personas that were removed from this repository earlier.

The Recipe structured data carries `datePublished` and `dateModified` — the same
date the sitemap already publishes — and deliberately carries no `author` node.
