/**
 * Central site configuration.
 *
 * `SITE_URL` drives canonical URLs, Open Graph tags, the sitemap and robots
 * policy. Set `NEXT_PUBLIC_SITE_URL` in the deployment environment to the real
 * production origin (e.g. https://nordisk.no). The fallback is a placeholder so
 * local builds succeed — it must be overridden in production or the sitemap and
 * canonical URLs will point at the wrong host.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nordisk.example'
).replace(/\/$/, '')

export const SITE_NAME = 'Nordisk'

export const SITE_TAGLINE = 'The Cultural Guide to Norway Through Food'

export const SITE_DESCRIPTION =
  'A premium cultural guide exploring Norway through 77 regional recipes — from Sápmi in the Arctic north to the viral bakes of modern Oslo.'

/** Absolute URL helper for metadata that needs a fully-qualified origin. */
export function absoluteUrl(path = ''): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
