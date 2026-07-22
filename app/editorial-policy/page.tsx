import type { Metadata } from 'next'
import { LegalPage, LegalSection } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Editorial and Food-Safety Policy',
  description: 'Norcook sourcing, correction, and food-safety review standards.',
  alternates: { canonical: '/editorial-policy' },
}

export default function EditorialPolicyPage() {
  return (
    <LegalPage
      eyebrow="Editorial standards"
      title="Evidence belongs beside the recipe"
      intro="Norcook separates cultural storytelling from food-safety evidence. Sensitive methods receive visible safeguards, source links, and an honest review status."
    >
      <LegalSection title="Current product posture">
        <p>
          Norcook currently operates as an editorial recipe archive. Newsletter
          acquisition, advertising, affiliate commerce, and behavioural analytics
          are dormant until their owners, evidence, and legal basis are confirmed.
        </p>
      </LegalSection>

      <LegalSection title="Safety-sensitive recipes">
        <p>
          Raw cured fish, cold-smoked fish, fermented fish, home curing, ready-to-eat
          cured meat, and refrigerated fish pickles are flagged in structured
          content. Their page-level callouts link to public-health authorities and
          name the review status and date.
        </p>
        <p>
          On July 21, 2026, the unsafe home fenalår procedure was replaced with a
          serving guide for professionally produced meat, and the unsupported
          24-hour parasite-freezing claim on gravlaks was removed.
        </p>
      </LegalSection>

      <LegalSection title="Review ownership">
        <p>
          A qualified food-safety owner has not been named. A sensitive page may
          say “qualified reviewer pending,” but it may not say “reviewed,” “safe,”
          or “validated” until a named specialist records scope, evidence, date,
          and decision. The release content check enforces source coverage for the
          current sensitive set.
        </p>
      </LegalSection>

      <LegalSection title="Unsupported social proof">
        <p>
          The archive no longer contains or displays hard-coded recipe ratings,
          review counts, or the 40,000-reader claim. Those claims may return only
          when a production system of record and calculation method are documented.
        </p>
      </LegalSection>

      <LegalSection title="Corrections">
        <p>
          Corrections should update both the recipe and its evidence panel, add a
          dated note when the safety meaning changes, and pass the same lint,
          type, content, image, build, audit, browser, accessibility, and
          performance gates as code changes.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
