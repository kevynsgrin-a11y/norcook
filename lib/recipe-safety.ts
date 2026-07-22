export type SafetySource = {
  label: string
  url: string
  authority: string
}

export type RecipeSafety = {
  category:
    | 'Home curing'
    | 'Raw cured fish'
    | 'Cold-smoked fish'
    | 'Ready-to-eat cured meat'
    | 'Refrigerated pickled fish'
    | 'Fermented fish'
  status: 'Qualified reviewer pending'
  reviewedOn: string
  summary: string
  safeguards: string[]
  sources: SafetySource[]
}

const FDA_PARASITE_SOURCE: SafetySource = {
  label: '2022 Food Code §3-402.11 — Parasite Destruction',
  url: 'https://www.fda.gov/files/2024-12-20-fodecode2022-print-0743.pdf',
  authority: 'U.S. Food and Drug Administration',
}

const RISK_GROUP_SOURCE: SafetySource = {
  label: 'People at risk of food poisoning',
  url: 'https://www.foodsafety.gov/people-at-risk',
  authority: 'FoodSafety.gov',
}

const NORWAY_FISH_SOURCE: SafetySource = {
  label: 'Local food — inland fish safety controls',
  url: 'https://www.mattilsynet.no/mat-og-drikke/matproduksjon/lokalmat/lokalmat--innlandsfisk',
  authority: 'Norwegian Food Safety Authority',
}

const NORWAY_RAKFISK_SOURCE: SafetySource = {
  label: 'Dietary advice for rakfisk',
  url: 'https://www.mattilsynet.no/mat-og-drikke/matproduksjon/fisk-og-sjomat/rakfisk--krev-god-styring-med-produksjonen/kostrad',
  authority: 'Norwegian Food Safety Authority',
}

const NORWAY_PREGNANCY_SOURCE: SafetySource = {
  label: 'Fish and seafood during pregnancy',
  url: 'https://www.mattilsynet.no/mat-og-drikke/forbrukere/rad-og-advarsler-til-gravide/fisk-og-sjomat',
  authority: 'Norwegian Food Safety Authority',
}

const CDC_PRESERVATION_SOURCE: SafetySource = {
  label: 'Botulism prevention for preserved and fermented food',
  url: 'https://www.cdc.gov/botulism/prevention/',
  authority: 'U.S. Centers for Disease Control and Prevention',
}

const sharedStatus = {
  status: 'Qualified reviewer pending' as const,
  reviewedOn: '2026-07-21',
}

export const RECIPE_SAFETY: Record<string, RecipeSafety> = {
  fenalar: {
    ...sharedStatus,
    category: 'Home curing',
    summary:
      'The former home-curing method was withdrawn. This page now uses professionally produced fenalår and does not provide a validated preservation process.',
    safeguards: [
      'Buy from an inspected producer and follow the package storage and use-by instructions.',
      'Do not improvise a home dry-cure from the historical outline on this site.',
      'Keep chilled until serving and return unused meat to refrigeration promptly.',
    ],
    sources: [CDC_PRESERVATION_SOURCE, RISK_GROUP_SOURCE],
  },
  gravlaks: {
    ...sharedStatus,
    category: 'Raw cured fish',
    summary:
      'Salt and sugar curing does not cook fish or reliably destroy parasites or Listeria.',
    safeguards: [
      'Use fish supplied for raw consumption, with documented parasite controls, or follow the FDA freezing schedule in the linked source.',
      'A typical domestic freezer may not hold −20°C (−4°F); 24 hours of freezing is not an adequate general rule.',
      'Keep at 4°C (40°F) or colder. Pregnant, older, or immunocompromised guests should choose cooked fish instead.',
    ],
    sources: [FDA_PARASITE_SOURCE, NORWAY_PREGNANCY_SOURCE, RISK_GROUP_SOURCE],
  },
  'rokt-roye': {
    ...sharedStatus,
    category: 'Cold-smoked fish',
    summary:
      'Cold smoking adds flavour but is not a kill step for Listeria or all other pathogens.',
    safeguards: [
      'Use commercially prepared cold-smoked char and follow its use-by date.',
      'Keep the fish refrigerated and put unused portions away within two hours.',
      'Pregnant, older, or immunocompromised guests should choose fish cooked to 63°C (145°F).',
    ],
    sources: [NORWAY_PREGNANCY_SOURCE, RISK_GROUP_SOURCE],
  },
  spekemat: {
    ...sharedStatus,
    category: 'Ready-to-eat cured meat',
    summary:
      'This is a serving guide for commercially produced cured meats, not a home-curing process.',
    safeguards: [
      'Use sealed products from an inspected producer and follow package storage and use-by instructions.',
      'Keep chilled; set out only the amount that will be served promptly.',
      'Guests at higher risk of foodborne illness should follow their local authority’s advice for ready-to-eat cured meats.',
    ],
    sources: [RISK_GROUP_SOURCE, CDC_PRESERVATION_SOURCE],
  },
  sursild: {
    ...sharedStatus,
    category: 'Refrigerated pickled fish',
    summary:
      'This recipe starts with commercially salted herring and is a refrigerated pickle, not a shelf-stable canning method.',
    safeguards: [
      'Keep the herring and finished pickle at 4°C (40°F) or colder.',
      'Do not store at room temperature or treat the jar as shelf stable.',
      'This editorial recipe does not establish a tested shelf life; follow the fish supplier’s use-by guidance.',
    ],
    sources: [CDC_PRESERVATION_SOURCE, RISK_GROUP_SOURCE],
  },
  rakfisk: {
    ...sharedStatus,
    category: 'Fermented fish',
    summary:
      'Rakfisk production requires controlled salt, temperature, hygiene, and verification for botulism and Listeria hazards.',
    safeguards: [
      'Buy prepared rakfisk from a regulated producer; this page does not teach home fermentation.',
      'Keep refrigerated, observe the use-by date, and serve cold.',
      'Pregnant, older, or immunocompromised people should not eat rakfisk.',
    ],
    sources: [NORWAY_FISH_SOURCE, NORWAY_RAKFISK_SOURCE, CDC_PRESERVATION_SOURCE],
  },
}

export function getRecipeSafety(slug: string) {
  return RECIPE_SAFETY[slug]
}
