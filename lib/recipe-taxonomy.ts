export type RegionSlug =
  | 'sapmi'
  | 'vestlandet'
  | 'sorlandet'
  | 'ostlandet'
  | 'modern-viral'

export type Region = {
  slug: RegionSlug
  name: string
  label: string
  blurb: string
}

/**
 * Shared, lightweight regional taxonomy. Keep this isolated from the recipe
 * corpus so navigation, filters, and card badges do not make the full recipe
 * dataset part of the initial client bundle.
 */
export const REGIONS: Region[] = [
  {
    slug: 'sapmi',
    name: 'Sápmi',
    label: 'The North',
    blurb: 'Arctic larders, reindeer herding and smoke-cured traditions.',
  },
  {
    slug: 'vestlandet',
    name: 'Vestlandet',
    label: 'Western Fjords',
    blurb: 'Deep-water seafood shaped by steep fjords and salt air.',
  },
  {
    slug: 'sorlandet',
    name: 'Sørlandet',
    label: 'Southern Coast',
    blurb: 'Sun-warmed skerries, shellfish and white wooden towns.',
  },
  {
    slug: 'ostlandet',
    name: 'Østlandet',
    label: 'Eastern Valleys',
    blurb: 'Hearty farm cooking from forests, lakes and long winters.',
  },
  {
    slug: 'modern-viral',
    name: 'Modern Viral Baking',
    label: 'New Wave',
    blurb: 'The cardamom-scented bakes that took over the internet.',
  },
]

export function getRegion(slug: RegionSlug): Region | undefined {
  return REGIONS.find((region) => region.slug === slug)
}

export const TOTAL_RECIPES = 77
