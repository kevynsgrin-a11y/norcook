'use client'

import { RotateCcw, UtensilsCrossed } from 'lucide-react'
import Link from 'next/link'

/**
 * Themed "Recipe Unavailable" fallback shown by the route error boundaries.
 * Keeps the dark, food-forward aesthetic and offers a retry (re-runs the
 * failed render) plus a route back to the trending feed — so a bad render or
 * failed fetch degrades gracefully instead of crashing the app.
 */
export function ErrorFallback({
  reset,
  title = 'Recipe Unavailable',
  message = "We couldn't plate this one up. It may have been unpublished, or something hiccuped while loading.",
}: {
  reset?: () => void
  title?: string
  message?: string
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
        <UtensilsCrossed className="size-8 text-primary" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-balance font-heading text-2xl font-black tracking-tight">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">
        {message}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {reset && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </button>
        )}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/60"
        >
          Back to feed
        </Link>
      </div>
    </div>
  )
}
