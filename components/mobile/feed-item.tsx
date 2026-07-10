'use client'

import { MacroRings } from '@/components/macros/macro-rings'
import { RecipeDrawer } from '@/components/mobile/recipe-drawer'
import { StepTimeline, TimedOverlay } from '@/components/overlays/timed-overlay'
import { HlsVideo, type HlsVideoHandle } from '@/components/video/hls-video'
import { formatCompact } from '@/lib/format'
import type { Recipe } from '@/lib/types'
import { resolveVideoSrc } from '@/lib/video'
import { SmartImage } from '@/components/media/smart-image'
import { Bookmark, Heart, Play, Share2, TrendingUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/**
 * A single full-screen feed item. When `active` it mounts the real HLS engine
 * and autoplays; when inactive (but still kept warm as the next item) it shows
 * the poster only. Fully off-screen items are not rendered at all (see feed).
 */

export function FeedItem({
  recipe,
  active,
  warm,
}: {
  recipe: Recipe
  /** currently the visible item — plays + drives overlays */
  active: boolean
  /** the immediate next item — kept mounted but paused (preload) */
  warm: boolean
}) {
  const videoRef = useRef<HlsVideoHandle>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [paused, setPaused] = useState(false)

  const mountVideo = active || warm

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (active) {
      v.setMuted(false)
      void v.play()
      setPaused(false)
    } else {
      v.pause()
      v.seek(0)
    }
  }, [active])

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (paused) {
      void v.play()
      setPaused(false)
    } else {
      v.pause()
      setPaused(true)
    }
  }

  return (
    <section className="relative h-full w-full overflow-hidden bg-background">
      {/* Video canvas (or poster when not mounted) */}
      <button
        type="button"
        onClick={togglePlay}
        className="absolute inset-0 h-full w-full"
        aria-label={paused ? 'Play video' : 'Pause video'}
      >
        {mountVideo ? (
          <HlsVideo
            ref={videoRef}
            src={resolveVideoSrc(recipe)}
            poster={recipe.posterUrl}
            active={active}
            muted={!active}
            loop
            autoPlay={active}
            videoId={recipe.id}
            videoTitle={recipe.title}
            onTime={active ? setCurrentTime : undefined}
          />
        ) : (
          <SmartImage
            src={recipe.posterUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        )}
      </button>

      {/* Readability gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40"
      />

      {/* Play indicator when paused */}
      {paused && active && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full glass-strong p-5">
            <Play className="size-8 text-foreground" aria-hidden="true" />
          </div>
        </div>
      )}

      {/* Macro rings — top right of frame */}
      <div className="absolute right-3 top-3 z-20 rounded-2xl glass p-1.5">
        <MacroRings macros={recipe.macros} />
      </div>

      {/* VCS / trending chip — top left */}
      <div className="absolute left-3 top-4 z-20 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5">
        <TrendingUp className="size-3.5 text-primary" aria-hidden="true" />
        <span className="font-mono text-xs font-semibold">VCS {recipe.viralCoefficientScore.toFixed(1)}</span>
      </div>

      {/* Step timeline */}
      {active && (
        <div className="absolute inset-x-3 top-14 z-20">
          <StepTimeline
            steps={recipe.steps}
            currentTime={currentTime}
            duration={recipe.durationSeconds}
          />
        </div>
      )}

      {/* Timed step overlay */}
      {active && (
        <TimedOverlay
          steps={recipe.steps}
          currentTime={currentTime}
          className="absolute inset-x-4 bottom-[36%] z-20 justify-items-start"
        />
      )}

      {/* Right action rail */}
      <div className="absolute bottom-[34%] right-3 z-30 flex flex-col items-center gap-5">
        <SmartImage
          src={recipe.creator.avatarUrl}
          alt={recipe.creator.name}
          width={48}
          height={48}
          className="size-12 rounded-full border-2 border-foreground object-cover"
        />
        <ActionButton
          icon={<Heart className={liked ? 'size-7 fill-primary text-primary' : 'size-7'} />}
          label={formatCompact(recipe.likes + (liked ? 1 : 0))}
          onClick={() => setLiked((v) => !v)}
          pressed={liked}
        />
        <ActionButton
          icon={<Bookmark className={saved ? 'size-7 fill-accent text-accent' : 'size-7'} />}
          label={formatCompact(recipe.saves + (saved ? 1 : 0))}
          onClick={() => setSaved((v) => !v)}
          pressed={saved}
        />
        <ActionButton
          icon={<Share2 className="size-7" />}
          label={formatCompact(recipe.shares)}
        />
      </div>

      {/* Frosted recipe drawer */}
      <RecipeDrawer recipe={recipe} />
    </section>
  )
}

function ActionButton({
  icon,
  label,
  onClick,
  pressed,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  pressed?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className="flex flex-col items-center gap-1 text-foreground transition active:scale-90"
    >
      <span className="drop-shadow-lg">{icon}</span>
      <span className="text-xs font-semibold text-shadow-soft">{label}</span>
    </button>
  )
}
