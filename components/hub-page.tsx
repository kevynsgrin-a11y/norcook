import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import type { Hub } from '@/lib/hubs'
import type { Recipe } from '@/lib/recipes'
import { absoluteUrl } from '@/lib/site'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { RecipeCard } from '@/components/recipe-card'
import { HubGlossary } from '@/components/hub-glossary'
import { HubSourcePanel } from '@/components/hub-source-panel'

/** Shared shell for every hub, so region and season pages cannot drift apart. */
export function HubPage({
  hub,
  eyebrow,
  path,
  recipes,
}: {
  hub: Hub
  eyebrow: string
  path: string
  recipes: Recipe[]
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hub.title,
    description: hub.metaDescription,
    url: absoluteUrl(path),
    dateModified: hub.checkedOn,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: recipes.length,
      itemListElement: recipes.map((recipe, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: recipe.name,
        url: absoluteUrl(`/recipes/${recipe.slug}`),
      })),
    },
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />

        <section className="border-b border-border bg-card/40">
          <div className="mx-auto max-w-4xl px-4 pb-14 pt-28 sm:px-6">
            <Link
              href="/#recipes"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to the index
            </Link>
            <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {hub.title}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {hub.standfirst}
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              {recipes.length} recipes · content last checked{' '}
              <time dateTime={hub.checkedOn}>{hub.checkedOn}</time>
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="space-y-5">
            {hub.intro.map((paragraph) => (
              <p
                key={paragraph}
                className="text-pretty text-[17px] leading-[1.8] text-foreground/85"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {hub.safetyNote && (
          <section
            aria-labelledby="hub-safety-heading"
            className="mx-auto max-w-4xl px-4 pb-4 sm:px-6"
          >
            <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
              <AlertTriangle
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-300"
              />
              <div>
                <h2
                  id="hub-safety-heading"
                  className="font-display text-base font-bold tracking-tight text-foreground"
                >
                  Before you cook from this list
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  {hub.safetyNote}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Recipes in this collection
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.slug} recipe={recipe} />
            ))}
          </div>
        </section>

        <HubGlossary entries={hub.glossary} />
        <HubSourcePanel sources={hub.sources} checkedOn={hub.checkedOn} />
      </main>
      <SiteFooter />
    </>
  )
}
