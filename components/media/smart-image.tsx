'use client'

import { IMAGE_FALLBACK, POSTER_BLUR } from '@/lib/image'
import { cn } from '@/lib/utils'
import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

/**
 * Drop-in wrapper around next/image for the Discover feed and Recipe Detail.
 *
 * Adds two resilience/perf behaviors on top of Next's optimization cache:
 *  1. A warm ember blur placeholder so high-res posters fade in gracefully.
 *  2. Graceful degradation — if a poster/avatar fails to fetch or decode, it
 *     swaps to the themed fallback instead of rendering a broken image (pairs
 *     with the global error boundary for a crash-free experience).
 */
export function SmartImage({
  src,
  alt,
  className,
  blurDataURL,
  placeholder = 'blur',
  ...props
}: ImageProps) {
  const [errored, setErrored] = useState(false)
  const resolvedSrc = errored || !src ? IMAGE_FALLBACK : src

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      placeholder={placeholder}
      blurDataURL={blurDataURL ?? POSTER_BLUR}
      onError={() => setErrored(true)}
      className={cn(className)}
    />
  )
}
