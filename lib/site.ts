/**
 * Canonical site URL used for metadata, sitemap, robots, and JSON-LD.
 *
 * Falls back to the Vercel-provided deployment URL when available, then to a
 * placeholder. Set NEXT_PUBLIC_SITE_URL to your production domain to override.
 */
function normalizeUrl(raw: string): string {
  // Trim whitespace and any trailing slashes, and ensure an https:// scheme so
  // `new URL()` never throws on values like "recipematrix.com".
  const trimmed = raw.trim().replace(/\/+$/, '')
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    return new URL(withScheme).origin
  } catch {
    return 'https://norcook.app'
  }
}

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://norcook.app'

export const SITE_URL = normalizeUrl(rawSiteUrl)

/** Human-readable brand name used in titles, metadata, and UI. */
export const SITE_NAME = 'Norcook'
