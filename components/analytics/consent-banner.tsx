'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function ConsentBanner({
  open,
  dismissible,
  analyticsConfigured,
  onChoose,
  onDismiss,
}: {
  open: boolean
  /** A saved preference exists, so this re-opened dialog can be closed. */
  dismissible: boolean
  analyticsConfigured: boolean
  onChoose: (choice: 'essential' | 'analytics') => void
  onDismiss: () => void
}) {
  const panelRef = useRef<HTMLElement>(null)

  // The first-visit panel and the re-opened settings surface use the same modal
  // contract: focus enters once, stays inside while open, and leaves only after
  // an explicit choice or an intentional dismissal of saved settings.
  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Escape is available only after a preference exists. On the first
        // visit it must not silently imply consent or hide the required choice.
        if (dismissible) {
          event.preventDefault()
          onDismiss()
        }
        return
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => !element.hasAttribute('disabled'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      // Focus can be outside the panel entirely — e.g. the banner was already
      // open and something else held focus when it became a dialog. Pull it back
      // in rather than letting Tab walk away from a modal.
      if (!(active instanceof Node) || !panel.contains(active)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
        return
      }
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [dismissible, onDismiss, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 p-4 sm:items-center sm:p-6">
      <section
        id="consent-dialog"
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-heading"
        aria-describedby="consent-copy"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-black/30 sm:max-h-[calc(100dvh-3rem)] sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="consent-heading"
            className="font-display text-lg font-bold text-foreground"
          >
            Your privacy choice
          </h2>
          {dismissible && (
            <button
              type="button"
              onClick={onDismiss}
              className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              Close settings
            </button>
          )}
        </div>
        <p
          id="consent-copy"
          className="mt-2 text-sm leading-relaxed text-muted-foreground"
        >
          Norcook uses local storage for theme, favourites, and this choice.
          Optional analytics records privacy-limited product events only after
          you opt in. Raw search text and email addresses are not sent as event
          properties.
        </p>
        {!analyticsConfigured && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Analytics is currently disabled until the site operator and legal
            jurisdiction are published.
          </p>
        )}
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Link
            href="/privacy"
            className="px-3 py-2.5 text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Privacy details
          </Link>
          <button
            type="button"
            onClick={() => onChoose('essential')}
            className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => onChoose('analytics')}
            disabled={!analyticsConfigured}
            className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Allow analytics
          </button>
        </div>
      </section>
    </div>
  )
}
