# Analytics event model

**Inventory last checked:** 2026-08-23 · **Owner:** unassigned (solo maintainer)

This table is the consent inventory referenced by `docs/release-checklist.md`.
It must be re-checked against `components/analytics/consent-provider.tsx` and
every `trackEvent` call site whenever either changes, and the date above bumped.

Analytics is opt-in and disabled by default with
`NEXT_PUBLIC_ANALYTICS_ENABLED=false`. The legal operator, jurisdiction,
privacy contact, and provider terms must be published before setting it to
`true` in production.

| Event | Trigger | Properties | Explicitly excluded |
| --- | --- | --- | --- |
| `search_submit` | Recipe search updates results | `query_length`, `result_count` | Raw query text |
| `favorite_toggle` | Local favourite changes | `recipe_slug`, `saved` | Full local-storage contents |
| `error_route` | Branded 404 or runtime boundary renders | `status`, `route_kind` | Full referrer or URL query |
| `privacy_choice` | Optional analytics is accepted | `analytics` | Identifiers or prior browsing |

Automatic page-view analytics is loaded only after the same consent check.
“Essential only” prevents the Analytics component and custom events from
loading. Newsletter signup, recipe-view, and affiliate-click events have no
shipping client hook while their governance gates are closed. The consent key
is `CONSENT_VERSION` in `lib/site.ts`, currently `norcook-consent-v1`; any
future newsletter implementation must record that version with a signup.
