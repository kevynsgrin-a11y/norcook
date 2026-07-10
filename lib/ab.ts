import 'server-only'
import { headers } from 'next/headers'
import type { AbVariant } from '@/lib/types'

/**
 * Reads the A/B bucket assigned by the edge middleware (`x-sb-variant`).
 * Resolved during SSR so the rendered markup already reflects the variant.
 */
export async function getVariant(): Promise<AbVariant> {
  const h = await headers()
  return h.get('x-sb-variant') === 'B' ? 'B' : 'A'
}
