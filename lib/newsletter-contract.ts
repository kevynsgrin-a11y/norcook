/**
 * Shared contract between the newsletter form and POST /api/newsletter.
 *
 * The endpoint is dormant: it returns 503 until an operator sets
 * NEWSLETTER_WEBHOOK_URL, and the form is not rendered until
 * NEXT_PUBLIC_NEWSLETTER_ENABLED is 'true'. These constants exist so the
 * contract is fixed and testable *before* either switch is flipped.
 *
 * See docs/newsletter-api.md for the full status table and its limits.
 */

/** Hidden field. A bot that fills it gets a 202 and is never relayed. */
export const HONEYPOT_FIELD = 'company'

/** Outbound provider calls are abandoned after this, and answered 504. */
export const PROVIDER_TIMEOUT_MS = 5_000

/** Per-IP submissions allowed per hour. Best-effort and per-instance. */
export const RATE_LIMIT_PER_HOUR = 5

/** Requests larger than this are rejected before the body is parsed. */
export const MAX_BODY_BYTES = 2_048

export const MAX_EMAIL_LENGTH = 254
