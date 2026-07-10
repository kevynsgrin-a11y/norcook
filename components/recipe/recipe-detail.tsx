'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { SmartImage } from '@/components/media/smart-image'
import { ArrowLeft, Clock, Users, Flame } from 'lucide-react'
import { HlsVideo, type HlsVideoHandle } from '@/components/video/hls-video'
import { MacroRings } from '@/components/macros/macro-rings'
import { TimedOverlay } from '@/components/overlays/timed-overlay'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { formatCompact } from '@/lib/format'
import type { Recipe } from '@/lib/types'
import { resolveVideoSrc } from '@/lib/video'

export function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const videoRef = useRef<HlsVideoHandle>(null)
  const [currentTime, setCurrentTime] = useState(0)

  const activeStep = recipe.steps.find(
    (s) => currentTime >= s.startOffset && currentTime < s.endOffset,
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to feed
      </Link>

      {/* Video is the canvas; recipe data is layered alongside via CSS Grid. */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="relative">
          <div className="relative aspect-[9/16] max-h-[80vh] overflow-hidden rounded-3xl bg-card sm:aspect-video lg:aspect-[4/5]">
            <HlsVideo
              ref={videoRef}
              src={resolveVideoSrc(recipe)}
              poster={recipe.posterUrl}
              autoPlay
              loop
              muted
              playsInline
              videoId={recipe.id}
              videoTitle={recipe.title}
              className="h-full w-full object-cover"
              onTime={setCurrentTime}
            />

            <div className="pointer-events-none absolute right-4 top-4">
              <MacroRings macros={recipe.macros} />
            </div>

            <TimedOverlay
              steps={recipe.steps}
              currentTime={currentTime}
              className="absolute inset-x-0 bottom-20 px-5"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
              <h1 className="text-balance text-2xl font-bold leading-tight text-white">
                {recipe.title}
              </h1>
            </div>
          </div>

          <div className="absolute bottom-5 right-5">
            <AddToCartButton recipe={recipe} />
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <Link
            href={`/creator/${recipe.creator.handle}`}
            className="flex items-center gap-3 rounded-xl transition hover:opacity-80"
          >
            <SmartImage
              src={recipe.creator.avatarUrl}
              alt={recipe.creator.name}
              width={44}
              height={44}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{recipe.creator.name}</p>
              <p className="text-xs text-muted-foreground">
                @{recipe.creator.handle} · {formatCompact(recipe.creator.followers)} followers
              </p>
            </div>
          </Link>

          <p className="text-pretty leading-relaxed text-muted-foreground">{recipe.description}</p>

          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat icon={<Clock className="h-4 w-4" />} label="Time" value={`${recipe.totalTimeMinutes}m`} />
            <Stat icon={<Users className="h-4 w-4" />} label="Serves" value={`${recipe.servings}`} />
            <Stat icon={<Flame className="h-4 w-4" />} label="Calories" value={`${recipe.macros.calories}`} />
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Ingredients
            </h2>
            <ul className="flex flex-col gap-2">
              {recipe.ingredients.map((ing) => (
                <li
                  key={ing.id}
                  className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2 text-sm"
                >
                  <span>{ing.name}</span>
                  <span className="shrink-0 text-muted-foreground">{ing.quantity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Method
            </h2>
            <ol className="flex flex-col gap-3">
              {recipe.steps.map((step) => {
                const isActive = activeStep?.id === step.id
                return (
                  <li
                    key={step.id}
                    id={`step-${step.order}`}
                    className={`flex gap-3 rounded-xl border p-3 text-sm transition-colors ${
                      isActive
                        ? 'border-primary/60 bg-primary/10'
                        : 'border-transparent bg-card/60'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => videoRef.current?.seek(step.startOffset)}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                      aria-label={`Jump to step ${step.order}`}
                    >
                      {step.order}
                    </button>
                    <p className="leading-relaxed">{step.text}</p>
                  </li>
                )
              })}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-card/60 py-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-lg font-bold leading-none">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
