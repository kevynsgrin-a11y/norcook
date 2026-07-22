'use client'

import Link from 'next/link'
import { useLayoutEffect, useReducer } from 'react'
import { Bookmark } from 'lucide-react'
import { RECIPES } from '@/lib/recipes'
import { RecipeCard } from '@/components/recipe-card'

// Recipe cards persist favourites under this key prefix (see recipe-card.tsx).
const FAVORITE_PREFIX = 'norcook-favorite:'

function readSavedSlugs(): string[] {
  const slugs: string[] = []
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i)
      if (
        key &&
        key.startsWith(FAVORITE_PREFIX) &&
        window.localStorage.getItem(key) === 'true'
      ) {
        slugs.push(key.slice(FAVORITE_PREFIX.length))
      }
    }
  } catch {
    /* ignore private-mode / access errors */
  }
  return slugs
}

export function SavedList() {
  // null = not yet read from localStorage (pre-hydration). A parameterless
  // reducer + layout effect mirrors the codebase's hydration pattern and keeps
  // the localStorage read out of an SSR render.
  const [savedSlugs, refresh] = useReducer(
    (): string[] | null => readSavedSlugs(),
    null,
  )

  useLayoutEffect(() => {
    refresh()

    // Reflect saves/removes made in other tabs (or a full clear, key === null).
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key.startsWith(FAVORITE_PREFIX)) {
        refresh()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const saved = (savedSlugs ?? [])
    .map((slug) => RECIPES.find((recipe) => recipe.slug === slug))
    .filter((recipe): recipe is (typeof RECIPES)[number] => Boolean(recipe))

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-10">
        <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
          Your Collection
        </span>
        <h1 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Saved Recipes
        </h1>
        <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Recipes you&apos;ve bookmarked, kept on this device.
        </p>
      </div>

      {savedSlugs === null ? (
        // Pre-hydration: show a neutral placeholder, not a "nothing saved" flash.
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center text-sm text-muted-foreground">
          Loading your saved recipes…
        </div>
      ) : saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
          <Bookmark aria-hidden="true" className="size-8 text-muted-foreground/50" />
          <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
            Nothing saved yet
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Tap the bookmark on any recipe to keep it here for later.
          </p>
          <Link
            href="/#recipes"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Browse the index
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  )
}
