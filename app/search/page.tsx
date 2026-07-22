import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { searchRecipes } from '@/lib/search'
import { RecipeCard } from '@/components/recipe-card'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search 77 Norwegian recipes by name, ingredient or region.',
  // Query-string result pages are thin/duplicative — keep them out of the index
  // while still letting crawlers follow through to the recipes.
  robots: { index: false, follow: true },
  alternates: { canonical: '/search' },
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const query = q.trim()
  const results = query ? searchRecipes(query) : []

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[70vh] max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Search the Index
        </h1>

        <form
          action="/search"
          method="get"
          role="search"
          className="mt-6 flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-card p-2 pl-5 focus-within:ring-2 focus-within:ring-primary/40"
        >
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            autoFocus
            placeholder="Search fjord seafood, cured meats, cardamom bakes…"
            aria-label="Search recipes"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
          >
            Search
          </button>
        </form>

        {query ? (
          <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
            {results.length === 0
              ? 'No recipes matched '
              : `${results.length} ${
                  results.length === 1 ? 'recipe' : 'recipes'
                } for `}
            <span className="font-semibold text-foreground">
              “{query}”
            </span>
          </p>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Try a dish, an ingredient, or a region — “gravlaks”, “cardamom”,
            “Vestlandet”.
          </p>
        )}

        {results.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((recipe) => (
              <RecipeCard key={recipe.slug} recipe={recipe} />
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing here yet. Check the spelling, or browse the full index
              instead.
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
