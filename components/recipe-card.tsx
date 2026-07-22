'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLayoutEffect, useReducer } from 'react'
import { ArrowRight, Bookmark, Clock, Gauge } from 'lucide-react'
import { useConsent } from '@/components/analytics/consent-provider'
import type { Recipe } from '@/lib/recipes'
import { getRegion } from '@/lib/recipes'

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [hydrated, markHydrated] = useReducer(() => true, false)
  const region = getRegion(recipe.region)
  const { trackEvent } = useConsent()
  const favoriteKey = `norcook-favorite:${recipe.slug}`
  const saved =
    hydrated && window.localStorage.getItem(favoriteKey) === 'true'

  useLayoutEffect(() => {
    markHydrated()
  }, [])

  function toggleFavorite(event: React.MouseEvent<HTMLButtonElement>) {
    const nextSaved =
      window.localStorage.getItem(favoriteKey) !== 'true'
    window.localStorage.setItem(favoriteKey, String(nextSaved))
    event.currentTarget.setAttribute('aria-pressed', String(nextSaved))
    event.currentTarget.setAttribute(
      'aria-label',
      nextSaved ? 'Remove from favorites' : 'Save to favorites',
    )
    const icon = event.currentTarget.querySelector('svg')
    icon?.classList.toggle('fill-accent', nextSaved)
    icon?.classList.toggle('text-accent', nextSaved)
    trackEvent('favorite_toggle', {
      recipe_slug: recipe.slug,
      saved: nextSaved,
    })
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={recipe.image || '/placeholder.svg'}
          alt={recipe.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {region && (
          <span className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            {region.name}
          </span>
        )}

        <button
          type="button"
          onClick={toggleFavorite}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-white/85 text-slate-900 backdrop-blur-md transition-transform hover:scale-110 active:scale-95 dark:bg-black/50 dark:text-white"
        >
          <Bookmark
            className={`size-4 ${saved ? 'fill-accent text-accent' : ''}`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Gauge aria-hidden="true" className="size-3.5" />
            {recipe.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {recipe.cookingTime}
          </span>
        </div>

        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
          {recipe.name}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {recipe.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {recipe.mainIngredients.slice(0, 4).map((ing) => (
            <span
              key={ing}
              className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
            >
              {ing}
            </span>
          ))}
        </div>

        <Link
          href={`/recipes/${recipe.slug}`}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          View Recipe
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}
