import { NextResponse, type NextRequest } from 'next/server'

/**
 * Edge A/B testing middleware.
 *
 * Assigns each visitor a sticky bucket ('A' or 'B') on their first request and
 * persists it in a cookie. Because the assignment happens at the edge before the
 * page renders, the server can read the variant during SSR and ship the correct
 * markup on the first byte — no client-side flicker or layout shift.
 *
 * Variants here drive things like thumbnail ordering/treatment on the grid.
 */

const COOKIE = 'sb_variant'
const VARIANTS = ['A', 'B'] as const

export function middleware(request: NextRequest) {
  const existing = request.cookies.get(COOKIE)?.value

  // Forward the resolved variant to the app via a request header so Server
  // Components can read it synchronously during the same render.
  const variant =
    existing === 'A' || existing === 'B'
      ? existing
      : VARIANTS[Math.floor(Math.random() * VARIANTS.length)]

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-sb-variant', variant)

  const response = NextResponse.next({ request: { headers: requestHeaders } })

  if (existing !== variant) {
    response.cookies.set(COOKIE, variant, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
