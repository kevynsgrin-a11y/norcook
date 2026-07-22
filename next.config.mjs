/** @type {import('next').NextConfig} */

// A pragmatic, Next.js-compatible CSP. 'unsafe-inline' is required for the
// theme bootstrap script in the root layout and Next's hydration inline
// scripts/styles; tightening this to a nonce-based policy via middleware is a
// sensible follow-up. next/font self-hosts fonts, so no external font host is
// needed. Vercel Analytics is allow-listed for the non-Vercel fallback host.
const isProd = process.env.NODE_ENV === 'production'

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
]

// Only force HTTPS in production — upgrading insecure requests over plain-http
// `next dev` on localhost would break local development.
if (isProd) cspDirectives.push('upgrade-insecure-requests')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspDirectives.join('; ') },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
]

// HSTS is meaningless (and undesirable) over local http — production only.
if (isProd) {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  })
}

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
