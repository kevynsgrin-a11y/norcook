'use client'

import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'

/**
 * Sticky, warm-frosted toolbar for the Discover feed: a search field plus a
 * horizontally scrollable row of cuisine filter chips. The `.glass-warm`
 * surface + backdrop blur let recipe posters glide visibly underneath as the
 * user scrolls. Sits directly below the site header (top-16).
 */

export function DiscoverToolbar({
  query,
  onQueryChange,
  cuisines,
  activeCuisine,
  onCuisineChange,
  resultCount,
}: {
  query: string
  onQueryChange: (value: string) => void
  cuisines: string[]
  activeCuisine: string
  onCuisineChange: (value: string) => void
  resultCount: number
}) {
  return (
    <div className="glass-warm sticky top-16 z-30 -mx-6 border-b border-border/60 px-6 py-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              inputMode="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search recipes, creators, ingredients..."
              aria-label="Search recipes"
              className="h-11 w-full rounded-full border border-border/70 bg-background/40 pl-10 pr-10 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/70 focus:ring-2 focus:ring-primary/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition hover:bg-background/60 hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:inline">
            {resultCount} {resultCount === 1 ? 'recipe' : 'recipes'}
          </span>
        </div>

        <div
          className="no-scrollbar flex items-center gap-2 overflow-x-auto"
          role="group"
          aria-label="Filter by cuisine"
        >
          {cuisines.map((cuisine) => {
            const active = cuisine === activeCuisine
            return (
              <button
                key={cuisine}
                type="button"
                onClick={() => onCuisineChange(cuisine)}
                aria-pressed={active}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border/70 bg-background/30 text-muted-foreground hover:border-primary/50 hover:text-foreground',
                )}
              >
                {cuisine}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
