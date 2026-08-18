# Release record — norcook.app

**Property:** norcook.app · **Recorded:** 2026-08-18 · **Owner:** unassigned (solo maintainer)
**Branch:** `claude/norcook-audit-issues-a9m0sf` · **Template:** `docs/release-checklist.md`

Measured by running the full gate locally: `pnpm lint`, `pnpm typecheck`,
`pnpm check:content`, `pnpm check:images`, `pnpm build`, `pnpm test:e2e`
(41 passing), and both Lighthouse profiles.

| Gate | Status | Evidence | Owner | Exception note |
| --- | --- | --- | --- | --- |
| `mobileOverflow=false` | PASS | `tests/e2e/accessibility.spec.ts` — no horizontal overflow at 390×844 on `/`, `/regions/vestlandet`, `/recipes/gravlaks` | unassigned | Three route shapes, not all 89 routes. |
| `focusVisible=true` | PASS | `app/globals.css` `:focus-visible` in `@layer base`; asserted in `tests/e2e/focus.spec.ts` | unassigned | — |
| `skipLink=true` | PASS | `components/skip-link.tsx` in `app/layout.tsx`; every `<main>` carries `id="main-content"`; asserted in `tests/e2e/focus.spec.ts` | unassigned | axe cannot catch this — its `bypass` rule is satisfied by headings alone, so the test is the only guard. |
| `dialogFocusManaged=true` | PASS | `components/analytics/consent-banner.tsx` — `role="dialog"`, focus on open, Tab trap, Escape, focus restored to opener; asserted in `tests/e2e/focus.spec.ts` | unassigned | Trap applies only to the footer-invoked dialog. The first-visit banner takes focus but is deliberately not modal. |
| `securityHeaders=true` | PASS | `next.config.mjs`; all six asserted in `tests/e2e/site.spec.ts` | unassigned | — |
| `consentInventoryCurrent=true` | PASS | `docs/analytics-event-model.md`, dated 2026-08-18, matches `components/analytics/consent-provider.tsx` | unassigned | Checked by hand, not by a script. Re-check whenever a `trackEvent` call site changes. |
| `manifestDecisionDocumented=true` | PASS | `docs/pwa-decision.md` | unassigned | Documents a decision with named gaps (no service worker, no 192/512 or maskable icons), not a complete manifest. |
| `sitemapAll200=true` | PASS | `tests/e2e/site.spec.ts` fetches all 89 `<loc>` entries: every one 200, none noindex, `/saved` absent | unassigned | — |
| `structuredDataValid=true` | PARTIAL | `tests/e2e/site.spec.ts` asserts Recipe JSON-LD shape across 5 slugs and CollectionPage on a hub; `scripts/check-content.mjs` blocks ratings and an asserted author | unassigned | Shape assertions only. No third-party schema validator runs in CI, and validators need a public URL. |
| `thirdPartyBudgetWithinLimit=true` | PASS | `lighthouserc.{mobile,desktop}.cjs` now assert third-party count 0, total ≤ 1.5 MiB, stylesheet ≤ 100 KiB. Measured: 0 third-party requests on all three routes | unassigned | Was previously informative only — `budgetPath` reports a budget, it does not fail a run. |
| `desktopMobileScreenshotsReviewed=true` | PARTIAL | `tests/e2e/screenshots.spec.ts` captures 8 routes × 2 viewports; CI uploads them as `release-screenshots` | unassigned | Capture is automated; the human review is not, and no reviewer is recorded for this release. Deliberately not a pixel diff — cross-runner font and GPU variance makes that a false-red generator. |
| `policyOperatorPublished=true` | BLOCKED | `/privacy` states the legal entity, address, privacy contact and jurisdiction are unconfirmed | unassigned | Launch blocker by explicit product decision, not a defect. Must never become a per-commit CI gate: a permanently red pipeline pressures whoever is on call to invent an operator. |
| `safetyOwnersNamed=true` | BLOCKED | `lib/recipe-safety.ts` status is `Qualified reviewer pending` on all six sensitive recipes | unassigned | Same reasoning. Note the coupling: `scripts/check-content.mjs` currently *requires* that literal and `lib/recipe-safety.ts` types it as a single literal, so naming a real reviewer means widening the type and the check in the same commit. |

## Performance, measured

Lighthouse CI, `/`, `/recipes/gravlaks`, `/regions/vestlandet`.

| Profile | LCP | TBT | CLS | Script | Third-party |
| --- | --- | --- | --- | --- | --- |
| Mobile | 2.39–3.15 s (budget 3.5 s) | 102–144 ms (budget 600 ms) | 0.000 | 311–319 KB (budget 330 KiB) | 0 |
| Desktop | 0.65–0.69 s (budget 2.5 s) | 0 ms (budget 200 ms) | 0.000 | 321–329 KB (budget 330 KiB) | 0 |

Mobile accessibility scored 1.00 on all three routes.

The mobile profile now collects **three runs and asserts the median**. A single
run was not a gate: on an unchanged tree the homepage measured 2.24 s, 2.95 s and
3.66 s LCP against a 3.5 s budget, so roughly one build in three failed on noise
alone regardless of what had changed. CI confirmed it — the first run of this
branch failed on a 4.10 s homepage sample while the same commit measured 2.26 s
median locally.

**Script budget headroom is thin — about 2.6% on the recipe route.** The 77-recipe
archive ships to the client because `components/recipe-index.tsx` and
`components/saved-list.tsx` both import `RECIPES`; that predates this record and
dominates the number. Region-hub links are set `prefetch={false}` on the always-
visible header nav and on card badges for the same reason: five hub routes
prefetching on every page load cost roughly 10 KB of script transfer site-wide.
The next contributor to add a client component on the recipe route should expect
to pay for it, and the durable fix is to stop shipping the whole archive.

## Known gaps in this record

- **No hub carries an independently fetched external source.** The environment
  this work was done in blocks outbound HTTPS to every institutional domain
  (snl.no, mattilsynet.no, lovdata.no, ec.europa.eu and the rest all refused at
  CONNECT). Rather than cite URLs nobody opened, the hubs re-link only citations
  that already ship on a recipe page from `lib/recipe-safety.ts`, and the one hub
  with no such connection — Modern Viral Baking — renders the honest
  "no external sources are recorded" state. Every historical and cultural claim
  in the hub prose is written as hedged general context so that it stands without
  a citation. Opening real sources is the first task for a session with normal
  egress.
- **Two seasonal hubs the 10 Aug 2026 audit asked for are not built.**
  "Spring seafood" has zero support in the archive and "summer berries" has one
  berry-centred recipe. Both stay unbuilt rather than inventing seasonality.
- **Per-IP rate limiting on `/api/newsletter` is in-memory.** Per-instance and
  best-effort; see `docs/newsletter-api.md`. It also keys on the leftmost
  `x-forwarded-for` entry, which a caller controls unless a trusted proxy
  rewrites it. Must be replaced with shared state, behind a trusted-proxy
  configuration, before the route is switched on for real traffic.
- **Two recipes contradict themselves about barley, and this change did not fix
  it.** `betasuppe` and `kjottsuppe` both list `Barley` in `mainIngredients` and
  describe themselves as barley soups in `lib/recipes.ts`, but neither one's
  ingredients or method in `lib/recipe-details.ts` contains any. Building the
  Østlandet glossary surfaced it. The glossary was written around the gap rather
  than repeating the claim, because resolving it means either adding barley to
  two methods — and `kjottsuppe`'s own chef tip is about keeping the broth
  *clear*, which barley would work against — or removing it from the cards. That
  is an editorial call for whoever owns the archive, not a drive-by edit.
