/**
 * First focusable element on every page. Visually hidden until focused, then it
 * lands the reader past the sticky header and the region navigation.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground"
    >
      Skip to main content
    </a>
  )
}
