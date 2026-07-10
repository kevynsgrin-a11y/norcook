'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'
import type { CreatorEarnings } from '@/lib/earnings'

interface TransferResult {
  ok: boolean
  breakdown: {
    grossAmountCents: number
    platformFeeCents: number
    transferAmountCents: number
    platformFeeRate: number
  }
  transfer: { id: string; destination: string }
  note: string
}

export function PayoutPanel({ earnings }: { earnings: CreatorEarnings }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TransferResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function runTransfer() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/payouts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          creatorStripeAccountId: earnings.creator.stripeAccountId,
          grossAmountCents: earnings.grossCents,
          description: `Payout to @${earnings.creator.handle}`,
        }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setResult((await res.json()) as TransferResult)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">Initiate payout</p>
          <p className="text-xs text-muted-foreground">
            Separate Charges &amp; Transfers to{' '}
            <span className="font-mono">{earnings.creator.stripeAccountId}</span>
          </p>
        </div>
        <Button onClick={runTransfer} disabled={loading}>
          {loading ? 'Transferring…' : `Transfer ${formatCurrency(earnings.netCents)}`}
        </Button>
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      {result && (
        <div className="mt-4 grid gap-2 rounded-lg bg-secondary p-3 text-sm">
          <Row label="Gross charged" value={formatCurrency(result.breakdown.grossAmountCents)} />
          <Row
            label={`Platform fee (${Math.round(result.breakdown.platformFeeRate * 100)}%)`}
            value={`- ${formatCurrency(result.breakdown.platformFeeCents)}`}
          />
          <div className="h-px bg-border" />
          <Row
            label="Transferred to creator"
            value={formatCurrency(result.breakdown.transferAmountCents)}
            strong
          />
          <p className="pt-1 font-mono text-xs text-muted-foreground">
            transfer.id: {result.transfer.id}
          </p>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? 'font-semibold text-foreground' : 'text-foreground'}>{value}</span>
    </div>
  )
}
