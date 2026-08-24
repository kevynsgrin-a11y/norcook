import Image from 'next/image'

export function Newsletter() {
  return (
    <section className="relative overflow-hidden rounded-2xl">
      <Image
        src="/images/newsletter-tundra.webp"
        alt="Arctic Norwegian tundra under a soft green aurora at twilight"
        fill
        sizes="(max-width: 1024px) 100vw, 80rem"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

      <div className="relative z-10 grid gap-8 px-6 py-14 sm:px-12 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
            Newsletter · Not yet open
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A regional recipe letter, when we can run it properly
          </h2>
          <p className="mt-3 max-w-md text-pretty leading-relaxed text-white/80">
            The plan is a short letter: one region at a time, the cooking that
            belongs to it, and the background behind it. It will not start until
            there is someone named to stand behind it.
          </p>
        </div>

        <div className="lg:justify-self-end lg:pl-8">
          <div className="rounded-xl border border-white/25 bg-white/10 p-5 text-white backdrop-blur-xl">
            <p className="text-sm font-medium">Newsletter signups are not open yet.</p>
            <p className="mt-1 text-xs leading-relaxed text-white/70">
              No email address is collected on this site today. There is no
              form here to submit and nothing is sent anywhere.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/70">
              Activation is blocked until the site operator, privacy contact
              and delivery provider are published.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
