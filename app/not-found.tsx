import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import { ErrorRouteTracker } from '@/components/analytics/error-route-tracker'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <ErrorRouteTracker status={404} routeKind="not_found" />
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          404 · Off the map
        </p>
        <h1 className="mt-4 text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          This trail ends before the kitchen
        </h1>
        <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          The page may have moved, or the address may be incomplete. Return to
          the recipe index and search Norway’s regional archive.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Home
          </Link>
          <Link
            href="/#recipes"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            <Search aria-hidden="true" className="size-4" />
            Browse recipes
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
