import { MasonryGrid } from '@/components/desktop/masonry-grid'
import { formatCompact } from '@/lib/format'
import type { Creator, Recipe } from '@/lib/types'
import { BadgeCheck, LayoutDashboard, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Public creator profile. Aggregates a creator's recipes and headline stats.
 * The "Creator Studio" link routes to the multi-tenant payout dashboard.
 */
export function CreatorProfile({
  creator,
  recipes,
}: {
  creator: Creator
  recipes: Recipe[]
}) {
  const totalLikes = recipes.reduce((sum, r) => sum + r.likes, 0)
  const avgVcs =
    recipes.length > 0
      ? recipes.reduce((sum, r) => sum + r.viralCoefficientScore, 0) / recipes.length
      : 0

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      <header className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <Image
          src={creator.avatarUrl || '/placeholder.svg'}
          alt={creator.name}
          width={112}
          height={112}
          className="size-28 rounded-full object-cover ring-2 ring-primary/40"
        />
        <div className="flex-1">
          <h1 className="flex items-center justify-center gap-2 font-heading text-3xl font-black sm:justify-start">
            {creator.name}
            {creator.verified && (
              <BadgeCheck className="size-6 text-primary" aria-label="Verified creator" />
            )}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">@{creator.handle}</p>
          <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            {creator.bio}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <LayoutDashboard className="size-4" aria-hidden="true" />
          Creator Studio
        </Link>
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Followers" value={formatCompact(creator.followers)} />
        <Stat label="Recipes" value={String(recipes.length)} />
        <Stat label="Total likes" value={formatCompact(totalLikes)} />
        <Stat
          label="Avg VCS"
          value={avgVcs.toFixed(1)}
          icon={<TrendingUp className="size-4 text-primary" aria-hidden="true" />}
        />
      </dl>

      <h2 className="mb-4 mt-10 font-heading text-xl font-bold">Recipes</h2>
      <MasonryGrid recipes={recipes} />
    </div>
  )
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 flex items-center gap-1.5 font-mono text-2xl font-black">
        {icon}
        {value}
      </dd>
    </div>
  )
}
