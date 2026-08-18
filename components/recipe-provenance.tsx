import Link from 'next/link'
import { ExternalLink, FileText } from 'lucide-react'
import type { RecipeProvenance } from '@/lib/recipe-provenance'

/**
 * The evidence footer that every recipe carries. It states what the site can
 * honestly state: who stands behind the page, when the content was last
 * checked, what backs it, and what was adapted — and says outright when a
 * recipe has no page-level source yet rather than implying one.
 *
 * "Checked" is deliberate and load-bearing. Per /editorial-policy a page may
 * not claim it was "reviewed", "safe" or "validated" until a named specialist
 * records scope, evidence and decision, and no such specialist has been named.
 */
export function RecipeProvenanceBlock({
  checkedOn,
  regionName,
  regionSlug,
  provenance,
  hasSafetyCallout,
}: {
  checkedOn: string
  regionName?: string
  regionSlug?: string
  provenance?: RecipeProvenance
  hasSafetyCallout: boolean
}) {
  const sources = provenance?.sources ?? []

  return (
    <section
      aria-labelledby="provenance-heading"
      className="mx-auto max-w-4xl px-4 py-8 sm:px-6"
    >
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <FileText
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-muted-foreground"
          />
          <h2
            id="provenance-heading"
            className="font-display text-lg font-bold tracking-tight text-foreground"
          >
            How this page was made
          </h2>
        </div>

        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-[10rem_1fr]">
          <dt className="font-semibold text-foreground">Written by</dt>
          <dd className="leading-relaxed text-muted-foreground">
            The Norcook editorial archive. No individual author is named yet —
            see the{' '}
            <Link
              href="/editorial-policy"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              editorial and food-safety policy
            </Link>{' '}
            for what that means and what has to happen before a byline appears.
          </dd>

          <dt className="font-semibold text-foreground">Content last checked</dt>
          <dd className="leading-relaxed text-muted-foreground">
            <time dateTime={checkedOn}>{checkedOn}</time> — checked, not
            reviewed: no qualified reviewer has signed this page off.
          </dd>

          {regionName && regionSlug && (
            <>
              <dt className="font-semibold text-foreground">Regional context</dt>
              <dd className="leading-relaxed text-muted-foreground">
                <Link
                  href={`/regions/${regionSlug}`}
                  prefetch={false}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {regionName}
                </Link>{' '}
                — the hub carries the wider background, the ingredient glossary
                and its own sources.
              </dd>
            </>
          )}

          <dt className="font-semibold text-foreground">Sources</dt>
          <dd className="leading-relaxed text-muted-foreground">
            {sources.length > 0 ? (
              <ul className="flex flex-col gap-1.5">
                {sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {source.publisher}: {source.label}
                      <ExternalLink aria-hidden="true" className="size-3" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : hasSafetyCallout ? (
              <>
                The public-health sources for this recipe are listed in the
                food-safety callout above. No further page-level sources are
                recorded yet.
              </>
            ) : (
              <>
                No page-level sources are recorded for this recipe yet. The
                cultural background above is written as general context, not as
                a sourced historical claim.
              </>
            )}
          </dd>

          {provenance?.note && (
            <>
              <dt className="font-semibold text-foreground">Notes</dt>
              <dd className="leading-relaxed text-muted-foreground">
                {provenance.note}
              </dd>
            </>
          )}
        </dl>
      </div>
    </section>
  )
}
