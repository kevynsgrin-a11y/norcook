'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Check, Send } from 'lucide-react'
import { useConsent } from '@/components/analytics/consent-provider'
import { HONEYPOT_FIELD } from '@/lib/newsletter-contract'
import { CONSENT_VERSION } from '@/lib/site'

export function Newsletter() {
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const { trackEvent } = useConsent()
  const newsletterEnabled =
    process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === 'true'

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const email = new FormData(form).get('email')
    if (typeof email !== 'string') return

    setStatus('submitting')
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consentVersion: CONSENT_VERSION }),
      })
      if (!response.ok) {
        setStatus('error')
        return
      }
      setStatus('success')
      form.reset()
      trackEvent('newsletter_signup', { placement: 'homepage' })
    } catch {
      // A transport failure must not strand the button on "Joining…".
      setStatus('error')
    }
  }

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
            {newsletterEnabled ? 'The Norcook letter' : 'Newsletter · Not yet open'}
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
          {!newsletterEnabled ? (
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
          ) : status === 'success' ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/25 bg-white/10 p-5 text-white backdrop-blur-xl">
              <Check aria-hidden="true" className="size-5 text-accent" />
              <p className="text-sm font-medium">
                You&apos;re subscribed. Check your inbox for confirmation.
              </p>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              {/* Bot trap. display:none rather than off-screen, so no assistive
                  technology ever meets an unlabelled control. */}
              <input
                name={HONEYPOT_FIELD}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                aria-label="Email address"
                className="w-full rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/60 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-transform hover:scale-[1.03] active:scale-95"
              >
                <Send aria-hidden="true" className="size-4" />
                {status === 'submitting' ? 'Joining…' : 'Subscribe'}
              </button>
            </form>
          )}
          {newsletterEnabled && status !== 'success' && (
            <p className="mt-3 text-xs text-white/60">
              We will use your address to send this letter and nothing else.
              Unsubscribe anytime. See our{' '}
              <Link href="/privacy" className="underline underline-offset-4">
                privacy notice
              </Link>
              .
              {status === 'error' && (
                <span className="ml-1 text-red-200" role="status">
                  Signup failed; please try again later.
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
