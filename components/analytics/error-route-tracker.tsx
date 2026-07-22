'use client'

import { useEffect } from 'react'
import { useConsent } from '@/components/analytics/consent-provider'

export function ErrorRouteTracker({
  status,
  routeKind,
}: {
  status: number
  routeKind: 'not_found' | 'runtime_error'
}) {
  const { trackEvent } = useConsent()

  useEffect(() => {
    trackEvent('error_route', { status, route_kind: routeKind })
  }, [routeKind, status, trackEvent])

  return null
}
