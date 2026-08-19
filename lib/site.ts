export const SITE_NAME = 'Norcook'
export const SITE_URL = 'https://www.norcook.app'
export const SITE_DESCRIPTION =
  'A cultural guide to Norway through regional recipes, food history, and careful kitchen guidance.'
export const CONTENT_REVIEW_DATE = '2026-07-21'

/**
 * The hubs were written after the recipe archive was last checked, so they
 * carry their own date. Borrowing CONTENT_REVIEW_DATE would have stamped every
 * hub as "checked" a month before the page existed.
 */
export const HUB_CHECKED_DATE = '2026-08-18'

/**
 * The version of the privacy copy a reader is agreeing to. It is the
 * localStorage key for the consent choice *and* the value recorded with any
 * future newsletter signup, so a stored consent can always be traced back to
 * the text that was on screen. Bump it whenever that text materially changes.
 */
export const CONSENT_VERSION = 'norcook-consent-v1'

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString()
}
