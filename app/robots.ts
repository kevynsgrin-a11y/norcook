import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // API routes structure payloads for partners; no need to crawl them.
      disallow: '/api/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
