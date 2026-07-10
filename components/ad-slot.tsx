'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

/**
 * In-content ad block. Designed to sit unobtrusively between content
 * sections (e.g. after every 5 paragraphs). Replace the inner markup
 * with your ad network's slot embed.
 */
export function InContentAd({ label = 'Advertisement' }: { label?: string }) {
  return (
    <aside
      aria-label="Advertisement"
      className="my-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/50 px-6 py-8 text-center"
    >
      <span className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground/70">
        {label}
      </span>
      <div className="flex h-24 w-full max-w-[728px] items-center justify-center rounded-lg bg-background/60 text-sm text-muted-foreground">
        Responsive 728×90 · viewability-optimized slot
      </div>
    </aside>
  )
}

/**
 * Slim sticky footer ad. Dismissible, low-clutter, high-viewability.
 */
export function StickyFooterAd() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border glass">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 sm:px-6">
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70 sm:inline">
          Sponsored
        </span>
        <div className="flex-1 truncate text-sm text-foreground/80">
          <span className="font-semibold text-foreground">Norwegian Steel Cookware</span>
          {' — '}
          handcrafted in Trondheim. Free shipping this week.
        </div>
        <a
          href="#"
          className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Shop
        </a>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss advertisement"
          className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
