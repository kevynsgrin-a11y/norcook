import { DiscoverFeed } from '@/components/discover/discover-feed'
import { LeaderboardRail } from '@/components/desktop/leaderboard-rail'
import { ShoreburstFeed } from '@/components/mobile/shoreburst-feed'
import { SiteHeader } from '@/components/site-header'
import { getLeaderboard, getTrendingRecipes } from '@/lib/leaderboard'
import { getVariant } from '@/lib/ab'

/**
 * Home — server-rendered for instant FCP. The feed/grid order comes from the
 * Redis-backed trending leaderboard. The A/B variant (set by Edge Middleware)
 * is read here so the chosen variant renders on the server with no client
 * flicker.
 */
export default async function HomePage() {
  const trending = getTrendingRecipes()
  const leaderboard = getLeaderboard(5)

  const variant = await getVariant()

  // Variant B promotes the single most-viral recipe to the top of the grid as a
  // hero-weighted ordering; variant A keeps the pure VCS order.
  const recipes =
    variant === 'B'
      ? [...trending].sort((a, b) => b.saves - a.saves)
      : trending

  return (
    <>
      {/* Mobile: full-screen vertical feed */}
      <div className="md:hidden">
        <ShoreburstFeed recipes={trending} />
      </div>

      {/* Desktop: header + masonry grid + leaderboard */}
      <div className="hidden min-h-screen flex-col md:flex">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-[1600px] gap-6 px-6 py-8">
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h1 className="text-balance font-heading text-3xl font-black tracking-tight">
                  The feed that cooks
                </h1>
                <p className="mt-1 text-pretty text-muted-foreground">
                  Video-first recipes, ranked by what the world is actually making right now.
                </p>
              </div>
              <span className="hidden rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground lg:inline">
                layout variant {variant}
              </span>
            </div>
            <DiscoverFeed recipes={recipes} />
          </div>
          <LeaderboardRail entries={leaderboard} />
        </main>
      </div>
    </>
  )
}
