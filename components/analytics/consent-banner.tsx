'use client'

import Link from 'next/link'

export function ConsentBanner({
  open,
  analyticsConfigured,
  onChoose,
}: {
  open: boolean
  analyticsConfigured: boolean
  onChoose: (choice: 'essential' | 'analytics') => void
}) {
  if (!open) return null

  return (
    <section
      aria-label="Privacy choices"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-2xl rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-black/20 sm:p-6"
    >
      <h2 className="font-display text-lg font-bold text-foreground">
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
