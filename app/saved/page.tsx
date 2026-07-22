import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SavedList } from '@/components/saved-list'

export const metadata: Metadata = {
  title: 'Saved Recipes',
  description: 'The Norwegian recipes you’ve bookmarked on this device.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/saved' },
}

export default function SavedPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <SavedList />
      </main>
      <SiteFooter />
    </>
  )
}
