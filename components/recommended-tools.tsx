import { ExternalLink } from 'lucide-react'

type Tool = { name: string; note: string }

/**
 * Native-looking affiliate block. Styled to match editorial content so it
 * converts without feeling like a banner. Wire `href` to your affiliate links.
 */
export function RecommendedTools({ tools }: { tools: Tool[] }) {
  return (
    <section
      aria-label="Recommended tools"
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
          Recommended Tools
        </h3>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          Affiliate
        </span>
      </div>

      <ul className="flex flex-col divide-y divide-border">
        {tools.map((tool) => (
          <li key={tool.name}>
            <a
              href="#"
              className="group flex items-start gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="flex-1">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                  {tool.name}
                  <ExternalLink className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  {tool.note}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/70">
        We may earn a small commission on purchases made through these links, at
        no extra cost to you.
      </p>
    </section>
  )
}
