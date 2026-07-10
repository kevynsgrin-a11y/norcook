'use client'

import type { Recipe } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Check, Loader2, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

/**
 * One-click "Add to Cart" — posts the recipe to our Instacart route, which
 * structures the Create-a-Recipe-Page payload and returns a shoppable URL.
 */

type Status = 'idle' | 'loading' | 'done'

export function AddToCartButton({
  recipe,
  variant = 'pill',
  className,
}: {
  recipe: Recipe
  variant?: 'pill' | 'full'
  className?: string
}) {
  const [status, setStatus] = useState<Status>('idle')

  async function handleClick() {
    if (status !== 'idle') return
    setStatus('loading')
    try {
      const res = await fetch('/api/instacart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: recipe.id }),
      })
      const data = (await res.json()) as { products_link_url?: string }
      setStatus('done')
      if (data.products_link_url) {
        window.open(data.products_link_url, '_blank', 'noopener,noreferrer')
      }
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('idle')
    }
  }

  const label =
    status === 'done'
      ? 'Added to cart'
      : status === 'loading'
        ? 'Building cart…'
        : `Shop ${recipe.ingredients.length} ingredients`

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status !== 'idle'}
      aria-label={`Add ${recipe.title} ingredients to Instacart`}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground shadow-lg transition active:scale-95 disabled:opacity-90',
        variant === 'pill' ? 'px-4 py-2.5 text-sm' : 'w-full px-5 py-3.5 text-base',
        className,
      )}
    >
      {status === 'loading' ? (
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
      ) : status === 'done' ? (
        <Check className="size-5" aria-hidden="true" />
      ) : (
        <ShoppingCart className="size-5" aria-hidden="true" />
      )}
      <span>{label}</span>
    </button>
  )
}
