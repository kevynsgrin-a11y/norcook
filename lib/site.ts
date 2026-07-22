export const SITE_NAME = 'Norcook'
export const SITE_URL = 'https://www.norcook.app'
export const SITE_DESCRIPTION =
  'A cultural guide to Norway through regional recipes, food history, and careful kitchen guidance.'
export const CONTENT_REVIEW_DATE = '2026-07-21'

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString()
}
