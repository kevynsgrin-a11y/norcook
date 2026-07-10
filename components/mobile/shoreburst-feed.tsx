'use client'

import { InstreamAdSlot } from '@/components/ads/ad-slot'
import { FeedItem } from '@/components/mobile/feed-item'
import { SmartImage } from '@/components/media/smart-image'
import type { Recipe } from '@/lib/types'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Vertical, scroll-snap, full-screen feed. Virtualization rule (per spec):
 * only the active video and the immediate next one are mounted in the DOM as
 * real players. Every other slot renders a lightweight poster placeholder so we
 * never hold more than ~2 <video> elements in memory at once.
 *
 * A skippable instream ad is interleaved every AD_INTERVAL content items.
 */

const AD_INTERVAL = 4

type Slot =
  | { kind: 'recipe'; recipe: Recipe; key: string }
  | { kind: 'ad'; key: string }

function buildSlots(recipes: Recipe[]): Slot[] {
  const slots: Slot[] = []
  recipes.forEach((recipe, i) => {
    slots.push({ kind: 'recipe', recipe, key: recipe.id })
    if ((i + 1) % AD_INTERVAL === 0 && i < recipes.length - 1) {
      slots.push({ kind: 'ad', key: `ad-${i}` })
    }
  })
  return slots
}

export function ShoreburstFeed({ recipes }: { recipes: Recipe[] }) {
  const slots = buildSlots(recipes)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const observe = useCallback(() => {
    const root = containerRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            setActiveIndex(idx)
          }
        }
      },
      { root, threshold: [0.6] },
    )
    itemRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const cleanup = observe()
    return cleanup
  }, [observe])

  return (
    <div
      ref={containerRef}
      className="no-scrollbar snap-y-mandatory h-[100dvh] w-full overflow-y-scroll overscroll-y-contain bg-background"
    >
      {slots.map((slot, index) => {
        const isActive = index === activeIndex
        // keep the immediate next slot "warm" (mounted, paused) for instant play
        const isWarm = index === activeIndex + 1
        const shouldMount = isActive || isWarm

        return (
          <div
            key={slot.key}
            data-index={index}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            className="snap-start-always relative h-[100dvh] w-full"
          >
            {slot.kind === 'ad' ? (
              <InstreamAdSlot active={isActive} />
            ) : shouldMount ? (
              <FeedItem recipe={slot.recipe} active={isActive} warm={isWarm} />
            ) : (
              // Unmounted placeholder: poster only, zero video elements.
              <div className="relative h-full w-full">
                <SmartImage
                  src={slot.recipe.posterUrl}
                  alt={slot.recipe.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index < 2}
                />
                <div className="absolute inset-0 bg-background/30" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
