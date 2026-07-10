'use client'

import { MasonryGrid } from '@/components/desktop/masonry-grid'
import { DiscoverToolbar } from '@/components/discover/discover-toolbar'
import {
  LoadingAnnounce,
  MasonrySkeleton,
} from '@/components/discover/discover-skeleton'
import type { Recipe } from '@/lib/types'
import { SearchX } from 'lucide-react'
import { useMemo, useState, useTransition } from 'react'

/**
 * Client owner of the Discover experience: renders the sticky glass search +
 * filter toolbar, filters the SSR-provided recipes, and swaps the masonry grid
 * for a themed skeleton during filter transitions (no spinners). Initial order
 * is preserved from the server-rendered trending leaderboard.
 */

const ALL = 'All'

function matches(recipe: Recipe, q: string): boolean {
  if (!q) return true
  const needle = q.toLowerCase()
  return (
    recipe.title.toLowerCase().includes(needle) ||
    recipe.cuisine.toLowerCase().includes(needle) ||
    recipe.creator.name.toLowerCase().includes(needle) ||
    recipe.creator.handle.toLowerCase().includes(needle) ||
    recipe.tags.some((t) => t.toLowerCase().includes(needle)) ||
    recipe.ingredients.some((i) => i.name.toLowerCase().includes(needle))
  )
}

export function DiscoverFeed({ recipes }: { recipes: Recipe[] }) {
  const [query, setQuery] = useState('')
  const [activeCuisine, setActiveCuisine] = useState(ALL)
  const [isPending, startTransition] = useTransition()

  const cuisines = useMemo(() => {
    const set = new Set(recipes.map((r) => r.cuisine))
    return [ALL, ...Array.from(set).sort()]
  }, [recipes])

  const filtered = useMemo(
    () =>
      recipes.filter(
        (r) =>
          (activeCuisine === ALL || r.cuisine === activeCuisine) &&
          matches(r, query),
      ),
    [recipes, query, activeCuisine],
  )

  function handleQuery(value: string) {
    startTransition(() => setQuery(value))
  }
  function handleCuisine(value: string) {
    startTransition(() => setActiveCuisine(value))
  }

  return (
    <div>
      <DiscoverToolbar
        query={query}
        onQueryChange={handleQuery}
        cuisines={cuisines}
        activeCuisine={activeCuisine}
        onCuisineChange={handleCuisine}
        resultCount={filtered.length}
      />

      <div className="pt-6">
        <LoadingAnnounce />
        {isPending ? (
          <MasonrySkeleton count={12} />
        ) : filtered.length > 0 ? (
          <MasonryGrid recipes={filtered} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-border/60 bg-card/40 py-20 text-center">
            <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-balance font-heading text-lg font-bold">
              No recipes match your search
            </p>
            <p className="max-w-sm text-pretty text-sm text-muted-foreground">
              Try a different cuisine or clear the filters to see everything
              trending right now.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
