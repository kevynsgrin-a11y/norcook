'use client'

import { useEffect } from 'react'
import { useConsent } from '@/components/analytics/consent-provider'

export function RecipeViewTracker({
  slug,
  region,
}: {
  slug: string
  region: string
}) {
  const { trackEvent } = useConsent()

  useEffect(() => {
    trackEvent('recipe_view', { recipe_slug: slug, region })
  }, [region, slug, trackEvent])

  return null
}
