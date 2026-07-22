import type { Metadata } from 'next'
import { LegalPage, LegalSection } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Provisional terms for using Norcook editorial recipe content.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms · Updated July 21, 2026"
      title="Use the archive carefully"
      intro="These provisional terms explain the limits of Norcook’s editorial recipe archive. A legal operator and governing jurisdiction must still be named before commercial launch."
    >
      <LegalSection title="Editorial information, not professional advice">
        <p>
          Recipes and cultural notes are general editorial information. Follow
          package instructions and local food-safety authority guidance. Do not
          use Norcook as a validated HACCP plan, commercial process, medical
          recommendation, or substitute for a qualified food-safety professional.
        </p>
      </LegalSection>

      <LegalSection title="Higher-risk preservation">
        <p>
          Curing, fermenting, cold smoking, and serving raw food can create severe
          hazards. Safety-sensitive pages display an explicit source panel and a
          review status. “Qualified reviewer pending” means no specialist has
          signed off; do not interpret it as approval.
        </p>
      </LegalSection>

      <LegalSection title="Claims and commercial links">
        <p>
          Ratings, review counts, readership claims, paid advertisements, and
          affiliate purchase links are not active unless production evidence and
          disclosures are documented. Tool suggestions without a link are
          editorial references only.
        </p>
      </LegalSection>

      <LegalSection title="Availability and corrections">
        <p>
          The archive may change as recipes are sourced, tested, corrected, or
          withdrawn. Norcook does not promise uninterrupted availability. Reported
          safety concerns should be treated as release blockers until reviewed.
        </p>
      </LegalSection>

      <LegalSection title="Operator and governing law">
        <p>
          No company or jurisdiction is asserted here because neither has been
          confirmed. These terms must be reviewed and replaced or completed by
          the responsible legal operator before commercial launch.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
