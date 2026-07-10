'use client'

import { useEffect, useMemo, useState } from 'react'
import { RECIPES, REGIONS, TOTAL_RECIPES, type RegionSlug } from '@/lib/recipes'
import { RecipeCard } from '@/components/recipe-card'

type Filter = 'all' | RegionSlug

export function RecipeIndex() {
  const [filter, setFilter] = useState<Filter>('all')

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

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? RECIPES
        : RECIPES.filter((r) => r.region === filter),
    [filter],
  )

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
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
          All Regions
        </FilterChip>
        {REGIONS.map((region) => (
          <FilterChip
            key={region.slug}
            active={filter === region.slug}
            onClick={() => setFilter(region.slug)}
          >
            {region.name}
          </FilterChip>
        ))}
      </div>

      {/* Scroll anchors so nav #region links land on the index */}
      {REGIONS.map((region) => (
        <span key={region.slug} id={region.slug} className="block scroll-mt-24" />
      ))}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>
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
