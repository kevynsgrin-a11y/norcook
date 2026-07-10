'use client'

import type { InstructionStep } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * TimedOverlay — minimalist step caption layered over the video, shown only
 * while the playhead is within a step's [startOffset, endOffset] window. This
 * is the "anti-blog" core: the recipe text is choreographed to the footage.
 */

interface TimedOverlayProps {
  steps: InstructionStep[]
  /** current playback time in seconds */
  currentTime: number
  className?: string
}

export function TimedOverlay({ steps, currentTime, className }: TimedOverlayProps) {
  const active = steps.find(
    (s) => currentTime >= s.startOffset && currentTime < s.endOffset,
  )

  return (
    <div
      className={cn(
        'pointer-events-none grid',
        className,
      )}
    >
      {active ? (
        <div
          key={active.id}
          className="duration-500 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="inline-flex max-w-md items-start gap-3 rounded-2xl glass-strong px-4 py-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground">
              {active.order}
            </span>
            <p className="text-pretty text-sm font-medium leading-relaxed text-foreground">
              {active.text}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

/** Thin progress bar marking each step segment along the video timeline. */
export function StepTimeline({
  steps,
  currentTime,
  duration,
  className,
}: {
  steps: InstructionStep[]
  currentTime: number
  duration: number
  className?: string
}) {
  return (
    <div className={cn('flex w-full gap-1', className)}>
      {steps.map((s) => {
        const segDur = s.endOffset - s.startOffset
        const filled =
          currentTime <= s.startOffset
            ? 0
            : currentTime >= s.endOffset
              ? 1
              : (currentTime - s.startOffset) / segDur
        return (
          <div
            key={s.id}
            className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/25"
            style={{ flexGrow: segDur || 1 }}
          >
            <div
              className="h-full rounded-full bg-foreground transition-[width] duration-200 ease-linear"
              style={{ width: `${filled * 100}%` }}
            />
          </div>
        )
      })}
    </div>
  )
}
