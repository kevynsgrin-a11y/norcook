# PWA posture — decision record

**Date:** 2026-08-18 · **Owner:** unassigned (solo maintainer) · **Status:** accepted

## What ships

`app/manifest.ts` publishes a web app manifest with `display: 'standalone'`, a
name, a short name, a description, `start_url: '/'`, background and theme
colours, and two icons: `/icon.svg` (`sizes: 'any'`) and `/apple-icon.png`
(180×180).

## What deliberately does not ship

- **No service worker, and therefore no offline capability.** The site is a
  static archive of recipe pages. A service worker would add a cache-invalidation
  surface — and the ability to serve a stale food-safety callout after it has
  been corrected — in exchange for offline reading nobody has asked for. The
  safety pages are the specific reason: a withdrawn method must not survive in a
  cache. This is the decision most likely to be revisited, and the condition for
  revisiting it is a cache strategy that treats `lib/recipe-safety.ts` content as
  never-stale.
- **No 192×192 or 512×512 PNG icons, and no maskable icon.** An SVG with
  `sizes: 'any'` covers installability on current Android Chrome and desktop
  Chrome. Without them, some launchers fall back to a generated icon and the
  Android splash screen may be plain. Accepted: the install path is a
  convenience here, not a product surface.
- **No install prompt UI.** Nothing intercepts `beforeinstallprompt`.

## Consequence for the release checklist

`manifestDecisionDocumented` passes on the strength of this file — the manifest
is a stated decision with its gaps named, not an unexamined default. It does
**not** claim the manifest is complete for every launcher.
