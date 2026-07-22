import type { Metadata } from 'next'
import { LegalPage, LegalSection } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Norcook handles local storage, analytics consent, and newsletter data.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy · Updated July 21, 2026"
      title="Privacy choices before measurement"
      intro="Norcook’s current default is essential storage only. Optional analytics and newsletter capture are technically gated until the site’s legal operator, jurisdiction, and privacy contact are published."
    >
      <LegalSection title="Operator status">
        <p>
          The legal entity, address, privacy contact, and governing jurisdiction
          have not yet been confirmed. This is a launch blocker, not a detail we
          will guess. Non-essential analytics and newsletter signup remain
          disabled unless an operator explicitly configures them.
        </p>
      </LegalSection>

      <LegalSection title="Essential browser storage">
        <p>
          Norcook stores your theme choice, saved recipe slugs, and consent
          choice in your browser. Those values stay on your device and are used
          to provide the features you requested. Clearing site data removes them.
        </p>
      </LegalSection>

      <LegalSection title="Optional analytics">
        <p>
          If analytics is configured and you choose “Allow analytics,” Norcook
          loads Vercel Analytics and may record recipe views, search submissions,
          newsletter successes, favourite toggles, configured affiliate clicks,
          and 404 or runtime-error routes. Search text and email addresses are not
          included in event properties; search events use query length and result
          count instead.
        </p>
        <p>
          Choosing “Essential only” prevents the analytics component and custom
          events from loading. You can reopen Cookie Settings from every page’s
          footer. Consent is versioned in local storage as{' '}
          <code>norcook-consent-v1</code>.
        </p>
      </LegalSection>

      <LegalSection title="Newsletter data">
        <p>
          Newsletter signup is disabled by default. If activated, the form sends
          the email address to a server-side provider configured by the operator.
          The provider, purpose, retention period, deletion method, and operator
          contact must be added to this notice before activation.
        </p>
      </LegalSection>

      <LegalSection title="Your rights and contact">
        <p>
          Applicable privacy rights depend on the operator and jurisdiction.
          Norcook must publish a working privacy contact and the relevant request
          procedure before collecting personal data. Until then, do not enable
          newsletter capture or optional analytics in production.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
