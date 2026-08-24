import type { Metadata } from 'next'
import { LegalPage, LegalSection } from '@/components/legal-page'
import { businessIdentity, legalOperator } from '@/lib/governance'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Provisional terms for using Norcook editorial recipe content.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms · Updated August 23, 2026"
      title="Use the archive carefully"
      intro="These provisional terms explain the limits of Norcook’s editorial recipe archive. They remain provisional until a complete legal-operator record is published and the responsible operator approves them."
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
        {legalOperator ? (
          <p>
            Norcook identifies {legalOperator.legalName} as the legal operator at
            {' '}{legalOperator.registeredAddress}. The stated governing
            jurisdiction is {legalOperator.governingJurisdiction}. These terms
            still require the operator’s formal legal approval before any
            commercial launch.
          </p>
        ) : businessIdentity ? (
          <p>
            Norcook identifies {businessIdentity.legalName} as its legal entity.
            Its published mailing address is {businessIdentity.mailingAddress}, and
            its stated operating state is {businessIdentity.operatingState}. These
            facts are not a complete legal-operator record: the registered address
            (if distinct), governing jurisdiction, privacy contact, and data-rights
            request procedure must be confirmed before commercial launch.
          </p>
        ) : (
          <p>
            No company, registered address, privacy contact, or jurisdiction is
            asserted here because none has been confirmed for publication. These
            terms must be reviewed and completed by the responsible legal operator
            before commercial launch.
          </p>
        )}
      </LegalSection>
    </LegalPage>
  )
}
