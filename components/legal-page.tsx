import Link from 'next/link'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <Link
          href="/"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          ← Norcook home
        </Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          {intro}
        </p>
        <div className="mt-12 space-y-10 text-[15px] leading-7 text-foreground/85">
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

export function LegalSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}
