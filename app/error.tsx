'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { ErrorRouteTracker } from '@/components/analytics/error-route-tracker'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
      <ErrorRouteTracker status={500} routeKind="runtime_error" />
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        Kitchen interruption
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground">
        Something did not finish cooking
      </h1>
      <p className="mt-4 max-w-lg text-muted-foreground">
        Try the page again. If the problem continues, return to the recipe index.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Try again
        </button>
        <Link
          href="/#recipes"
          className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground"
        >
          Recipe index
        </Link>
      </div>
    </main>
  )
}
