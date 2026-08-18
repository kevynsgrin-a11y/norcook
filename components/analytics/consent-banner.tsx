'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function ConsentBanner({
  open,
  modal,
  analyticsConfigured,
  onChoose,
  onDismiss,
}: {
  open: boolean
  /** True when re-opened from the footer, where a dismissable dialog is correct.
   *  The first-visit banner is deliberately non-modal: a visitor who has not yet
   *  chosen should not be trapped before they have read anything. */
  modal: boolean
  analyticsConfigured: boolean
  onChoose: (choice: 'essential' | 'analytics') => void
  onDismiss: () => void
}) {
  const panelRef = useRef<HTMLElement>(null)

  // Move focus into the panel when it opens — and only then, so a re-render
  // never steals focus back off whichever button the reader has tabbed to.
  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open || !modal) return
    const panel = panelRef.current
    if (!panel) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onDismiss()
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
  }, [modal, onDismiss, open])

  if (!open) return null

  return (
    <section
      ref={panelRef}
      tabIndex={-1}
      role={modal ? 'dialog' : 'region'}
      aria-modal={modal || undefined}
      aria-labelledby="consent-heading"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-2xl rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-black/20 sm:p-6"
    >
      <h2
        id="consent-heading"
        className="font-display text-lg font-bold text-foreground"
      >
        Your privacy choice
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
          className="px-3 py-2 text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Privacy details
        </Link>
        <button
          type="button"
          onClick={() => onChoose('essential')}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => onChoose('analytics')}
          disabled={!analyticsConfigured}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Allow analytics
        </button>
      </div>
    </section>
  )
}
