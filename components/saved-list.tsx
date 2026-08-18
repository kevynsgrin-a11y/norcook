'use client'

import Link from 'next/link'
import { useRef, useState, useSyncExternalStore } from 'react'
import { Bookmark, Download, Smartphone, Trash2 } from 'lucide-react'
import { RECIPES } from '@/lib/recipes'
import {
  clearAll,
  getEmptySlugs,
  getSavedSlugs,
  hydrationStore,
  subscribe,
} from '@/lib/favorites'
import { RecipeCard } from '@/components/recipe-card'

export function SavedList() {
  const hydrated = useSyncExternalStore(
    hydrationStore.subscribe,
    hydrationStore.getSnapshot,
    hydrationStore.getServerSnapshot,
  )
  const savedSlugs = useSyncExternalStore(subscribe, getSavedSlugs, getEmptySlugs)
  const [confirmingClear, setConfirmingClear] = useState(false)
  const emptyHeadingRef = useRef<HTMLHeadingElement>(null)

  const saved = savedSlugs
    .map((slug) => RECIPES.find((recipe) => recipe.slug === slug))
    .filter((recipe): recipe is (typeof RECIPES)[number] => Boolean(recipe))

  function confirmClear() {
    clearAll()
    setConfirmingClear(false)
    // The grid is about to be replaced by the empty state; take focus with it
    // so a keyboard user is not dropped back at the top of the document.
    requestAnimationFrame(() => emptyHeadingRef.current?.focus())
  }

  function exportSaved() {
    const payload = {
      version: 1 as const,
      recipes: saved.map((recipe) => ({
        slug: recipe.slug,
        name: recipe.name,
        url: `/recipes/${recipe.slug}`,
      })),
    }
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'norcook-saved-recipes.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-10">
        <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
          Your Collection
        </span>
        <h1 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Saved Recipes
        </h1>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Smartphone aria-hidden="true" className="size-3.5" />
          Saved on this device
        </p>
        <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          This list lives in this browser only. There is no account, no sign-in
          and no sync — clearing your browser storage clears it, and it will not
          follow you to another device.
        </p>

        {hydrated && saved.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={exportSaved}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <Download aria-hidden="true" className="size-4" />
              Download as JSON
            </button>

            {confirmingClear ? (
              <span className="inline-flex flex-wrap items-center gap-3 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm">
                <span className="font-medium text-foreground">
                  Remove all {saved.length}{' '}
                  {saved.length === 1 ? 'recipe' : 'recipes'}?
                </span>
                <button
                  type="button"
                  onClick={confirmClear}
                  className="font-semibold text-destructive underline-offset-4 hover:underline"
                >
                  Yes, clear all
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingClear(false)}
                  className="font-semibold text-muted-foreground underline-offset-4 hover:underline"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingClear(true)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {!hydrated ? (
        // Pre-hydration: a neutral placeholder, not a "nothing saved" flash.
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center text-sm text-muted-foreground">
          Loading your saved recipes…
        </div>
      ) : saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
          <Bookmark aria-hidden="true" className="size-8 text-muted-foreground/50" />
          <h2
            ref={emptyHeadingRef}
            tabIndex={-1}
            className="mt-4 font-display text-xl font-semibold text-foreground"
          >
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
