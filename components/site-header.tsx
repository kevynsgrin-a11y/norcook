import { Flame, LayoutGrid, Search } from 'lucide-react'
import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border glass">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Flame className="size-5" aria-hidden="true" />
          </span>
          <span className="font-heading text-xl font-black tracking-tight">
            RecipeMatrix
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/" className="text-foreground transition hover:text-primary">
            Trending
          </Link>
          <Link href="/dashboard" className="transition hover:text-foreground">
            Creator Studio
          </Link>
          <span className="cursor-default">Cuisines</span>
          <span className="cursor-default">Saved</span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search recipes"
            className="rounded-full border border-border bg-card p-2 text-muted-foreground transition hover:text-foreground"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <LayoutGrid className="size-4" aria-hidden="true" />
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  )
}
