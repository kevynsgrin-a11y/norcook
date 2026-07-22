'use client'

import { useEffect, useMemo, useState } from 'react'
import { RECIPES, REGIONS, TOTAL_RECIPES, type RegionSlug } from '@/lib/recipes'
import { useConsent } from '@/components/analytics/consent-provider'
import { RecipeCard } from '@/components/recipe-card'

type Filter = 'all' | RegionSlug
const PAGE_SIZE = 12

export function RecipeIndex() {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const { trackEvent } = useConsent()

  // Preselect a region when arriving via a #region hash from the nav.
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '') as Filter
      if (hash === 'all' || REGIONS.some((r) => r.slug === hash)) {
        setFilter(hash)
      }
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  useEffect(() => {
    const applyQuery = (nextQuery: string) => {
      setQuery(nextQuery)
      setVisibleCount(PAGE_SIZE)
    }
    const initialQuery = new URL(window.location.href).searchParams.get('q') ?? ''
    applyQuery(initialQuery)

    const onSearch = (event: Event) => {
      const searchEvent = event as CustomEvent<{ query: string }>
      applyQuery(searchEvent.detail.query)
    }
    const onPopState = () => {
      applyQuery(new URL(window.location.href).searchParams.get('q') ?? '')
    }
    window.addEventListener('norcook:search', onSearch)
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('norcook:search', onSearch)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  const filtered = useMemo(
    () => {
      const normalizedQuery = query.trim().toLocaleLowerCase()
      return RECIPES.filter((recipe) => {
        const matchesRegion = filter === 'all' || recipe.region === filter
        const haystack = [
          recipe.name,
          recipe.description,
          ...recipe.mainIngredients,
        ]
          .join(' ')
          .toLocaleLowerCase()
        return matchesRegion && (!normalizedQuery || haystack.includes(normalizedQuery))
      })
    },
    [filter, query],
  )

  const visibleRecipes = filtered.slice(0, visibleCount)

  useEffect(() => {
    if (!query.trim()) return
    trackEvent('search_submit', {
      query_length: query.trim().length,
      result_count: filtered.length,
    })
  }, [filtered.length, query, trackEvent])

  function selectFilter(nextFilter: Filter) {
    setFilter(nextFilter)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <section id="recipes" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
            The Index
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            77 Recipes, One Country
          </h2>
          <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            A living archive of Norwegian cooking. Filter by region to trace how
            landscape, weather and history shape every plate.
          </p>
        </div>
        <p className="shrink-0 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{RECIPES.length}</span>{' '}
          of {TOTAL_RECIPES} published
        </p>
      </div>

      {/* Region filter */}
      <div className="mb-10 flex flex-wrap gap-2">
        <FilterChip active={filter === 'all'} onClick={() => selectFilter('all')}>
          All Regions
        </FilterChip>
        {REGIONS.map((region) => (
          <FilterChip
            key={region.slug}
            active={filter === region.slug}
            onClick={() => selectFilter(region.slug)}
          >
            {region.name}
          </FilterChip>
        ))}
      </div>

      {/* Scroll anchors so nav #region links land on the index */}
      {REGIONS.map((region) => (
        <span key={region.slug} id={region.slug} className="block scroll-mt-24" />
      ))}

      {query && (
        <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'} for “{query}”
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleRecipes.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-medium text-foreground">No matching recipes yet.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              const url = new URL(window.location.href)
              url.searchParams.delete('q')
              window.history.replaceState({}, '', url)
            }}
            className="mt-3 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {visibleCount < filtered.length && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Show {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
          </button>
          <p className="mt-2 text-xs text-muted-foreground">
            Showing {visibleRecipes.length} of {filtered.length}
          </p>
        </div>
      )}
    </section>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-transparent text-foreground/80 hover:bg-secondary'
      }`}
    >
      {children}
    </button>
  )
}
