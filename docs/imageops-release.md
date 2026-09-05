# Norcook reviewed visual release

The live canonical is `https://www.norcook.app`, built from `main` at the root of
`kevynsgrin-a11y/norcook` by Vercel project `nordic-culinary-platform`.
Do not send this site to a same-named Cloudflare project or a utility-engine folder.

All eleven previously imported assets were visually reviewed on 2026-09-05 and
retained at grade A. `lib/imageops-visuals.json` records the actual scene, role and
page for every file. Original file names are not reliable content descriptions.
The coast image is not a regional map. The salmon is an ingredient scene, not a
finished or certified-safe dish. The video is an illustrative knot-shaping clip,
not a complete recipe method. Generic portraits do not replace unrelated dishes.
Only cinnamon buns and apple cake replace their corresponding recipe heroes;
the shared recipe record also updates their index cards and Recipe JSON-LD.

Existing methods, ingredients, safety review status and provenance stay intact.
Still images use responsive Next Image optimization with intrinsic dimensions;
the homepage hero is eager, supplementary figures are lazy. Figures preserve the
complete image. The silent technique video is user-controlled and does not preload
or autoplay. AI-created imagery is labelled rather than represented as evidence.

## Release gate

1. Review any registry or asset change; run `node scripts/imageops-release.mjs --write`
   to regenerate the deterministic, SHA-256 release receipt only after that review.
2. Run lint, typecheck, content/image checks, `pnpm check:visuals`, production build,
   browser tests and the existing mobile/desktop performance gates. CI keeps all
   of these checks. Browser tests check actual loaded media and recipe/card/schema
   agreement. A metadata URL alone does not count as deployment.
3. Merge only after CI and Vercel preview checks pass. Wait for production to become
   ready for that merged source. Run `pnpm verify:visuals:live` from the merged commit.
   It checks the canonical receipt, every asset's bytes/MIME and actual media tags
   on each of the eight intended routes. Then visually inspect production in a browser.

`/saved` remains device-local and noindex, and is intentionally absent from the
public sitemap. Image placement does not justify changing page freshness dates.

This document describes the verification procedure, not a claim that a particular
deployment has already passed it; the live verifier prints a timestamped result.
