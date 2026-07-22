import Image from 'next/image'
import { Search } from 'lucide-react'
import { TOTAL_RECIPES } from '@/lib/recipes'

export function Hero() {
  return (
    <section className="relative -mt-16 flex min-h-[92vh] items-center justify-center overflow-hidden">
      <Image
        src="/images/hero-fjord.png"
        alt="A dramatic Norwegian fjord at golden hour, deep water winding between snow-dusted cliffs"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Legibility scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-16 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-white/90 backdrop-blur-md">
          {TOTAL_RECIPES} Recipes · 5 Regions
        </span>

        <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          The Cultural Guide to Norway Through Food
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
          From the Arctic larders of Sápmi to the viral bakeries of Oslo — a
          curated atlas of recipes, history and the people who keep them alive.
        </p>

        {/* Frosted-glass search bar */}
        <form
          action="/search"
          method="get"
          className="mt-10 flex w-full max-w-xl items-center gap-2 rounded-full border border-white/25 bg-white/10 p-2 pl-5 backdrop-blur-xl transition-shadow focus-within:ring-2 focus-within:ring-white/40"
          role="search"
        >
          <Search className="size-5 shrink-0 text-white/70" />
          <input
            type="search"
            name="q"
            placeholder="Search fjord seafood, cured meats, cardamom bakes…"
            aria-label="Search recipes"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-transform hover:scale-[1.03] active:scale-95"
          >
            Explore
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/60">
        Scroll to discover
      </div>
    </section>
  )
}
