'use client'

import { OutstreamAdSlot } from '@/components/ads/ad-slot'
import { TheaterOverlay } from '@/components/desktop/theater-overlay'
import { HlsVideo, type HlsVideoHandle } from '@/components/video/hls-video'
import { formatCompact } from '@/lib/format'
import type { Recipe } from '@/lib/types'
import { cn } from '@/lib/utils'
import { resolveVideoSrc } from '@/lib/video'
import { SmartImage } from '@/components/media/smart-image'
import { Flame, Heart, TrendingUp, Volume2 } from 'lucide-react'
import { useRef, useState } from 'react'

/**
 * Dense, interlocking masonry of looping muted video thumbnails. Hovering a
 * tile initializes its HLS player and unmutes; leaving re-mutes and pauses.
 * Clicking opens theater mode for vertical swiping.
 */

export function MasonryGrid({ recipes }: { recipes: Recipe[] }) {
  const [theaterIndex, setTheaterIndex] = useState<number | null>(null)

  // vary tile heights for an interlocking masonry rhythm
  const spans = [
    'row-span-8',
    'row-span-10',
    'row-span-7',
    'row-span-9',
    'row-span-11',
    'row-span-8',
  ]

  return (
    <>
      <div className="grid auto-rows-[2rem] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {recipes.map((recipe, i) => (
          <div key={recipe.id} className={cn(spans[i % spans.length])}>
            <MasonryTile
              recipe={recipe}
              onOpen={() => setTheaterIndex(i)}
            />
          </div>
        ))}
        {/* Outstream ad unit interleaved into the grid */}
        <div className="row-span-7">
          <OutstreamAdSlot className="h-full" />
        </div>
      </div>

      {theaterIndex !== null && (
        <TheaterOverlay
          recipes={recipes}
          initialIndex={theaterIndex}
          onClose={() => setTheaterIndex(null)}
        />
      )}
    </>
  )
}

function MasonryTile({
  recipe,
  onOpen,
}: {
  recipe: Recipe
  onOpen: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const videoRef = useRef<HlsVideoHandle>(null)

  function handleEnter() {
    setHovered(true)
    requestAnimationFrame(() => {
      const v = videoRef.current
      if (v) {
        v.setMuted(false)
        void v.play()
      }
    })
  }
  function handleLeave() {
    const v = videoRef.current
    if (v) {
      v.setMuted(true)
      v.pause()
    }
    setHovered(false)
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      aria-label={`Open ${recipe.title}`}
      className="group relative h-full w-full overflow-hidden rounded-2xl border border-border bg-card text-left transition duration-300 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Poster (always present, instant paint) */}
      <SmartImage
        src={recipe.posterUrl}
        alt={recipe.title}
        fill
        className={cn(
          'object-cover transition-opacity duration-300',
          hovered ? 'opacity-0' : 'opacity-100',
        )}
        sizes="(max-width: 768px) 50vw, 20vw"
        quality={70}
      />

      {/* Hover video */}
      {hovered && (
        <div className="absolute inset-0">
          <HlsVideo
            ref={videoRef}
            src={resolveVideoSrc(recipe)}
            poster={recipe.posterUrl}
            active
            loop
            autoPlay
            videoId={recipe.id}
            videoTitle={recipe.title}
          />
          <span className="absolute right-2 top-2 rounded-full glass p-1.5">
            <Volume2 className="size-4 text-foreground" aria-hidden="true" />
          </span>
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent"
      />

      {/* VCS badge */}
      <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full glass px-2 py-1 font-mono text-[11px] font-semibold">
        <TrendingUp className="size-3 text-primary" aria-hidden="true" />
        {recipe.viralCoefficientScore.toFixed(1)}
      </span>

      {/* Footer meta */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <h3 className="text-balance text-sm font-bold leading-tight text-foreground">
          {recipe.title}
        </h3>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>@{recipe.creator.handle}</span>
          <span className="inline-flex items-center gap-1">
            <Heart className="size-3" aria-hidden="true" /> {formatCompact(recipe.likes)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Flame className="size-3" aria-hidden="true" /> {recipe.macros.calories}
          </span>
        </div>
      </div>
    </button>
  )
}
