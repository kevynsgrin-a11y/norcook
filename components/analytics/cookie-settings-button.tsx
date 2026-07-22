'use client'

import { useConsent } from '@/components/analytics/consent-provider'

export function CookieSettingsButton() {
  const { openSettings } = useConsent()

  return (
    <button
      type="button"
      onClick={openSettings}
      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      Cookie Settings
    </button>
  )
}
