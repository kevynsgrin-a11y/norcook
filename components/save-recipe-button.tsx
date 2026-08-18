'use client'

import { useSyncExternalStore } from 'react'
import { Bookmark } from 'lucide-react'
import { useConsent } from '@/components/analytics/consent-provider'
import { isSaved as readSaved, setSaved, subscribe } from '@/lib/favorites'

/**
 * The one save control on the site. Cards use the `icon` variant, recipe pages
 * the `labelled` one, so the two surfaces can never drift apart in state,
 * wording, or accessible name.
 */
export function SaveRecipeButton({
  slug,
  name,
  variant = 'icon',
}: {
  slug: string
  name: string
  variant?: 'icon' | 'labelled'
}) {
  const { trackEvent } = useConsent()
  const saved = useSyncExternalStore(
    subscribe,
    () => readSaved(slug),
    () => false,
  )

  function toggle() {
    const nextSaved = !saved
    setSaved(slug, nextSaved)
    trackEvent('favorite_toggle', { recipe_slug: slug, saved: nextSaved })
  }

  const label = saved
    ? `Remove ${name} from saved recipes`
    : `Save ${name} to saved recipes`

  if (variant === 'labelled') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        aria-label={label}
        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
      >
        <Bookmark
          aria-hidden="true"
          className={`size-4 ${saved ? 'fill-current' : ''}`}
        />
        {saved ? 'Saved' : 'Save recipe'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={label}
      className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-white/85 text-slate-900 backdrop-blur-md transition-transform hover:scale-110 active:scale-95 dark:bg-black/50 dark:text-white"
    >
      <Bookmark
        aria-hidden="true"
        className={`size-4 ${saved ? 'fill-accent text-accent' : ''}`}
      />
    </button>
  )
}
