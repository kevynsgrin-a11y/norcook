import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getRecipesBySlugs } from '@/lib/recipes'
import { SITE_NAME } from '@/lib/site'
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
    // See the note in app/regions/[region]/page.tsx: Next replaces `openGraph`
    // rather than merging it, so the inherited keys are restated here.
    openGraph: {
      type: 'article',
      url: `/seasons/${seasonSlug}`,
      siteName: SITE_NAME,
      locale: 'en_US',
      title: hub.metaTitle,
      description: hub.metaDescription,
      images: seasonImages(seasonSlug),
    },
    twitter: {
      card: 'summary_large_image',
      title: hub.metaTitle,
      description: hub.metaDescription,
      images: seasonImages(seasonSlug).map((image) => image.url),
    },
  }
}

function seasonImages(seasonSlug: SeasonSlug) {
  const lead = getRecipesBySlugs(SEASON_HUBS[seasonSlug].recipeSlugs)[0]
  return [
    {
      url: lead?.image ?? '/images/hero-fjord.webp',
      alt: lead ? lead.name : 'A Norwegian fjord at golden hour',
    },
  ]
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
