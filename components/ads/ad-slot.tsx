'use client'

import { cn } from '@/lib/utils'
import { SkipForward, X } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * Programmatic ad slots (Prebid.js prep).
 *
 * `OutstreamAdSlot` — desktop header-bidding outstream unit dropped into the
 * masonry grid. `InstreamAdSlot` — mobile instream, skippable video ad inserted
 * between feed videos. Both simulate the Prebid auction lifecycle
 * (requestBids -> bidResponse -> renderAd) with a mocked winning bid.
 */

interface MockBid {
  bidder: string
  cpm: number
  creativeId: string
  advertiser: string
}

function useMockAuction(active: boolean) {
  const [bid, setBid] = useState<MockBid | null>(null)
  useEffect(() => {
    if (!active) return
    // pbjs.requestBids({ bidsBackHandler })
    const t = setTimeout(() => {
      setBid({
        bidder: 'appnexus',
        cpm: +(Math.random() * 8 + 4).toFixed(2),
        creativeId: `cr_${Math.random().toString(36).slice(2, 8)}`,
        advertiser: 'FreshHarvest Organic',
      })
    }, 600)
    return () => clearTimeout(t)
  }, [active])
  return bid
}

/** Mobile instream skippable video ad (full-screen feed slot). */
export function InstreamAdSlot({ active }: { active: boolean }) {
  const bid = useMockAuction(active)
  const [countdown, setCountdown] = useState(5)
  const [skippable, setSkippable] = useState(false)
  const [skipped, setSkipped] = useState(false)

  useEffect(() => {
    if (!active || !bid || skipped) return
    setCountdown(5)
    setSkippable(false)
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          setSkippable(true)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [active, bid, skipped])

  return (
    <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-secondary">
      <span className="absolute left-3 top-4 rounded-full bg-background/70 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        Ad · Prebid instream
      </span>

      {!bid ? (
        <p className="font-mono text-sm text-muted-foreground">Running header-bidding auction…</p>
      ) : (
        <div className="flex flex-col items-center gap-4 px-8 text-center">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-primary-foreground">
            FH
          </div>
          <div>
            <p className="text-lg font-bold">{bid.advertiser}</p>
            <p className="text-pretty text-sm text-muted-foreground">
              Farm-fresh organic produce, delivered. Tap to learn more.
            </p>
          </div>
          <button
            type="button"
            disabled={!skippable}
            onClick={() => setSkipped(true)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
              skippable
                ? 'bg-foreground text-background active:scale-95'
                : 'cursor-not-allowed bg-muted text-muted-foreground',
            )}
          >
            <SkipForward className="size-4" aria-hidden="true" />
            {skippable ? 'Skip ad' : `Skip in ${countdown}s`}
          </button>
          <span className="font-mono text-[11px] text-muted-foreground">
            winning bid {bid.bidder} · ${bid.cpm} CPM
          </span>
        </div>
      )}
    </section>
  )
}

/** Desktop outstream unit for the masonry grid. */
export function OutstreamAdSlot({ className }: { className?: string }) {
  const [inView, setInView] = useState(false)
  const bid = useMockAuction(inView)
  const [closed, setClosed] = useState(false)

  if (closed) return null

  return (
    <div
      ref={(el) => {
        if (!el || inView) return
        const obs = new IntersectionObserver(
          ([e]) => {
            if (e.isIntersecting) {
              setInView(true)
              obs.disconnect()
            }
          },
          { threshold: 0.4 },
        )
        obs.observe(el)
      }}
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card p-6 text-center',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setClosed(true)}
        aria-label="Close ad"
        className="absolute right-2 top-2 rounded-full bg-background/70 p-1 text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
      <span className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        Ad · Outstream
      </span>
      {!bid ? (
        <p className="font-mono text-xs text-muted-foreground">Auctioning slot…</p>
      ) : (
        <>
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-lg font-black text-primary-foreground">
            FH
          </div>
          <p className="text-sm font-bold">{bid.advertiser}</p>
          <p className="text-pretty text-xs text-muted-foreground">
            Sponsored · organic ingredients delivered same-day
          </p>
          <span className="font-mono text-[11px] text-muted-foreground">
            {bid.bidder} · ${bid.cpm} CPM
          </span>
        </>
      )}
    </div>
  )
}
