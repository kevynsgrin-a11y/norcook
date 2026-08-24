'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Bookmark, Menu, Search, X } from 'lucide-react'
import { REGIONS } from '@/lib/recipe-taxonomy'
import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      window.requestAnimationFrame(() => menuButtonRef.current?.focus())
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 shadow-sm backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            NORCOOK
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            Norway · Through Food
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {REGIONS.map((region) => (
            <Link
              key={region.slug}
              href={`/regions/${region.slug}`}
              // The header is in view on every page, so leaving prefetch on
              // would pull five hub route bundles down on every single load —
              // measured at roughly 10 KB of script transfer site-wide. In the
              // App Router `false` disables viewport *and* hover prefetching,
              // so the first click pays a navigation; that is the trade.
              prefetch={false}
              className="group flex flex-col text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {region.name}
              <span className="text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
                {region.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#recipes"
            aria-label="Search recipes"
            className="hidden size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary sm:inline-flex"
          >
            <Search aria-hidden="true" className="size-4" />
          </Link>
          <Link
            href="/saved"
            aria-label="Saved recipes"
            className="hidden size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary sm:inline-flex"
          >
            <Bookmark aria-hidden="true" className="size-4" />
          </Link>
          <ThemeToggle />
          <button
            type="button"
            ref={menuButtonRef}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary lg:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="size-4" />
            ) : (
              <Menu aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card shadow-lg lg:hidden">
          <nav
            id="mobile-navigation"
            aria-label="Primary navigation"
            className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6"
          >
            {REGIONS.map((region) => (
              <Link
                key={region.slug}
                href={`/regions/${region.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between border-b border-border/50 py-3 text-sm font-medium text-foreground/90 last:border-0"
              >
                {region.name}
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {region.label}
                </span>
              </Link>
            ))}
            <Link
              href="/seasons/jul"
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between border-b border-border/50 py-3 text-sm font-medium text-foreground/90"
            >
              Norwegian Christmas food
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Season
              </span>
            </Link>
            <Link
              href="/seasons/host"
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between border-b border-border/50 py-3 text-sm font-medium text-foreground/90"
            >
              Autumn harvest
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Season
              </span>
            </Link>
            <Link
              href="/saved"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 py-3 text-sm font-medium text-foreground/90"
            >
              <Bookmark aria-hidden="true" className="size-4" />
              Saved recipes
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
