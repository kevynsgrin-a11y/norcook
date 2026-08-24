import type { Metadata } from 'next'
import { LegalPage, LegalSection } from '@/components/legal-page'
import { affiliatePublicationDisclosure, legalOperator } from '@/lib/governance'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'How Norcook labels and measures affiliate links.',
  alternates: { canonical: '/affiliate-disclosure' },
}

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage
      eyebrow="Commercial disclosure"
      title="No hidden purchase links"
      intro="Norcook currently has no configured affiliate purchase links. Product tools are editorial references until a real destination, legal operator, partner terms, and approved disclosure are added."
    >
      <LegalSection title="If affiliate links are enabled">
        <p>
          Each linked recommendation must be visibly labeled, open with a
          sponsored relationship attribute, and explain that Norcook may earn a
          commission without changing the reader’s price. Editorial ranking must
          not be sold without clear sponsorship labeling.
        </p>
      </LegalSection>

      <LegalSection title="Measurement">
        <p>
          The site includes an affiliate-click event hook, but it fires only for
          a real configured link and only after analytics consent. The event uses
          the tool name; it does not include an email address or raw search text.
        </p>
      </LegalSection>

      <LegalSection title="Launch gate">
        {legalOperator && affiliatePublicationDisclosure ? (
          <p>
            The approved commercial disclosure names the operator as{' '}
            {legalOperator.legalName}, covers {affiliatePublicationDisclosure.partnerNames.join(', ')},
            and states: {affiliatePublicationDisclosure.relationshipDisclosure}{' '}
            Partner terms reference: {affiliatePublicationDisclosure.partnerTermsReference}.
          </p>
        ) : (
          <p>
            Affiliate links must remain disabled until the legal operator,
            registered address, privacy contact, jurisdiction, partner terms, and
            required consumer disclosures are approved and reflected on this page.
          </p>
        )}
      </LegalSection>
    </LegalPage>
  )
}
