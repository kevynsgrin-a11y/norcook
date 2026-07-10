import Link from 'next/link'
import { AtSign, Camera, Play, Rss } from 'lucide-react'
import { REGIONS } from '@/lib/recipes'

const socials = [
  { icon: Camera, label: 'Instagram' },
  { icon: AtSign, label: 'Twitter' },
  { icon: Play, label: 'YouTube' },
  { icon: Rss, label: 'Newsletter feed' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              NORDISK
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A cultural guide to Norway through food — 77 recipes across five
              regions, documented with care.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Regions
            </h4>
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Company
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {['About', 'Our Contributors', 'Advertise', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Nordisk Media AS. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Use', 'Cookie Settings'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
