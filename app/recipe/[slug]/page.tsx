import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllRecipes, getRecipeBySlug } from '@/lib/data/recipes'
import { buildRecipeJsonLd } from '@/lib/json-ld'
import { RecipeDetail } from '@/components/recipe/recipe-detail'
import { SiteHeader } from '@/components/site-header'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export function generateStaticParams() {
  return getAllRecipes().map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const recipe = getRecipeBySlug(slug)
  if (!recipe) return { title: `Recipe not found · ${SITE_NAME}` }

  return {
    title: `${recipe.title} · ${SITE_NAME}`,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      type: 'video.other',
      images: [{ url: recipe.posterUrl }],
    },
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const recipe = getRecipeBySlug(slug)
  if (!recipe) notFound()

  const jsonLd = buildRecipeJsonLd(recipe, SITE_URL)

  return (
    <>
      {/* Merged Recipe + VideoObject rich snippet with per-step video timing. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <RecipeDetail recipe={recipe} />
      </main>
    </>
  )
}
