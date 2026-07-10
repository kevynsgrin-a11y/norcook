/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // High-res food photography: serve modern, smaller formats and cache the
    // optimized variants aggressively on disk. This is the web analog of a
    // native image cache (expo-image) — transformed AVIF/WebP renditions are
    // reused across requests instead of re-fetching/re-decoding full-res files.
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [360, 480, 640, 828, 1080, 1200, 1600],
    imageSizes: [48, 64, 96, 128, 256, 384],
  },
}

export default nextConfig
