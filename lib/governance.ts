/**
 * Public governance records for claims that need a real accountable owner.
 *
 * Keep the configuration in version-controlled source rather than making a
 * scattered set of environment flags the source of truth. A value becomes
 * public only when a reviewed change supplies every required field. Partial,
 * placeholder, or malformed records are ignored by the helpers below, so they
 * cannot accidentally turn a launch or qualified-review claim on.
 *
 * Do not populate these records from an LLM, a hosting-account profile, or an
 * unverified commit message. The named legal operator and reviewer must be
 * independently confirmed by the responsible business before publication.
 */

export const REQUIRED_SENSITIVE_RECIPE_SLUGS = [
  'fenalar',
  'gravlaks',
  'rokt-roye',
  'spekemat',
  'sursild',
  'rakfisk',
] as const

export type SensitiveRecipeSlug = (typeof REQUIRED_SENSITIVE_RECIPE_SLUGS)[number]

export type PublicLegalOperator = {
  legalName: string
  registeredAddress: string
  privacyContactEmail: string
  dataRightsRequestProcedure: string
  governingJurisdiction: string
  confirmedOn: string
}

/**
 * Facts that the business has confirmed, but which are intentionally narrower
 * than a complete public legal-operator record. In particular, a mailing
 * address must not be relabeled as a registered address, and an operating
 * state must not be relabeled as a governing-law choice.
 */
export type PublicBusinessIdentity = {
  legalName: string
  mailingAddress: string
  operatingState: string
}

export type OptionalAnalyticsDisclosure = {
  providerName: string
  purpose: string
  retentionPeriod: string
  providerPrivacyNoticeUrl: string
  confirmedOn: string
}

export type NewsletterProcessingDisclosure = {
  providerName: string
  purpose: string
  retentionPeriod: string
  deletionProcedure: string
  providerPrivacyNoticeUrl: string
  confirmedOn: string
}

export type AffiliatePublicationDisclosure = {
  partnerNames: readonly string[]
  relationshipDisclosure: string
  partnerTermsReference: string
  confirmedOn: string
}

export type FoodSafetyReviewRecord = {
  recipeSlugs: readonly SensitiveRecipeSlug[]
  reviewerName: string
  credentials: string
  scope: string
  evidenceReference: string
  reviewedOn: string
  decision: string
  nextReviewOn: string
}

/**
 * Replace `null` only after the operator's legal identity, public contact, and
 * jurisdiction have been confirmed. The validation below refuses partial data.
 */
const CONFIGURED_LEGAL_OPERATOR: PublicLegalOperator | null = null

/**
 * Confirmed on 2026-08-23 by the responsible business. This remains separate
 * from CONFIGURED_LEGAL_OPERATOR until the missing legal and privacy fields
 * have been explicitly approved for publication.
 */
const CONFIGURED_BUSINESS_IDENTITY: PublicBusinessIdentity | null = {
  legalName: 'Oak and Main Developers LLC',
  mailingAddress: '2108 N St., Sacramento, CA 95816',
  operatingState: 'California, United States',
}

/**
 * These remain null until the provider's published terms, retention, and the
 * requested data-deletion route have been approved for this property.
 */
const CONFIGURED_OPTIONAL_ANALYTICS: OptionalAnalyticsDisclosure | null = null
const CONFIGURED_NEWSLETTER_PROCESSING: NewsletterProcessingDisclosure | null = null

/**
 * A commercial relationship requires its own approved disclosure record even
 * after the legal operator is published.
 */
const CONFIGURED_AFFILIATE_DISCLOSURE: AffiliatePublicationDisclosure | null = null

/**
 * Add a record only when a named qualified professional has actually reviewed
 * the listed recipes and the evidence reference can be produced on request.
 */
const CONFIGURED_FOOD_SAFETY_REVIEWS: readonly FoodSafetyReviewRecord[] = []

const PLACEHOLDER_VALUE = /^(?:tbd|todo|unknown|unassigned|n\/a|none|not set|example|placeholder)$/i
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function hasPublishedValue(value: string) {
  const trimmed = value.trim()
  return Boolean(trimmed) && !PLACEHOLDER_VALUE.test(trimmed)
}

function isIsoDate(value: string) {
  return ISO_DATE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function isCompleteLegalOperator(
  value: PublicLegalOperator | null,
): value is PublicLegalOperator {
  return Boolean(
    value &&
      hasPublishedValue(value.legalName) &&
      hasPublishedValue(value.registeredAddress) &&
      EMAIL.test(value.privacyContactEmail) &&
      hasPublishedValue(value.dataRightsRequestProcedure) &&
      hasPublishedValue(value.governingJurisdiction) &&
      isIsoDate(value.confirmedOn),
  )
}

function isCompleteBusinessIdentity(
  value: PublicBusinessIdentity | null,
): value is PublicBusinessIdentity {
  return Boolean(
    value &&
      hasPublishedValue(value.legalName) &&
      hasPublishedValue(value.mailingAddress) &&
      hasPublishedValue(value.operatingState),
  )
}

function isCompleteOptionalAnalyticsDisclosure(
  value: OptionalAnalyticsDisclosure | null,
): value is OptionalAnalyticsDisclosure {
  return Boolean(
    value &&
      hasPublishedValue(value.providerName) &&
      hasPublishedValue(value.purpose) &&
      hasPublishedValue(value.retentionPeriod) &&
      isHttpsUrl(value.providerPrivacyNoticeUrl) &&
      isIsoDate(value.confirmedOn),
  )
}

function isCompleteNewsletterProcessingDisclosure(
  value: NewsletterProcessingDisclosure | null,
): value is NewsletterProcessingDisclosure {
  return Boolean(
    value &&
      hasPublishedValue(value.providerName) &&
      hasPublishedValue(value.purpose) &&
      hasPublishedValue(value.retentionPeriod) &&
      hasPublishedValue(value.deletionProcedure) &&
      isHttpsUrl(value.providerPrivacyNoticeUrl) &&
      isIsoDate(value.confirmedOn),
  )
}

function isCompleteAffiliateDisclosure(
  value: AffiliatePublicationDisclosure | null,
): value is AffiliatePublicationDisclosure {
  return Boolean(
    value &&
      value.partnerNames.length > 0 &&
      value.partnerNames.every(hasPublishedValue) &&
      hasPublishedValue(value.relationshipDisclosure) &&
      hasPublishedValue(value.partnerTermsReference) &&
      isIsoDate(value.confirmedOn),
  )
}

function isCompleteFoodSafetyReview(value: FoodSafetyReviewRecord) {
  return (
    value.recipeSlugs.length > 0 &&
    value.recipeSlugs.every((slug) => REQUIRED_SENSITIVE_RECIPE_SLUGS.includes(slug)) &&
    hasPublishedValue(value.reviewerName) &&
    hasPublishedValue(value.credentials) &&
    hasPublishedValue(value.scope) &&
    hasPublishedValue(value.evidenceReference) &&
    isIsoDate(value.reviewedOn) &&
    hasPublishedValue(value.decision) &&
    isIsoDate(value.nextReviewOn)
  )
}

export const legalOperator: PublicLegalOperator | null = isCompleteLegalOperator(
  CONFIGURED_LEGAL_OPERATOR,
)
  ? CONFIGURED_LEGAL_OPERATOR
  : null

export const businessIdentity: PublicBusinessIdentity | null = isCompleteBusinessIdentity(
  CONFIGURED_BUSINESS_IDENTITY,
)
  ? CONFIGURED_BUSINESS_IDENTITY
  : null

export const optionalAnalyticsDisclosure: OptionalAnalyticsDisclosure | null =
  legalOperator && isCompleteOptionalAnalyticsDisclosure(CONFIGURED_OPTIONAL_ANALYTICS)
    ? CONFIGURED_OPTIONAL_ANALYTICS
    : null

export const newsletterProcessingDisclosure: NewsletterProcessingDisclosure | null =
  legalOperator && isCompleteNewsletterProcessingDisclosure(CONFIGURED_NEWSLETTER_PROCESSING)
    ? CONFIGURED_NEWSLETTER_PROCESSING
    : null

export const affiliatePublicationDisclosure: AffiliatePublicationDisclosure | null =
  legalOperator && isCompleteAffiliateDisclosure(CONFIGURED_AFFILIATE_DISCLOSURE)
    ? CONFIGURED_AFFILIATE_DISCLOSURE
    : null

export const qualifiedFoodSafetyReviews = CONFIGURED_FOOD_SAFETY_REVIEWS.filter(
  isCompleteFoodSafetyReview,
)

export function getQualifiedFoodSafetyReview(slug: string) {
  return qualifiedFoodSafetyReviews.find((review) => review.recipeSlugs.includes(slug as SensitiveRecipeSlug))
}

export const hasCompleteFoodSafetyReview = REQUIRED_SENSITIVE_RECIPE_SLUGS.every(
  (slug) => Boolean(getQualifiedFoodSafetyReview(slug)),
)

/**
 * These are publication-readiness gates, not runtime feature flags. Existing
 * newsletter and analytics controls remain disabled unless their own approved
 * deployment configuration is also present.
 */
export const governanceReadiness = {
  legalOperator: legalOperator ? 'ready' : 'blocked',
  optionalAnalytics: optionalAnalyticsDisclosure ? 'ready' : 'blocked',
  newsletter: newsletterProcessingDisclosure ? 'ready' : 'blocked',
  affiliateLinks: affiliatePublicationDisclosure ? 'ready' : 'blocked',
  foodSafetyReviews: hasCompleteFoodSafetyReview ? 'ready' : 'blocked',
} as const
