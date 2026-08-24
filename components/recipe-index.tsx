'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Recipe } from '@/lib/recipes'
import { REGIONS, TOTAL_RECIPES, type RegionSlug } from '@/lib/recipe-taxonomy'
import { RecipeCard } from '@/components/recipe-card'

type Filter = 'all' | RegionSlug
type RecipePreview = Pick<
  Recipe,
  | 'slug'
  | 'name'
  | 'region'
  | 'description'
  | 'image'
  | 'cookingTime'
  | 'difficulty'
  | 'mainIngredients'
>

const PAGE_SIZE = 12

let recipeCorpusPromise: Promise<RecipePreview[]> | undefined

function toRecipePreview(recipe: Recipe): RecipePreview {
  return {
    slug: recipe.slug,
    name: recipe.name,
    region: recipe.region,
    description: recipe.description,
    image: recipe.image,
    cookingTime: recipe.cookingTime,
    difficulty: recipe.difficulty,
    mainIngredients: recipe.mainIngredients,
  }
}

function loadRecipeCorpus() {
  recipeCorpusPromise ??= import('@/lib/recipes').then(({ RECIPES }) =>
    RECIPES.map(toRecipePreview),
  )
  return recipeCorpusPromise
}

/**
 * The initial payload is deliberately limited to the twelve cards the reader
 * can see. The complete recipe corpus is fetched only when a reader searches,
 * filters, or asks to reveal more, keeping the home page's initial JavaScript
 * and RSC payload focused on the visible experience.
 */
export function RecipeIndex({ initialRecipes }: { initialRecipes: RecipePreview[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [recipeCorpus, setRecipeCorpus] = useState<RecipePreview[] | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

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

  const hasQuery = Boolean(query.trim())
  const needsFullCorpus = filter !== 'all' || hasQuery

  useEffect(() => {
    if (!needsFullCorpus || recipeCorpus) return

    let isCurrent = true

    void loadRecipeCorpus()
      .then((recipes) => {
        if (isCurrent) setRecipeCorpus(recipes)
      })

    return () => {
      isCurrent = false
    }
  }, [needsFullCorpus, recipeCorpus])

  const filtered = useMemo(
    () => {
      // Do not show a false zero-result state while an interaction loads the
      // remaining recipe corpus.
      if (needsFullCorpus && !recipeCorpus) return []

      const normalizedQuery = query.trim().toLocaleLowerCase()
      return (recipeCorpus ?? initialRecipes).filter((recipe) => {
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
    [filter, initialRecipes, needsFullCorpus, query, recipeCorpus],
  )

  const visibleRecipes = filtered.slice(0, visibleCount)
  const isLoadingCorpus = isLoadingMore || (needsFullCorpus && !recipeCorpus)
  const hasMoreToShow = recipeCorpus
    ? visibleCount < filtered.length
    : !needsFullCorpus && initialRecipes.length < TOTAL_RECIPES
  const nextPageSize = recipeCorpus
    ? Math.min(PAGE_SIZE, filtered.length - visibleCount)
    : Math.min(PAGE_SIZE, TOTAL_RECIPES - visibleCount)

  function selectFilter(nextFilter: Filter) {
    setFilter(nextFilter)
    setVisibleCount(PAGE_SIZE)
  }

  async function showMore() {
    if (recipeCorpus) {
      setVisibleCount((count) => count + PAGE_SIZE)
      return
    }

    setIsLoadingMore(true)
    try {
      const recipes = await loadRecipeCorpus()
      setRecipeCorpus(recipes)
      setVisibleCount((count) => count + PAGE_SIZE)
    } finally {
      setIsLoadingMore(false)
    }
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
          <span className="font-semibold text-foreground">{TOTAL_RECIPES}</span>{' '}
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
          {needsFullCorpus && !recipeCorpus
            ? `Searching the full index for “${query}”`
            : `${filtered.length} ${filtered.length === 1 ? 'result' : 'results'} for “${query}”`}
        </p>
      )}

      {needsFullCorpus && !recipeCorpus && (
        <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
          Loading the full recipe index…
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleRecipes.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>

      {!isLoadingCorpus && !(needsFullCorpus && !recipeCorpus) && filtered.length === 0 && (
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

      {hasMoreToShow && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={showMore}
            disabled={isLoadingCorpus}
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-wait disabled:opacity-70"
          >
            {isLoadingCorpus ? 'Loading full index…' : `Show ${nextPageSize} more`}
          </button>
          {recipeCorpus && (
            <p className="mt-2 text-xs text-muted-foreground">
              Showing {visibleRecipes.length} of {filtered.length}
            </p>
          )}
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
