'use client'

import { Analytics } from '@vercel/analytics/next'
import { track } from '@vercel/analytics'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ConsentBanner } from '@/components/analytics/consent-banner'
import { CONSENT_VERSION } from '@/lib/site'

type ConsentChoice = 'unset' | 'essential' | 'analytics'
type EventProperties = Record<string, string | number | boolean | null>

type ConsentContextValue = {
  choice: ConsentChoice
  choose: (choice: Exclude<ConsentChoice, 'unset'>) => void
  openSettings: () => void
  trackEvent: (name: string, properties?: EventProperties) => void
}

const STORAGE_KEY = CONSENT_VERSION
const ConsentContext = createContext<ConsentContextValue | null>(null)

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoice] = useState<ConsentChoice>('unset')
  // The stored choice can only be read in the browser, so the banner stays
  // unrendered until it has been. Without this a returning visitor gets a
  // frame of banner that then vanishes — and, since the panel takes focus on
  // open, a frame of stolen focus with it.
  const [consentRead, setConsentRead] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  // Whatever opened the settings dialog gets focus back when it closes.
  const openerRef = useRef<HTMLElement | null>(null)
  const analyticsConfigured =
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'

  const closeSettings = useCallback(() => {
    setSettingsOpen(false)
    openerRef.current?.focus()
    openerRef.current = null
  }, [])

  const openSettings = useCallback(() => {
    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    setSettingsOpen(true)
  }, [])

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      // Blocked storage: treat as an unmade choice, which keeps analytics off.
    }
    if (stored === 'essential' || stored === 'analytics') {
      // Browser-only consent is hydrated after the server render to avoid
      // reading localStorage during SSR.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChoice(stored)
    }
    setConsentRead(true)
  }, [])

  const choose = useCallback(
    (nextChoice: Exclude<ConsentChoice, 'unset'>) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, nextChoice)
      } catch {
        // Blocked storage: honour the choice for this page view only.
      }
      setChoice(nextChoice)
      closeSettings()
      if (nextChoice === 'analytics' && analyticsConfigured) {
        track('privacy_choice', { analytics: true })
      }
    },
    [analyticsConfigured, closeSettings],
  )

  const trackEvent = useCallback(
    (name: string, properties: EventProperties = {}) => {
      if (choice === 'analytics' && analyticsConfigured) {
        track(name, properties)
      }
    },
    [analyticsConfigured, choice],
  )

  const value = useMemo(
    () => ({ choice, choose, openSettings, trackEvent }),
    [choice, choose, openSettings, trackEvent],
  )

  return (
    <ConsentContext.Provider value={value}>
      {children}
      <ConsentBanner
        open={consentRead && (choice === 'unset' || settingsOpen)}
        modal={settingsOpen}
        analyticsConfigured={analyticsConfigured}
        onChoose={choose}
        onDismiss={closeSettings}
      />
      {choice === 'analytics' && analyticsConfigured && <Analytics />}
    </ConsentContext.Provider>
  )
}

export function useConsent() {
  const context = useContext(ConsentContext)
  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider')
  }
  return context
}
