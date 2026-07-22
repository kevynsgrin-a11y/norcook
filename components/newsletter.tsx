'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Check, Send } from 'lucide-react'

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="relative overflow-hidden rounded-2xl">
      <Image
        src="/images/newsletter-tundra.png"
        alt="Arctic Norwegian tundra under a soft green aurora at twilight"
        fill
        sizes="(max-width: 1024px) 100vw, 80rem"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

      <div className="relative z-10 grid gap-8 px-6 py-14 sm:px-12 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
            Free Download
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The Nordic Baking Guide
          </h2>
          <p className="mt-3 max-w-md text-pretty leading-relaxed text-white/80">
            Get our 30-page guide to cardamom, rye and the art of the perfect
            bun — plus a new regional recipe each week.
          </p>
        </div>

        <div className="lg:justify-self-end lg:pl-8">
          {submitted ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/25 bg-white/10 p-5 text-white backdrop-blur-xl">
              <Check className="size-5 text-accent" />
              <p className="text-sm font-medium">
                You&apos;re in. Check your inbox for the guide.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                aria-label="Email address"
                className="w-full rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/60 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-transform hover:scale-[1.03] active:scale-95"
              >
                <Send className="size-4" />
                Get the guide
              </button>
            </form>
          )}
          <p className="mt-3 text-xs text-white/60">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
