import type { GlossaryEntry } from '@/lib/hubs'

export function HubGlossary({ entries }: { entries: GlossaryEntry[] }) {
  return (
    <section
      aria-labelledby="hub-glossary-heading"
      className="mx-auto max-w-4xl px-4 py-8 sm:px-6"
    >
      <h2
        id="hub-glossary-heading"
        className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      >
        Ingredient and kitchen glossary
      </h2>
      <dl className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.term}>
            <dt className="font-display text-base font-semibold text-foreground">
              {entry.term}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {entry.definition}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
