# Release record — norcook.app

**Property:** norcook.app · **Recorded:** 2026-08-23 · **Branch:** `codex/norcook-p0-p1-remediation` · **Status:** conditional technical release

This record distinguishes code that has been implemented and gated from facts that require a real business owner. No release process may turn a missing legal, privacy, food-safety, affiliate, or search-console fact into a guessed claim.

| Gate | Status | Evidence / remaining condition |
| --- | --- | --- |
| Dependency security | PASS | `pnpm audit --audit-level=high`: no known vulnerabilities. Next is 16.2.11 and the lockfile is refreshed. |
| Build and static checks | PASS | `pnpm lint`, `pnpm typecheck`, `pnpm check:content`, `pnpm check:images`, and `pnpm build` all pass. Content gate reports 77 recipes, 6 safety records, 5 region hubs, and 2 season hubs. |
| Security headers and API boundaries | PASS | CSP, HSTS, clickjacking, referrer, permissions, COOP/COEP/CORP, same-origin newsletter CORS, protected IndexNow dispatch, and API crawler exclusion are covered by E2E tests. |
| Accessibility and mobile baseline | PASS | Axe A/AA scans, focus management, skip link, consent dialog, mobile navigation, responsive contrast, and overflow checks passed on the covered route set. |
| PWA and discovery foundations | PASS | Manifest, icons, conservative service worker, robots, sitemap truthfulness, homepage CollectionPage JSON-LD, recipe JSON-LD, and IndexNow key hosting are covered by build/E2E checks. |
| Progressive recipe index | PASS | The initial home payload carries only the visible 12 cards; full corpus loading is deferred until search, regional filtering, or “show more.” E2E verifies reveal and search behavior. |
| Screenshot artifact | PASS, human review pending | The desktop and mobile eight-route capture succeeds in isolation. Its explicit 60-second allowance avoids a false timeout when it shares local CPU with the full suite. CI publishes the artifact for review. |
| Lighthouse release gate | CI pending | The gate now uses the Playwright-pinned Chromium installed in CI, keeps every raw report, and asserts a three-run median for each mobile metric. This workstation intermittently emits Lighthouse `NO_NAVSTART` before metrics are produced; valid local samples are retained below, but the CI artifact is the release decision. |
| Operator and privacy publication | PARTIAL / external input required | Publicly shown: Oak and Main Developers LLC; 2108 N St., Sacramento, CA 95816; operating state California. Still required: confirmed registered address (if distinct), governing jurisdiction, a working privacy email, and a data-rights request procedure. Newsletter and optional analytics remain disabled. |
| Food-safety ownership | BLOCKED / external input required | All six sensitive recipes retain the truthful “Qualified reviewer pending” state. A named reviewer, credentials, scope, evidence reference, decision, and review dates are required before a qualified-review claim can publish. |
| Affiliate and provider disclosures | BLOCKED / external input required | Affiliate links, newsletter processing, and optional analytics remain off until approved provider/partner terms, purpose, retention, deletion procedure, and disclosure copy are supplied. |
| Bing and IndexNow activation | PARTIAL / external input required | Key file and authenticated dispatch endpoint are deployed by code. Bing verification and a production `INDEXNOW_AUTH_TOKEN` still need to be configured by the account owner. |

## Local performance evidence

The last complete valid local mobile sample set used the current 12-card initial payload. Per-route three-run medians were within the unchanged gates:

| Route | LCP | TBT | Script transfer | CLS |
| --- | ---: | ---: | ---: | ---: |
| `/` | 3.00 s | 363 ms | 184 KiB | 0.000 |
| `/recipes/gravlaks` | 2.16 s | 207 ms | 194 KiB | 0.000 |
| `/regions/vestlandet` | 2.26 s | 397 ms | 194 KiB | 0.000 |

The mobile thresholds remain LCP ≤ 3.5 s, TBT ≤ 600 ms, and CLS ≤ 0.1. Every valid sample had zero third-party requests. The CI Lighthouse job installs the pinned browser and uploads all report JSON; its results must be attached to the deployment record before calling the performance gate complete.

## Deployment decision

The technical remediation is safe to deploy because the unresolved factual items fail closed: no newsletter signup, optional analytics, affiliate linking, or qualified food-safety endorsement can turn on without a complete approved record. Do not represent the site as fully launch-ready until the external-input rows above are completed.
