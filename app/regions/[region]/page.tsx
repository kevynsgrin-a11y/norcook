import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { REGIONS, getRecipesByRegion, getRegion, type RegionSlug } from '@/lib/recipes'
import { REGION_HUBS } from '@/lib/region-hubs'
import { SITE_NAME } from '@/lib/site'
import { HubPage } from '@/components/hub-page'

function parseRegion(slug: string): RegionSlug | undefined {
  return REGIONS.find((region) => region.slug === slug)?.slug
}

export function generateStaticParams() {
  return REGIONS.map((region) => ({ region: region.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>
}): Promise<Metadata> {
  const { region: slug } = await params
  const regionSlug = parseRegion(slug)
  if (!regionSlug) return { title: 'Region not found' }
  const hub = REGION_HUBS[regionSlug]
  return {
    title: hub.metaTitle,
    description: hub.metaDescription,
    alternates: { canonical: `/regions/${regionSlug}` },
    // Next replaces `openGraph` wholesale rather than deep-merging it with the
    // root layout's, so siteName, locale and images have to be restated here or
    // these become the only pages on the site without a social image.
    openGraph: {
      type: 'article',
      url: `/regions/${regionSlug}`,
      siteName: SITE_NAME,
      locale: 'en_US',
      title: hub.metaTitle,
      description: hub.metaDescription,
      images: hubImages(regionSlug),
    },
    twitter: {
      card: 'summary_large_image',
      title: hub.metaTitle,
      description: hub.metaDescription,
      images: hubImages(regionSlug).map((image) => image.url),
    },
  }
}

function hubImages(regionSlug: RegionSlug) {
  const lead = getRecipesByRegion(regionSlug)[0]
  return [
    {
      url: lead?.image ?? '/images/hero-fjord.webp',
      alt: lead ? lead.name : 'A Norwegian fjord at golden hour',
    },
  ]
}

export default async function RegionHubPage({
  params,
}: {
  params: Promise<{ region: string }>
}) {
  const { region: slug } = await params
  const regionSlug = parseRegion(slug)
  if (!regionSlug) notFound()

  const region = getRegion(regionSlug)
  return (
    <HubPage
      hub={REGION_HUBS[regionSlug]}
      eyebrow={`Region · ${region?.label ?? ''}`}
      path={`/regions/${regionSlug}`}
      recipes={getRecipesByRegion(regionSlug)}
    />
  )
}
