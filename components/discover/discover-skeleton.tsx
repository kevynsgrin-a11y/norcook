import { cn } from '@/lib/utils'

/**
 * Themed skeleton for the Discover masonry feed. Mirrors the real grid's
 * interlocking row spans so the layout doesn't jump when content arrives, and
 * uses the warm terracotta `.skeleton` pulse instead of a spinner.
 */

const SPANS = [
  'row-span-8',
  'row-span-10',
  'row-span-7',
  'row-span-9',
  'row-span-11',
  'row-span-8',
]

export function MasonrySkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid auto-rows-[2rem] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn(SPANS[i % SPANS.length])}>
          <div className="skeleton h-full w-full rounded-2xl border border-border/60">
            {/* faux VCS chip */}
            <span className="absolute left-2 top-2 h-5 w-12 rounded-full bg-background/40" />
            {/* faux footer meta */}
            <span className="absolute bottom-3 left-3 h-3 w-2/3 rounded bg-background/40" />
            <span className="absolute bottom-8 left-3 h-4 w-4/5 rounded bg-background/50" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Screen-reader announcement paired with the visual skeleton. */
export function LoadingAnnounce({ label = 'Loading recipes' }: { label?: string }) {
  return (
    <span role="status" aria-live="polite" className="sr-only">
      {label}
    </span>
  )
}
