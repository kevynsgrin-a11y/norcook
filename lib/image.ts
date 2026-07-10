/**
 * Shared image helpers for the Shoreburst feed.
 *
 * `shimmer` builds a tiny inline SVG blur placeholder tinted with the warm
 * ember palette, so high-res posters fade in from a themed shimmer instead of
 * flashing empty boxes (perceived-performance win + nostalgic warmth). Paired
 * with next/image's on-disk optimization cache, off-screen posters stay light
 * until they scroll into view.
 */

/** Fallback shown when a poster/avatar fails to fetch or decode. */
export const IMAGE_FALLBACK = '/placeholder.svg'

function toBase64(str: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64')
  }
  return window.btoa(str)
}

/**
 * Warm, dark shimmer gradient (charcoal → ember) sized to the image box.
 * Returned as a data URL suitable for next/image `blurDataURL`.
 */
export function shimmer(width = 40, height = 40): string {
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#241d18" />
      <stop offset="50%" stop-color="#3a2c22" />
      <stop offset="100%" stop-color="#241d18" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#241d18" />
  <rect width="${width}" height="${height}" fill="url(#g)" opacity="0.85" />
</svg>`.trim()
  return `data:image/svg+xml;base64,${toBase64(svg)}`
}

/** Precomputed blur for the common landscape/portrait poster aspect. */
export const POSTER_BLUR = shimmer(20, 26)
