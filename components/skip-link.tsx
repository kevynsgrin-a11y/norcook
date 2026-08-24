'use client'

import type { MouseEvent } from 'react'

/**
 * First focusable element on every page. Visually hidden until focused, then it
 * lands the reader past the sticky header and the region navigation.
 */
export function SkipLink() {
  function focusMain(event: MouseEvent<HTMLAnchorElement>) {
    // Preserve browser-native behaviours such as opening the anchor in a new
    // tab, and leave the href as a no-JavaScript fallback.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return
    }

    const main = document.getElementById('main-content')
    if (!(main instanceof HTMLElement)) return

    event.preventDefault()
    if (window.location.hash !== '#main-content') {
      window.history.pushState(null, '', '#main-content')
    }
    // A landmark is not natively focusable. Giving it a programmatic-only
    // target keeps it out of the normal tab order while making the skip action
    // reliable for keyboard and screen-reader users.
    main.setAttribute('tabindex', '-1')
    main.scrollIntoView({ block: 'start' })
    const header = document.querySelector('header')
    if (header instanceof HTMLElement) {
      window.scrollBy({ top: -header.getBoundingClientRect().height })
    }
    main.focus({ preventScroll: true })
  }

  return (
    <a
      href="#main-content"
      onClick={focusMain}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground"
    >
      Skip to main content
    </a>
  )
}
