'use client'

import { useConsent } from '@/components/analytics/consent-provider'

export function CookieSettingsButton() {
  const { isSettingsOpen, openSettings } = useConsent()

  return (
    <button
      type="button"
      onClick={openSettings}
      aria-controls="consent-dialog"
      aria-expanded={isSettingsOpen}
      aria-haspopup="dialog"
      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      Cookie Settings
    </button>
  )
}
