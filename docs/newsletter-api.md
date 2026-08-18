# Newsletter route contract

`POST /api/newsletter` is the only server route on the site. It is **dormant**:
`NEWSLETTER_WEBHOOK_URL` is unset, so a well-formed request is answered `503`
and nothing is relayed anywhere. The form that calls it is not rendered at all
until `NEXT_PUBLIC_NEWSLETTER_ENABLED=true`.

The contract is documented and tested now, while it is dormant, so that turning
it on is a configuration change rather than a rewrite under launch pressure.

There is no `/api/newsletter/subscribe`, `/api/health` or `/api/recipes`. Probes
for those return the branded 404 by design.

## Request

```
POST /api/newsletter
Content-Type: application/json

{ "email": "reader@example.com", "consentVersion": "norcook-consent-v1" }
```

`consentVersion` is `CONSENT_VERSION` from `lib/site.ts` — the same string that
keys the stored consent choice, so a signup can always be traced back to the
privacy text that was on screen. A hidden `company` field is a bot trap; a
submission that fills it is answered `202` and never relayed.

## Responses

| Status | Meaning |
| --- | --- |
| `202` | Accepted and relayed to the provider. Also returned to a honeypot hit. |
| `400` | Invalid email, or a `consentVersion` that is not the current one. |
| `403` | `Origin` or `Sec-Fetch-Site` states a cross-site request. The request's own host counts as same-origin, so previews and localhost work. |
| `413` | Body above 2048 bytes, whether or not it declares a `Content-Length`. |
| `415` | `Content-Type` is not `application/json`. |
| `429` | Per-IP rate limit exceeded. Carries `Retry-After`. |
| `503` | No provider configured — the current, dormant state. |
| `502` | Provider was reached and rejected the request. |
| `504` | Provider did not answer within 5s. |
| `405` | Any method other than POST (handled by the framework). |

Validation runs **before** the configuration check, so a malformed or cross-site
request gets the same answer whether or not a provider is configured. The route
never reports its own readiness to a caller that failed validation.

## Deliberate omissions

- **No `409 already subscribed`.** Distinguishing a known address from a new one
  on an unauthenticated public endpoint makes it a subscriber-enumeration
  oracle. Repeat submissions get the same `202`; de-duplication belongs to the
  provider.
- **No retry on provider failure.** A retry can duplicate a signup the provider
  already accepted. `502` and `504` are kept distinct so the logs separate
  "answered no" from "never answered", and the reader is asked to try again.

## Rate limiting — an honest caveat

The limit is 5 submissions per IP per hour, held in an in-memory `Map`, keyed on
the leftmost `x-forwarded-for` entry. It is **per-instance and best-effort**, and
the key is caller-controlled unless a trusted proxy overwrites that header. On a serverless platform each instance keeps
its own counter and a cold start resets it, so this is a courtesy brake against
casual abuse, not a durable guarantee. A real limit needs shared state (an edge
rate limiter or a KV store) and must be added before the route is switched on
for a launch that expects traffic.

## Logging

One structured line per request:

```json
{"event":"newsletter_subscribe","outcome":"accepted","emailHash":"<sha256[:16]>","consentVersion":"norcook-consent-v1","durationMs":42}
```

The raw address is never logged — `docs/analytics-event-model.md` already
excludes the email address from telemetry, and server logs hold the same line.
`emailHash` is a truncated SHA-256 for correlating a support report with a
request; it is not a privacy guarantee, since the input space of email addresses
is small enough to brute-force. Treat it as pseudonymous, not anonymous.

## Before switching on

1. Publish the operator, jurisdiction and privacy contact (see `/privacy`).
2. Record the provider, purpose, retention and deletion route in the privacy
   inventory.
3. Set `NEWSLETTER_WEBHOOK_URL` **and** `NEXT_PUBLIC_NEWSLETTER_ENABLED=true`
   together — setting only the public flag ships a live-looking form that 503s
   on every submission.
4. Replace the in-memory rate limit with shared state, and pin the trusted-proxy
   configuration so `x-forwarded-for` cannot be chosen by the caller.
5. Test the delivery, confirmation and unsubscribe paths end to end.
