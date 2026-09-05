import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SavedList } from '@/components/saved-list'
import { ImageOpsFigure } from '@/components/imageops-visual'

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
      <main id="main-content">
        <SavedList />
        <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
          <ImageOpsFigure id="saved" />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
