/**
 * Shared shape for the topic hubs — one per region, one per season.
 *
 * A hub is an editorial page, not a generated listing: it carries original
 * introduction copy, an ingredient glossary drawn from the recipes it links,
 * and a source panel that says plainly what does and does not back it. The
 * same honesty rules as a recipe page apply — see components/hub-source-panel.
 */

import type { SafetySource } from './recipe-safety'

export type HubSource = {
  label: string
  url: string
  publisher: string
}

/**
 * Re-links a citation that already ships on a recipe page. Hubs cite nothing
 * that is not already published elsewhere on this site — a URL nobody has
 * opened is not a source, and inventing one would be worse than the honest
 * empty state `HubSourcePanel` renders when `sources` is empty.
 */
export function fromSafetySource(source: SafetySource): HubSource {
  return { label: source.label, url: source.url, publisher: source.authority }
}

export type GlossaryEntry = {
  term: string
  definition: string
}

export type Hub = {
  /** Page H1. */
  title: string
  /** <title> text; the layout template appends the site name. */
  metaTitle: string
  metaDescription: string
  /** Short line under the H1. */
  standfirst: string
  /** Original introduction, 4-6 paragraphs. */
  intro: string[]
  glossary: GlossaryEntry[]
  /** Empty is a legitimate state and renders as an explicit "none recorded". */
  sources: HubSource[]
  /** Checked, not reviewed — no qualified reviewer has been named. */
  checkedOn: string
  /** Rendered above the recipes when the hub touches safety-sensitive food. */
  safetyNote?: string
}
