import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { RegionsSection } from '@/components/regions-section'
import { RecipeIndex } from '@/components/recipe-index'
import { Newsletter } from '@/components/newsletter'
import { SiteFooter } from '@/components/site-footer'
import { RECIPES } from '@/lib/recipes'
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'

// The homepage initially renders twelve linked recipe cards. The ItemList must
// describe that visible preview, not all 77 cards that appear only after a
// reader asks the client-side index to reveal more.
const HOMEPAGE_RECIPE_PREVIEW = RECIPES.slice(0, 12)

const homepageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': absoluteUrl('/#website'),
      url: absoluteUrl('/'),
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
    },
    {
      '@type': 'CollectionPage',
      '@id': absoluteUrl('/#recipe-preview'),
      url: absoluteUrl('/'),
      name: 'Norcook recipe preview',
      description:
        'The twelve recipes initially visible in Norcook’s Norwegian food archive.',
      isPartOf: { '@id': absoluteUrl('/#website') },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: HOMEPAGE_RECIPE_PREVIEW.length,
        itemListElement: HOMEPAGE_RECIPE_PREVIEW.map((recipe, position) => ({
          '@type': 'ListItem',
          position: position + 1,
          name: recipe.name,
          url: absoluteUrl(`/recipes/${recipe.slug}`),
        })),
      },
    },
  ],
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(homepageJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <Hero />
        <RegionsSection />
        <RecipeIndex initialRecipes={HOMEPAGE_RECIPE_PREVIEW} />

        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
