/*
 * Norcook's PWA cache is intentionally conservative. Recipe, policy, search,
 * API, image, and document responses are never cached here, so a food-safety
 * correction cannot be served from an old worker cache. Only Next's
 * content-hashed build assets and the install icons are eligible.
 *
 * Bump CACHE_VERSION whenever the precache list or worker behaviour changes.
 * The browser rechecks /sw.js on each navigation (see next.config.mjs), then
 * this activation removes every earlier Norcook-owned cache before claim.
 */
const CACHE_VERSION = 'norcook-static-v2'
const PRECACHE_URLS = [
  '/icons/icon-180.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    cacheInstallIcons().then(() => self.skipWaiting()),
  )
})

async function cacheInstallIcons() {
  const cache = await caches.open(CACHE_VERSION)

  // Icons improve install polish but are not worth making activation atomic.
  // A transient CDN or network failure must not leave an otherwise valid worker
  // uninstalled. Future installs can populate any missed asset.
  await Promise.allSettled(
    PRECACHE_URLS.map(async (url) => {
      const response = await fetch(url, { cache: 'reload' })
      if (response.ok) await cache.put(url, response)
    }),
  )
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('norcook-') && key !== CACHE_VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

async function cacheImmutableAsset(request) {
  const cache = await caches.open(CACHE_VERSION)
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (response.ok) await cache.put(request, response.clone())
  return response
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  // Next build chunks have content-hashed filenames. They are safe to cache
  // cache-first because a new deploy references different URLs. Every other
  // response remains network-only by design.
  if (!url.pathname.startsWith('/_next/static/')) return

  event.respondWith(cacheImmutableAsset(event.request))
})
