import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { REGIONS, getRecipesByRegion, getRegion, type RegionSlug } from '@/lib/recipes'
import { REGION_HUBS } from '@/lib/region-hubs'
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
    openGraph: {
      type: 'article',
      url: `/regions/${regionSlug}`,
      title: hub.metaTitle,
      description: hub.metaDescription,
    },
  }
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
