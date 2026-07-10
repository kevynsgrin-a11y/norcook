import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { REGIONS } from '@/lib/recipes'

export function RegionsSection() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
            Five Regions
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A country cooked by its geography
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Norway&apos;s cuisine is not one tradition but many — divided by
            mountains, fjords and thousands of kilometres of coastline.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((region, i) => (
            <Link
              key={region.slug}
              href={`/#${region.slug}`}
              className={`group flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/40 ${
                i === 0 ? 'lg:col-span-1' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-4xl font-bold text-muted-foreground/25">
                  0{i + 1}
                </span>
                <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <div className="mt-10">
                <span className="text-[10px] font-medium uppercase tracking-wider text-accent">
                  {region.label}
                </span>
                <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
                  {region.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {region.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
