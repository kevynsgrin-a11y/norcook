import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  ArrowLeft,
  ChefHat,
  Clock,
  Flame,
  Lightbulb,
  Star,
} from 'lucide-react'
import { RECIPES, getRecipe, getRegion } from '@/lib/recipes'
import { SITE_NAME } from '@/lib/site'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { RecommendedTools } from '@/components/recommended-tools'
import { RecipeJsonLd } from '@/components/recipe-json-ld'
import { InContentAd, StickyFooterAd } from '@/components/ad-slot'

export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const recipe = getRecipe(slug)
  if (!recipe) return { title: 'Recipe not found' }
  return {
    title: recipe.name,
    description: recipe.description,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: {
      type: 'article',
      // Next.js replaces (does not deep-merge) the root openGraph, so siteName
      // and locale must be repeated here or recipe pages lose them.
      siteName: SITE_NAME,
      locale: 'en_US',
      title: recipe.name,
      description: recipe.description,
      url: `/recipes/${recipe.slug}`,
      images: [{ url: recipe.image, width: 1024, height: 1024, alt: recipe.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.name,
      description: recipe.description,
      images: [recipe.image],
    },
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const recipe = getRecipe(slug)
  if (!recipe) notFound()

  const region = getRegion(recipe.region)
  const history = recipe.history ?? []

  return (
    <>
      <RecipeJsonLd recipe={recipe} />
      <SiteHeader />
      <main>
        {/* Massive header image */}
        <section className="relative -mt-16 h-[70vh] min-h-[480px] w-full overflow-hidden">
          <Image
            src={recipe.image || '/images/recipe-header.png'}
            alt={recipe.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50" />

          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
              {region && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md">
                  {region.name} · {region.label}
                </span>
              )}
              <h1 className="mt-4 text-balance font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
                {recipe.name}
              </h1>
              <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-white/80">
                {recipe.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/90">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="size-4 fill-accent text-accent" />
                  {recipe.rating.toFixed(1)}
                  <span className="text-white/60">({recipe.reviews})</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {recipe.cookingTime}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Flame className="size-4" />
                  {recipe.difficulty}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <Link
            href="/#recipes"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to the index
          </Link>
        </div>

        {/* Cultural Context & History */}
        <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Cultural Context &amp; History
          </h2>
          <div className="mt-6 space-y-5">
            {history.map((para, i) => (
              <div key={i}>
                <p className="text-pretty text-[17px] leading-[1.8] text-foreground/85">
                  {para}
                </p>
                {/* In-content ad after every 5 paragraphs */}
                {(i + 1) % 5 === 0 && <InContentAd />}
              </div>
            ))}
          </div>
        </section>

        {/* Two-column: Ingredients + Instructions */}
        <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr]">
            {/* Ingredients + tools rail */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground">
                <ChefHat className="size-5 text-primary" />
                Ingredients
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {recipe.ingredients?.map((ing) => (
                  <li
                    key={ing}
                    className="flex items-start gap-3 border-b border-border pb-3 text-sm leading-relaxed text-foreground/85 last:border-0"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    {ing}
                  </li>
                ))}
              </ul>

              {recipe.tools && recipe.tools.length > 0 && (
                <div className="mt-8">
                  <RecommendedTools tools={recipe.tools} />
                </div>
              )}
            </div>

            {/* Instructions */}
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                Step-by-Step Instructions
              </h2>
              <ol className="mt-5 flex flex-col gap-6">
                {recipe.steps?.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <p className="pt-1 text-[15px] leading-[1.75] text-foreground/85">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>

              {/* Chef's Tips callouts */}
              {recipe.chefTips && recipe.chefTips.length > 0 && (
                <div className="mt-10 space-y-4">
                  {recipe.chefTips.map((tip, i) => (
                    <div
                      key={i}
                      className="flex gap-3 rounded-xl border border-accent/40 bg-accent/10 p-5"
                    >
                      <Lightbulb className="size-5 shrink-0 text-accent" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                          Chef&apos;s Tip
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                          {tip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* More from the index */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Keep exploring
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              There are {RECIPES.length - 1} more stories waiting in the index —
              from Arctic cures to viral bakes.
            </p>
            <Link
              href="/#recipes"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Browse all recipes
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyFooterAd />
    </>
  )
}
