import { MasonrySkeleton } from '@/components/discover/discover-skeleton'
import { SiteHeader } from '@/components/site-header'

/**
 * Route-level loading UI for the Discover feed. Uses the warm terracotta
 * skeleton (no spinner) and mirrors the real layout so there's no shift when
 * the server-rendered feed arrives.
 */
export default function HomeLoading() {
  return (
    <>
      {/* Mobile: full-screen warm skeleton */}
      <div className="skeleton h-[100dvh] w-full md:hidden" aria-hidden="true" />

      {/* Desktop: header + toolbar shell + masonry skeleton */}
      <div className="hidden min-h-screen flex-col md:flex">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-[1600px] gap-6 px-6 py-8">
          <div className="min-w-0 flex-1">
            <div className="mb-6 h-14 w-1/2 rounded-xl skeleton" aria-hidden="true" />
            {/* toolbar shell */}
            <div className="mb-6 flex flex-col gap-3">
              <div className="skeleton h-11 w-full rounded-full" aria-hidden="true" />
              <div className="flex gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="skeleton h-8 w-20 rounded-full"
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
            <MasonrySkeleton count={12} />
          </div>
          <div
            className="hidden w-72 shrink-0 rounded-3xl skeleton lg:block"
            aria-hidden="true"
          />
        </main>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        Loading the trending feed
      </span>
    </>
  )
}
