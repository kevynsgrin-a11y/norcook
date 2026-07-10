'use client'

import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { MacroLegend } from '@/components/macros/macro-rings'
import type { Recipe } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ChevronUp, Clock, Flame, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/**
 * Shoreburst Drawer — a frosted-glass sheet anchored to the bottom of a feed
 * item. Collapsed it shows the title + a peek of ingredients; swipe (or tap)
 * up and it expands to the full structured recipe while the looping video
 * stays visible behind the backdrop-filter.
 */

export function RecipeDrawer({ recipe }: { recipe: Recipe }) {
  const [expanded, setExpanded] = useState(false)
  const dragStartY = useRef<number | null>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  // Close on Escape for accessibility.
  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded])

  function onTouchStart(e: React.TouchEvent) {
    dragStartY.current = e.touches[0].clientY
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (dragStartY.current === null) return
    const delta = e.changedTouches[0].clientY - dragStartY.current
    if (delta < -40) setExpanded(true)
    else if (delta > 40) setExpanded(false)
    dragStartY.current = null
  }

  return (
    <div
      ref={sheetRef}
      className={cn(
        'absolute inset-x-0 bottom-0 z-30 flex flex-col rounded-t-3xl glass-strong transition-[max-height] duration-400 ease-out',
        expanded ? 'max-h-[78%]' : 'max-h-[32%]',
      )}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Grab handle / toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse recipe' : 'Expand recipe'}
        className="flex w-full flex-col items-center gap-2 px-5 pb-2 pt-3"
      >
        <span className="h-1.5 w-10 rounded-full bg-foreground/40" />
        <div className="flex w-full items-center justify-between gap-3">
          <div className="min-w-0 text-left">
            <h2 className="truncate text-balance text-lg font-bold leading-tight">
              {recipe.title}
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              @{recipe.creator.handle} · {recipe.cuisine}
            </p>
          </div>
          <ChevronUp
            className={cn(
              'size-5 shrink-0 text-muted-foreground transition-transform',
              expanded && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </div>
      </button>

      <div className="flex items-center gap-4 px-5 pb-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" aria-hidden="true" /> {recipe.totalTimeMinutes}m
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="size-3.5" aria-hidden="true" /> {recipe.servings} servings
        </span>
        <span className="inline-flex items-center gap-1">
          <Flame className="size-3.5" aria-hidden="true" /> {recipe.macros.calories} kcal
        </span>
      </div>

      {/* Scrollable body */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-28">
        <p className="text-pretty text-sm leading-relaxed text-foreground/90">
          {recipe.description}
        </p>

        <div className="mt-4">
          <MacroLegend macros={recipe.macros} />
        </div>

        <section className="mt-6">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">
            Ingredients
          </h3>
          <ul className="divide-y divide-border">
            {recipe.ingredients.map((ing) => (
              <li
                key={ing.id}
                className="flex items-center justify-between gap-3 py-2 text-sm"
              >
                <span className="text-foreground/90">{ing.name}</span>
                <span className="shrink-0 font-mono text-muted-foreground">
                  {ing.quantity}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">
            Method
          </h3>
          <ol className="flex flex-col gap-3">
            {recipe.steps.map((step) => (
              <li key={step.id} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs font-bold">
                  {step.order}
                </span>
                <div>
                  <p className="text-pretty text-sm leading-relaxed">{step.text}</p>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {formatTimecode(step.startOffset)}–{formatTimecode(step.endOffset)}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Persistent cart CTA */}
      <div className="absolute inset-x-0 bottom-0 border-t border-border glass px-5 py-3">
        <AddToCartButton recipe={recipe} variant="full" />
      </div>
    </div>
  )
}

function formatTimecode(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
