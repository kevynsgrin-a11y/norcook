import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { RegionsSection } from '@/components/regions-section'
import { RecipeIndex } from '@/components/recipe-index'
import { InContentAd, StickyFooterAd } from '@/components/ad-slot'
import { Newsletter } from '@/components/newsletter'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <RegionsSection />
        <RecipeIndex />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <InContentAd />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </main>
      <SiteFooter />
      <StickyFooterAd />
    </>
  )
}
