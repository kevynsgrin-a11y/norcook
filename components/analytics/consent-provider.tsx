'use client'

import { Analytics } from '@vercel/analytics/next'
import { track } from '@vercel/analytics'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
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
  isSettingsOpen: boolean
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
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const analyticsConfigured =
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'

  const dialogOpen = consentRead && (choice === 'unset' || settingsOpen)

  const focusMain = useCallback(() => {
    const main = document.getElementById('main-content')
    if (main instanceof HTMLElement) {
      main.setAttribute('tabindex', '-1')
      main.focus()
    }
  }, [])

  // `aria-modal` is not sufficient to stop pointer/programmatic focus in every
  // browser. Manage the page shell synchronously with the dialog lifecycle so
  // it is restored before the focus-return effect below runs.
  useLayoutEffect(() => {
    if (!dialogOpen) return

    const siteShell = document.getElementById('site-shell')
    const hadInert = siteShell?.hasAttribute('inert') ?? false
    const previousAriaHidden = siteShell?.getAttribute('aria-hidden') ?? null
    const previousOverflow = document.body.style.overflow

    if (siteShell) {
      siteShell.setAttribute('inert', '')
      siteShell.setAttribute('aria-hidden', 'true')
    }
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
      if (!siteShell) return
      if (!hadInert) siteShell.removeAttribute('inert')
      if (previousAriaHidden === null) siteShell.removeAttribute('aria-hidden')
      else siteShell.setAttribute('aria-hidden', previousAriaHidden)
    }
  }, [dialogOpen])

  // Focus is restored only after the dialog has unmounted and `#site-shell` is
  // no longer inert. Returning it synchronously would target an inert opener.
  useLayoutEffect(() => {
    if (dialogOpen || !returnFocusRef.current) return

    const target = returnFocusRef.current
    returnFocusRef.current = null
    if (target && document.contains(target)) target.focus()
    else focusMain()
  }, [dialogOpen, focusMain])

  const closeSettings = useCallback(() => {
    // The first-visit dialog has no dismiss path: Escape must not create an
    // ambiguous consent state. This handler is used only for saved settings.
    if (!settingsOpen) return
    returnFocusRef.current = openerRef.current
    openerRef.current = null
    setSettingsOpen(false)
  }, [settingsOpen])

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
      // A first-visit choice has no opener, so return to the main landmark;
      // a changed saved choice returns to the footer trigger that opened it.
      returnFocusRef.current =
        openerRef.current ?? document.getElementById('main-content')
      openerRef.current = null
      setChoice(nextChoice)
      setSettingsOpen(false)
      if (nextChoice === 'analytics' && analyticsConfigured) {
        track('privacy_choice', { analytics: true })
      }
    },
    [analyticsConfigured],
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
    () => ({ choice, isSettingsOpen: settingsOpen, choose, openSettings, trackEvent }),
    [choice, settingsOpen, choose, openSettings, trackEvent],
  )

  return (
    <ConsentContext.Provider value={value}>
      {children}
      <ConsentBanner
        open={dialogOpen}
        dismissible={settingsOpen}
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
