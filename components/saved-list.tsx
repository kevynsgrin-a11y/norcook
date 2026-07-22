'use client'

import Link from 'next/link'
import { Bookmark } from 'lucide-react'
import { RECIPES } from '@/lib/recipes'
import { RecipeCard } from '@/components/recipe-card'
import { useFavorites } from '@/components/favorites-provider'

export function SavedList() {
  const { favorites, hydrated } = useFavorites()

  // Preserve the order recipes were saved in.
  const saved = favorites
    .map((slug) => RECIPES.find((r) => r.slug === slug))
    .filter((r): r is (typeof RECIPES)[number] => Boolean(r))

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

      {/* Before hydration we don't yet know what's saved — render nothing to
          avoid an empty-state flash for readers who do have saved recipes. */}
      {!hydrated ? null : saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
          <Bookmark className="size-8 text-muted-foreground/50" />
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
