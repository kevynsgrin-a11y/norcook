'use client'

import { FeedItem } from '@/components/mobile/feed-item'
import type { Recipe } from '@/lib/types'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Theater mode — clicking a masonry thumbnail expands the recipe into a focused
 * overlay. It reuses the mobile FeedItem so the desktop "expand" experience is
 * the same vertically-swipeable canvas, framed in a phone-aspect window with a
 * dimmed scrim. Scroll / arrow keys / nav buttons move between recipes.
 */

export function TheaterOverlay({
  recipes,
  initialIndex,
  onClose,
}: {
  recipes: Recipe[]
  initialIndex: number
  onClose: () => void
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(initialIndex)

  // Lock body scroll while open + scroll to the clicked recipe.
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const el = itemRefs.current[initialIndex]
    el?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
    return () => {
      document.body.style.overflow = ''
    }
  }, [initialIndex])

  const scrollToIndex = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, itemRefs.current.length - 1))
    itemRefs.current[clamped]?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') scrollToIndex(activeIndex + 1)
      if (e.key === 'ArrowUp') scrollToIndex(activeIndex - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex, onClose, scrollToIndex])

  useEffect(() => {
    const root = scrollerRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setActiveIndex(Number((entry.target as HTMLElement).dataset.index))
          }
        }
      },
      { root, threshold: [0.6] },
    )
    itemRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Recipe theater"
    >
      {/* Scrim click closes */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close theater"
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-50 rounded-full glass-strong p-2.5 text-foreground transition hover:scale-105"
      >
        <X className="size-6" aria-hidden="true" />
      </button>

      {/* Nav arrows */}
      <div className="absolute right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous recipe"
          className="rounded-full glass-strong p-3 transition hover:scale-105 disabled:opacity-40"
        >
          <ChevronUp className="size-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={activeIndex === recipes.length - 1}
          aria-label="Next recipe"
          className="rounded-full glass-strong p-3 transition hover:scale-105 disabled:opacity-40"
        >
          <ChevronDown className="size-6" aria-hidden="true" />
        </button>
      </div>

      {/* Phone-aspect vertical swiper */}
      <div
        ref={scrollerRef}
        className="no-scrollbar snap-y-mandatory relative z-10 aspect-[9/16] h-[88vh] max-h-[88vh] overflow-y-scroll rounded-3xl border border-border shadow-2xl"
      >
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            data-index={index}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            className="snap-start-always h-full w-full"
          >
            <FeedItem
              recipe={recipe}
              active={index === activeIndex}
              warm={index === activeIndex + 1}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
