import Link from 'next/link'
import { CookieSettingsButton } from '@/components/analytics/cookie-settings-button'
import { REGIONS } from '@/lib/recipes'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              NORCOOK
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A cultural guide to Norway through food — 77 recipes across five
              regions, documented with care.
            </p>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Ratings, readership claims, advertising, and subscription capture
              remain disabled until their evidence and legal owners are documented.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Regions
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {REGIONS.map((region) => (
                <li key={region.slug}>
                  <Link
                    href={`/#${region.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {region.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Standards
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {[
                { label: 'Editorial & Safety', href: '/editorial-policy' },
                { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Norcook. Legal operator details pending.
          </p>
          <div className="flex gap-5">
            <Link
                href="/privacy"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy Policy
            </Link>
            <Link
                href="/terms"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms of Use
            </Link>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  )
}
