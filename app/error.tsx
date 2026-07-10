'use client'

import { ErrorFallback } from '@/components/error/error-fallback'
import { useEffect } from 'react'

/**
 * App-level error boundary. Catches render/data errors below the root layout
 * and shows the themed fallback instead of a blank crash.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Route error boundary caught:', error)
  }, [error])

  return <ErrorFallback reset={reset} />
}
