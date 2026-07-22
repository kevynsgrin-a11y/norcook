# Analytics event model

Analytics is opt-in and disabled by default with
`NEXT_PUBLIC_ANALYTICS_ENABLED=false`. The legal operator, jurisdiction,
privacy contact, and provider terms must be published before setting it to
`true` in production.

| Event | Trigger | Properties | Explicitly excluded |
| --- | --- | --- | --- |
| `search_submit` | Recipe search updates results | `query_length`, `result_count` | Raw query text |
| `newsletter_signup` | Newsletter provider accepts a signup | `placement` | Email address |
| `recipe_view` | Recipe page mounts after consent | `recipe_slug`, `region` | User identity |
| `favorite_toggle` | Local favourite changes | `recipe_slug`, `saved` | Full local-storage contents |
| `affiliate_click` | A configured sponsored tool link is clicked | `tool_name` | Destination query parameters |
| `error_route` | Branded 404 or runtime boundary renders | `status`, `route_kind` | Full referrer or URL query |
| `privacy_choice` | Optional analytics is accepted | `analytics` | Identifiers or prior browsing |

Automatic page-view analytics is loaded only after the same consent check.
“Essential only” prevents the Analytics component and custom events from
loading. The consent key is `norcook-consent-v1`.
