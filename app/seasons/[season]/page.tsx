import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getRecipesBySlugs } from '@/lib/recipes'
import {
  SEASON_HUBS,
  SEASON_SLUGS,
  type SeasonSlug,
} from '@/lib/season-hubs'
import { HubPage } from '@/components/hub-page'

function parseSeason(slug: string): SeasonSlug | undefined {
  return SEASON_SLUGS.find((season) => season === slug)
}

export function generateStaticParams() {
  return SEASON_SLUGS.map((season) => ({ season }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ season: string }>
}): Promise<Metadata> {
  const { season: slug } = await params
  const seasonSlug = parseSeason(slug)
  if (!seasonSlug) return { title: 'Season not found' }
  const hub = SEASON_HUBS[seasonSlug]
  return {
    title: hub.metaTitle,
    description: hub.metaDescription,
    alternates: { canonical: `/seasons/${seasonSlug}` },
    openGraph: {
      type: 'article',
      url: `/seasons/${seasonSlug}`,
      title: hub.metaTitle,
      description: hub.metaDescription,
    },
  }
}

export default async function SeasonHubPage({
  params,
}: {
  params: Promise<{ season: string }>
}) {
  const { season: slug } = await params
  const seasonSlug = parseSeason(slug)
  if (!seasonSlug) notFound()

  const hub = SEASON_HUBS[seasonSlug]
  return (
    <HubPage
      hub={hub}
      eyebrow="Seasonal collection"
      path={`/seasons/${seasonSlug}`}
      recipes={getRecipesBySlugs(hub.recipeSlugs)}
    />
  )
}
