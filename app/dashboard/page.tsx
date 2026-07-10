import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { CreatorDashboard } from '@/components/dashboard/creator-dashboard'
import { getAllCreatorEarnings } from '@/lib/earnings'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: `Creator Payouts · ${SITE_NAME}`,
  description: 'Multi-tenant creator revenue dashboard powered by Stripe Connect.',
}

export default function DashboardPage() {
  const earnings = getAllCreatorEarnings()

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>{' '}
            / Creator payouts
          </p>
          <h1 className="text-balance text-3xl font-semibold text-foreground">Creator Payouts</h1>
          <p className="mt-1 max-w-2xl text-pretty text-muted-foreground">
            Multi-tenant revenue routing via Stripe Connect using Separate Charges &amp; Transfers.
            Platform collects charges, then transfers each creator&apos;s split to their connected
            account.
          </p>
        </div>
        <CreatorDashboard earnings={earnings} />
      </main>
    </div>
  )
}
