'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Bookmark, Menu, Search, X } from 'lucide-react'
import { REGIONS } from '@/lib/recipes'
import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled
          ? 'glass border-border/60'
          : 'border-transparent bg-transparent'
      }`}
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
              href={`/#${region.slug}`}
              className="group flex flex-col text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
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
            className="hidden size-9 items-center justify-center rounded-full border border-border/70 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
          >
            <Search className="size-4" />
          </Link>
          <Link
            href="/saved"
            aria-label="Saved recipes"
            className="hidden size-9 items-center justify-center rounded-full border border-border/70 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
          >
            <Bookmark className="size-4" />
          </Link>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border/70 text-foreground/80 transition-colors hover:bg-secondary lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="glass border-t border-border/60 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {REGIONS.map((region) => (
              <Link
                key={region.slug}
                href={`/#${region.slug}`}
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
              href="/saved"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 py-3 text-sm font-medium text-foreground/90"
            >
              <Bookmark className="size-4" />
              Saved recipes
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
