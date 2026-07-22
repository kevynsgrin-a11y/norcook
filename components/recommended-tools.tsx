'use client'

import { ExternalLink } from 'lucide-react'
import { useConsent } from '@/components/analytics/consent-provider'

type Tool = { name: string; note: string; href?: string }

/**
 * Native-looking affiliate block. Styled to match editorial content so it
 * converts without feeling like a banner. Wire `href` to your affiliate links.
 */
export function RecommendedTools({ tools }: { tools: Tool[] }) {
  const { trackEvent } = useConsent()
  const hasAffiliateLinks = tools.some((tool) => Boolean(tool.href))

  return (
    <section
      aria-label="Recommended tools"
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
          Recommended Tools
        </h3>
        {hasAffiliateLinks && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
            Affiliate links
          </span>
        )}
      </div>

      <ul className="flex flex-col divide-y divide-border">
        {tools.map((tool) => (
          <li key={tool.name} className="py-3 first:pt-0 last:pb-0">
            {tool.href ? (
              <a
                href={tool.href}
                target="_blank"
                rel="sponsored noreferrer"
                onClick={() =>
                  trackEvent('affiliate_click', { tool_name: tool.name })
                }
                className="group flex items-start gap-3"
              >
                <ToolContent tool={tool} linked />
              </a>
            ) : (
              <div className="flex items-start gap-3">
                <ToolContent tool={tool} />
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
        {hasAffiliateLinks
          ? 'Affiliate links are marked. Norcook may earn a commission at no extra cost to you.'
          : 'Product suggestions are editorial references only; no purchase or affiliate links are currently configured.'}
      </p>
    </section>
  )
}

function ToolContent({ tool, linked = false }: { tool: Tool; linked?: boolean }) {
  return (
    <>
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="flex-1">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                  {tool.name}
                  {linked && (
                    <ExternalLink className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  )}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  {tool.note}
                </span>
              </span>
    </>
  )
}
