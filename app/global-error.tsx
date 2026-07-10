'use client'

import { useEffect } from 'react'

/**
 * Last-resort boundary that catches errors in the root layout itself. It
 * replaces the entire document (no theme/Tailwind context), so it is styled
 * inline with the dark ember palette to stay on-brand even in total failure.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Global error boundary caught:', error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          backgroundColor: '#211a15',
          color: '#f5efe8',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
          Recipe Unavailable
        </h1>
        <p style={{ maxWidth: '28rem', color: '#b8ab9d', lineHeight: 1.6 }}>
          Something went wrong while loading Shoreburst. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            border: 'none',
            borderRadius: '9999px',
            padding: '0.65rem 1.4rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: '#e0632e',
            color: '#211a15',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
