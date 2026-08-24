import type { Metadata } from 'next'
import { LegalPage, LegalSection } from '@/components/legal-page'
import {
  businessIdentity,
  legalOperator,
  newsletterProcessingDisclosure,
  optionalAnalyticsDisclosure,
} from '@/lib/governance'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Norcook handles local storage, analytics consent, and newsletter data.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy · Updated August 23, 2026"
      title="Privacy choices before measurement"
      intro="Norcook’s current default is essential storage only. Optional analytics and newsletter capture remain off until a complete, published governance record and provider disclosures exist."
    >
      <LegalSection
        title={
          legalOperator
            ? 'Operator and privacy contact'
            : businessIdentity
              ? 'Operator identification and governance gate'
              : 'Pre-launch governance gate'
        }
      >
        {legalOperator ? (
          <dl className="grid gap-x-3 gap-y-2 sm:grid-cols-[10rem_1fr]">
            <dt className="font-medium">Legal operator</dt>
            <dd>{legalOperator.legalName}</dd>
            <dt className="font-medium">Registered address</dt>
            <dd>{legalOperator.registeredAddress}</dd>
            <dt className="font-medium">Privacy contact</dt>
            <dd>
              <a href={`mailto:${legalOperator.privacyContactEmail}`}>
                {legalOperator.privacyContactEmail}
              </a>
            </dd>
            <dt className="font-medium">Data-rights requests</dt>
            <dd>{legalOperator.dataRightsRequestProcedure}</dd>
            <dt className="font-medium">Governing jurisdiction</dt>
            <dd>{legalOperator.governingJurisdiction}</dd>
          </dl>
        ) : businessIdentity ? (
          <>
            <dl className="grid gap-x-3 gap-y-2 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium">Legal entity</dt>
              <dd>{businessIdentity.legalName}</dd>
              <dt className="font-medium">Mailing address</dt>
              <dd>{businessIdentity.mailingAddress}</dd>
              <dt className="font-medium">Operating state</dt>
              <dd>{businessIdentity.operatingState}</dd>
            </dl>
            <p className="mt-4">
              A complete legal-operator record is not yet published. A registered
              address (if distinct), governing jurisdiction, working privacy
              contact, and data-rights request procedure still require explicit
              confirmation. Non-essential analytics and newsletter signup remain
              disabled.
            </p>
          </>
        ) : (
          <p>
            No legal operator, registered address, working privacy contact,
            data-rights request procedure, or governing jurisdiction has been
            confirmed for publication. This is a pre-launch gate, not a detail
            Norcook will guess. Non-essential analytics and newsletter signup
            must remain disabled.
          </p>
        )}
      </LegalSection>

      <LegalSection title="Essential browser storage">
        <p>
          Norcook stores your theme choice, saved recipe slugs, and consent
          choice in your browser. Those values stay on your device and are used
          to provide the features you requested. Clearing site data removes them.
        </p>
      </LegalSection>

      <LegalSection title="Optional analytics">
        {optionalAnalyticsDisclosure ? (
          <p>
            Optional analytics is disclosed as {optionalAnalyticsDisclosure.providerName}
            {' '}for {optionalAnalyticsDisclosure.purpose}. Its published retention
            period is {optionalAnalyticsDisclosure.retentionPeriod}. See the{' '}
            <a href={optionalAnalyticsDisclosure.providerPrivacyNoticeUrl} target="_blank" rel="noreferrer">
              provider privacy notice
            </a>
            .
          </p>
        ) : (
          <p>
            Optional analytics is disabled. It cannot be enabled until the legal
            operator and governing jurisdiction are public and the analytics
            provider, purpose, retention period, and privacy notice have been
            confirmed for this site.
          </p>
        )}
        <p>
          When enabled after those gates are met, consent remains opt-in. Choosing
          “Essential only” prevents the analytics component and custom events from
          loading. You can reopen Cookie Settings from every page’s footer.
        </p>
      </LegalSection>

      <LegalSection title="Newsletter data">
        {newsletterProcessingDisclosure ? (
          <p>
            Newsletter signup uses {newsletterProcessingDisclosure.providerName}
            {' '}for {newsletterProcessingDisclosure.purpose}. The retention period
            is {newsletterProcessingDisclosure.retentionPeriod}; deletion requests
            are handled as follows: {newsletterProcessingDisclosure.deletionProcedure}{' '}
            See the{' '}
            <a href={newsletterProcessingDisclosure.providerPrivacyNoticeUrl} target="_blank" rel="noreferrer">
              provider privacy notice
            </a>
            .
          </p>
        ) : (
          <p>
            Newsletter signup is disabled. It cannot collect an email address
            until the operator, provider, purpose, retention period, deletion
            procedure, and provider privacy notice are all published here.
          </p>
        )}
      </LegalSection>

      <LegalSection title="Your rights and contact">
        <p>
          {legalOperator ? (
            <>
              Applicable privacy rights are handled through the privacy contact and
              request procedure above. This notice does not replace the applicable
              law of the stated governing jurisdiction.
            </>
          ) : businessIdentity ? (
            <>
              Norcook has published its legal entity and mailing address above, but
              it does not yet publish a privacy contact or data-rights request
              procedure. Do not enable personal-data collection until those details
              and the governing jurisdiction are published.
            </>
          ) : (
            <>
              Applicable privacy rights depend on the operator and jurisdiction.
              Norcook must publish a working privacy contact and the relevant
              request procedure before collecting personal data. Until then, do
              not enable newsletter capture or optional analytics in production.
            </>
          )}
        </p>
      </LegalSection>
    </LegalPage>
  )
}
