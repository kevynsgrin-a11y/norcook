import Link from 'next/link'
import { Compass, Search } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-28 text-center sm:px-6">
        <span className="inline-flex size-14 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
          <Compass className="size-6" />
        </span>
        <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
          404 — Off the map
        </p>
        <h1 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          This page has drifted north
        </h1>
        <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
          The recipe or page you were looking for isn&apos;t here. Head back to
          the index, or search the archive for a dish.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Back to home
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <Search className="size-4" />
            Search recipes
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
