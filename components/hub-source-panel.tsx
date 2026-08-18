import Link from 'next/link'
import { ExternalLink, FileText } from 'lucide-react'
import type { HubSource } from '@/lib/hubs'

/**
 * The evidence panel every hub carries. It reuses the wording discipline of the
 * recipe safety callout: a checked date, an explicit statement that checked is
 * not reviewed, and either real sources or an honest declaration that there are
 * none yet. It never says "reviewed", "safe" or "validated".
 */
export function HubSourcePanel({
  sources,
  checkedOn,
}: {
  sources: HubSource[]
  checkedOn: string
}) {
  return (
    <section
      aria-labelledby="hub-sources-heading"
      className="mx-auto max-w-4xl px-4 py-8 sm:px-6"
    >
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <FileText
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-muted-foreground"
          />
          <div>
            <h2
              id="hub-sources-heading"
              className="font-display text-lg font-bold tracking-tight text-foreground"
            >
              Sources and status
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Written by the Norcook editorial archive. No individual author is
              named yet, and no qualified reviewer has signed this page off —
              see the{' '}
              <Link
                href="/editorial-policy"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                editorial and food-safety policy
              </Link>
              .
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm text-foreground">
          Content last checked:{' '}
          <time dateTime={checkedOn} className="font-medium">
            {checkedOn}
          </time>
        </p>

        {sources.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {source.publisher}: {source.label}
                  <ExternalLink aria-hidden="true" className="size-3" />
                </a>
              </li>
            ))}
            <li className="mt-1 text-xs leading-relaxed text-muted-foreground">
              These sources support the explanatory sections above. They do not
              make this page a qualified review of any method it links to.
            </li>
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            No external sources are recorded for this hub yet. Everything above
            is written as general cultural context rather than as a sourced
            historical claim, and the linked recipes carry their own evidence
            blocks.
          </p>
        )}
      </div>
    </section>
  )
}
