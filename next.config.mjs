const isDevelopment = process.env.NODE_ENV === 'development'
const canonicalOrigin = 'https://www.norcook.app'

/*
 * Compatibility exception, kept deliberately narrow:
 *
 * Next.js 16 emits inline bootstrap/Flight payload scripts and this app has a
 * small pre-hydration theme bootstrap. A static nonce policy would require a
 * proxy-generated nonce, force these otherwise static routes dynamic, and must
 * be introduced only with a separately verified production migration. Until
 * then, `unsafe-inline` is limited to scripts and no third-party script origin
 * is allowed in production. Inline event handlers stay blocked explicitly.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  'block-all-mixed-content',
  "connect-src 'self' https://vitals.vercel-insights.com",
  "font-src 'self' data:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "img-src 'self' data: blob:",
  "manifest-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}`,
  "script-src-attr 'none'",
  "style-src 'self'",
  // Next Image emits safe per-element presentation styles (including its
  // intrinsic-size fallback). Allow attributes only; style elements remain
  // restricted to same-origin stylesheets.
  "style-src-attr 'unsafe-inline'",
  "style-src-elem 'self'",
  'upgrade-insecure-requests',
  "worker-src 'self'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { key: 'Origin-Agent-Cluster', value: '?1' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), picture-in-picture=(), screen-wake-lock=(), serial=(), usb=(), xr-spatial-tracking=()',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const apiCorsHeaders = [
  // The newsletter endpoint is same-origin only. It deliberately has no
  // OPTIONS handler, so cross-origin JSON requests fail preflight; this exact
  // origin value also prevents a hosting-layer wildcard from widening the API.
  { key: 'Access-Control-Allow-Origin', value: canonicalOrigin },
  { key: 'Access-Control-Allow-Methods', value: 'POST' },
  { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31_536_000,
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [96, 160, 240, 320, 480],
  },
  async headers() {
    return [
      // This includes rendered pages, 404s, manifest.webmanifest, and public
      // assets. CORS is intentionally absent from the public document surface.
      { source: '/(.*)', headers: securityHeaders },
      // Only the same-origin newsletter endpoint carries CORS response
      // headers. Sensitive operational routes (such as IndexNow) inherit the
      // security baseline but are deliberately not browser-callable across
      // origins.
      { source: '/api/newsletter', headers: [...securityHeaders, ...apiCorsHeaders] },
      // A worker must be checked for updates on every navigation. The worker
      // itself owns a versioned, immutable-asset-only cache.
      {
        source: '/sw.js',
        headers: [
          ...securityHeaders,
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [
          ...securityHeaders,
          { key: 'Cache-Control', value: 'no-cache' },
        ],
      },
    ]
  },
}

export default nextConfig
