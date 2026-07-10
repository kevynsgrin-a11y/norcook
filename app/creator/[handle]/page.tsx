import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getAllCreators,
  getCreatorByHandle,
  getRecipesByCreator,
} from '@/lib/data/recipes'
import { CreatorProfile } from '@/components/creator/creator-profile'
import { SiteHeader } from '@/components/site-header'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export function generateStaticParams() {
  return getAllCreators().map((c) => ({ handle: c.handle }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const creator = getCreatorByHandle(handle)
  if (!creator) return { title: `Creator not found · ${SITE_NAME}` }

  return {
    title: `${creator.name} (@${creator.handle}) · ${SITE_NAME}`,
    description: creator.bio,
    openGraph: {
      title: creator.name,
      description: creator.bio,
      type: 'profile',
      images: [{ url: creator.avatarUrl }],
    },
  }
}

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const creator = getCreatorByHandle(handle)
  if (!creator) notFound()

  const recipes = getRecipesByCreator(creator.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: creator.name,
    alternateName: `@${creator.handle}`,
    description: creator.bio,
    image: `${SITE_URL}${creator.avatarUrl}`,
    url: `${SITE_URL}/creator/${creator.handle}`,
    jobTitle: 'Recipe Creator',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <CreatorProfile creator={creator} recipes={recipes} />
      </main>
    </>
  )
}
