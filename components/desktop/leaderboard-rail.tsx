import type { Recipe } from '@/lib/types'
import { Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Trending leaderboard rail — rendered server-side from the Redis sorted set
 * (lib/leaderboard.ts). Shows the top recipes ranked by Viral Coefficient Score.
 */

export function LeaderboardRail({
  entries,
}: {
  entries: Array<{ recipe: Recipe; score: number; rank: number }>
}) {
  return (
    <aside className="sticky top-20 hidden h-fit w-72 shrink-0 rounded-2xl border border-border bg-card p-4 xl:block">
      <div className="mb-3 flex items-center gap-2">
        <Zap className="size-4 text-primary" aria-hidden="true" />
        <h2 className="text-sm font-bold uppercase tracking-wide">Trending now</h2>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Ranked live by Viral Coefficient Score · cached in Redis
      </p>
      <ol className="flex flex-col gap-2">
        {entries.map(({ recipe, score, rank }) => (
          <li key={recipe.id}>
            <Link
              href={`/recipe/${recipe.slug}`}
              className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-secondary"
            >
              <span className="w-5 shrink-0 text-center font-mono text-lg font-black text-primary">
                {rank}
              </span>
              <Image
                src={recipe.posterUrl || '/placeholder.svg'}
                alt={recipe.title}
                width={44}
                height={44}
                className="size-11 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{recipe.title}</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  VCS {score.toFixed(1)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  )
}
