'use client'

import { ErrorFallback } from '@/components/error/error-fallback'
import { useEffect } from 'react'

/**
 * Recipe Detail error boundary — isolates failures on a single recipe page
 * (e.g. a missing slug or failed media) with the themed fallback.
 */
export default function RecipeError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Recipe detail error boundary caught:', error)
  }, [error])

  return <ErrorFallback reset={reset} />
}
