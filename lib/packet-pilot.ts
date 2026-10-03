/**
 * packet-pilot.ts — Wave 0 pilot renderer (Recipe Finalz presentation layer).
 *
 * Serves /recipes/kanelsnurrer from the composed packet instead of the legacy
 * data model: the packet's pre-built skeleton IS the markup-contract HTML
 * (one content container, direct-child data-block elements, sticky jump bar,
 * quantities only in the shared .rpc-card). This module only applies the
 * deployment-time transforms and fails loud on skeleton drift — it never
 * silently ships orphaned markup.
 *
 * Deterministic rebuild of the packet itself:
 *   node scripts/compose-presentation.mjs --all-final --write  (Recipe Finalz)
 */
import packetJson from '../content/packets/kanelsnurrer.json'

export const PILOT_SLUG = 'kanelsnurrer'

/** The site's own real photograph, already served at this path. */
const PILOT_HERO = '/images/recipes/kanelsnurrer.webp' // 1024 × 1024
const ORIGIN = 'https://www.norcook.app'

interface Packet {
  skeleton: string
  jsonld: Record<string, unknown>
  meta: { slug: string }
}

const p = packetJson as unknown as Packet

export function pilotJsonld(): Record<string, unknown> {
  const ld = { ...p.jsonld }
  ld.image = [ORIGIN + PILOT_HERO]
  // Nothing visible to match — never ship crowd data.
  delete ld.aggregateRating
  return ld
}

/** Article HTML for the pilot route; throws on any skeleton drift. */
export function renderPilotArticle(): string {
  let body = p.skeleton
  const heroAlt =
    body.match(/<figure data-block="hero"><img[^>]*alt="([^"]*)"/)?.[1] ?? p.meta.slug
  const heroCap =
    body.match(/<figure data-block="hero">[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption>/)?.[1] ?? ''
  const heroImg = `<img src="${PILOT_HERO}" width="1024" height="1024" style="aspect-ratio:4/3;object-fit:cover" alt="${heroAlt}" fetchpriority="high" decoding="async">`
  body = body.replace(
    /<figure data-block="hero">[\s\S]*?<\/figure>/,
    `<figure data-block="hero">${heroImg}${heroCap ? `<figcaption>${heroCap}</figcaption>` : ''}</figure>`
  )
  body = body.replace(
    /<figure data-shot="CARD"><img[^>]*><\/figure>/,
    `<figure data-shot="CARD"><img src="${PILOT_HERO}" width="1024" height="1024" style="aspect-ratio:1/1" alt="${heroAlt}" fetchpriority="high" decoding="async"></figure>`
  )
  // Real-only media: unmapped shot placeholders are stripped as whole tags.
  body = body.replace(/<img src="\/assets\/recipes\/"[^>]*>/g, '')
  if (body.includes('src="/assets/recipes/"'))
    throw new Error('pilot packet drift: placeholder survived full-tag strip')
  const heroHits = body.split(PILOT_HERO).length - 1
  if (heroHits !== 2)
    throw new Error(`pilot packet drift: expected hero+card twice, got ${heroHits}`)
  // The approved technique micro-video (disclosed-AI, reviewed placement)
  // stays on the page — inserted ahead of the recipe card, where the e2e
  // imageops contract expects it.
  const VIDEO =
    '<figure data-block="technique-video" style="margin:20px 0">' +
    '<video src="/assets/video/technique-micro.mp4" width="1366" height="768" data-imageops-asset="technique-micro.mp4" aria-label="Hands shaping a strip of dough into a knot" controls muted playsInline preload="none" style="width:100%;height:auto"></video>' +
    '<figcaption>AI-created dough-shaping illustration, not a complete recipe demonstration. Follow the written method above.</figcaption>' +
    '</figure>'
  const CARD_ANCHOR = '<section class="rpc-card"'
  if (!body.includes(CARD_ANCHOR))
    throw new Error('pilot packet drift: recipe card anchor missing')
  body = body.replace(CARD_ANCHOR, VIDEO + CARD_ANCHOR)
  // Recipe JSON-LD from the packet, after the article per site convention.
  const ld = `<script type="application/ld+json">${JSON.stringify(pilotJsonld()).replace(/</g, '\\u003c')}</script>`
  return body + ld
}

export const PILOT_CSS = `
/* ---- Recipe packet pilot (kanelsnurrer) --------------------------------- */
.rpc-container{max-width:780px;margin:0 auto;padding:0 4px 8px}
[data-block]{margin:20px 0}
.rpc-meta{color:hsl(var(--muted-foreground,215 16% 45%));font-size:15px;margin:4px 0 0}
[data-block="jump-bar"]{position:sticky;top:0;z-index:20;display:flex;gap:16px;flex-wrap:wrap;background:hsl(var(--background,0 0% 100%) / .96);border-block:1px solid hsl(var(--border,30 20% 85%));padding:10px 2px;font-size:14px}
[data-block="jump-bar"] a,[data-block="jump-bar"] button{color:inherit;font:inherit;text-decoration:underline;text-underline-offset:3px;background:none;border:0;padding:0;cursor:pointer}
[data-block="hero"] img{width:100%;height:auto;display:block;border-radius:10px;object-fit:cover}
[data-block] figcaption{color:hsl(var(--muted-foreground,215 16% 45%));font-size:13.5px;margin-top:6px}
.rpc-card{background:hsl(var(--card,0 0% 100%));border:1.5px solid hsl(var(--border,30 20% 85%));border-radius:12px;padding:16px 20px}
.rpc-card figure img{width:170px;height:170px;object-fit:cover;border-radius:8px;float:right;margin:0 0 10px 14px}
.rpc-times{display:flex;gap:18px;flex-wrap:wrap;font-size:14px;margin:8px 0}
[data-block="step"]{border-left:3px solid hsl(var(--border,30 20% 85%));padding-left:14px}
.checkpoint{background:hsl(var(--muted,30 20% 95%));border-radius:8px;padding:8px 12px;font-size:14.5px}
.chef-note{border:1px dashed hsl(var(--border,30 20% 70%));border-radius:8px;padding:10px 12px;font-size:14.5px}
[data-block="troubleshooting"] table{width:100%;border-collapse:collapse;font-size:14.5px}
[data-block="troubleshooting"] th,[data-block="troubleshooting"] td{border:1px solid hsl(var(--border,30 20% 88%));padding:6px 8px;text-align:left;vertical-align:top}
@media print{[data-block="jump-bar"]{display:none}}
`
