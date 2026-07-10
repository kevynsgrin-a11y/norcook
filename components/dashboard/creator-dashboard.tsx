'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatCompact, formatCurrency } from '@/lib/format'
import type { CreatorEarnings } from '@/lib/earnings'
import { PayoutPanel } from './payout-panel'

const STREAM_COLORS: Record<string, string> = {
  'Ad Revenue': 'var(--chart-1)',
  Affiliate: 'var(--chart-2)',
  Instacart: 'var(--chart-3)',
}

export function CreatorDashboard({ earnings }: { earnings: CreatorEarnings[] }) {
  const [activeId, setActiveId] = useState(earnings[0]?.creator.id)
  const active = earnings.find((e) => e.creator.id === activeId) ?? earnings[0]

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Tenant switcher */}
      <aside className="flex flex-col gap-2">
        <p className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Connected creators
        </p>
        {earnings.map((e) => {
          const isActive = e.creator.id === active.creator.id
          return (
            <button
              key={e.creator.id}
              onClick={() => setActiveId(e.creator.id)}
              className={`flex items-center gap-3 rounded-xl border p-2 text-left transition-colors ${
                isActive
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:bg-secondary'
              }`}
            >
              <Image
                src={e.creator.avatarUrl || '/placeholder.svg'}
                alt={e.creator.name}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{e.creator.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {formatCurrency(e.netCents)} net
                </p>
              </div>
            </button>
          )
        })}
      </aside>

      {/* Active creator detail */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <Image
              src={active.creator.avatarUrl || '/placeholder.svg'}
              alt={active.creator.name}
              width={56}
              height={56}
              className="size-14 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-foreground">{active.creator.name}</h2>
              <p className="text-sm text-muted-foreground">
                @{active.creator.handle} · {formatCompact(active.creator.followers)} followers
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-chart-2/15 px-3 py-1 text-xs font-medium text-chart-2">
            <span className="size-2 rounded-full bg-chart-2" />
            Stripe Connect active
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Net earnings" value={formatCurrency(active.netCents)} />
          <Stat label="Recipes" value={String(active.recipeCount)} />
          <Stat label="Total engagement" value={formatCompact(active.totalViews)} />
        </div>

        {/* Revenue split bar */}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="mb-3 text-sm font-medium text-foreground">Revenue by stream</p>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary">
            {active.streams.map((s) => (
              <div
                key={s.label}
                style={{
                  width: `${(s.cents / active.grossCents) * 100}%`,
                  backgroundColor: STREAM_COLORS[s.label],
                }}
                title={`${s.label}: ${formatCurrency(s.cents)}`}
              />
            ))}
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {active.streams.map((s) => (
              <li key={s.label} className="flex items-center gap-2 text-sm">
                <span
                  className="size-3 rounded-sm"
                  style={{ backgroundColor: STREAM_COLORS[s.label] }}
                />
                <span className="text-muted-foreground">{s.label}</span>
                <span className="ml-auto font-medium text-foreground">
                  {formatCurrency(s.cents)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <PayoutPanel earnings={active} />
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  )
}
