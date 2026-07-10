import { NextResponse } from 'next/server'

/**
 * Mocked Stripe Connect payout endpoint.
 *
 * Demonstrates the "Separate Charges and Transfers" model: the platform first
 * charges the buyer (e.g. an ad impression payout or recipe sale lands in the
 * platform balance), then issues a `transfer` to each creator's connected
 * account. We take a platform fee and route the remainder to the creator.
 *
 * In production this would call:
 *   stripe.transfers.create({ amount, currency, destination: acct_xxx, ... })
 * with STRIPE_SECRET_KEY. Here we just structure + echo the payload.
 */

const PLATFORM_FEE_RATE = 0.2 // 20% platform fee, 80% to creator

interface PayoutRequest {
  creatorStripeAccountId: string
  grossAmountCents: number
  currency?: string
  sourceTransactionId?: string
  description?: string
}

export async function POST(request: Request) {
  let body: PayoutRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.creatorStripeAccountId || !body.grossAmountCents) {
    return NextResponse.json(
      { error: 'creatorStripeAccountId and grossAmountCents are required' },
      { status: 400 },
    )
  }

  const platformFeeCents = Math.round(body.grossAmountCents * PLATFORM_FEE_RATE)
  const transferAmountCents = body.grossAmountCents - platformFeeCents

  // Shape mirrors stripe.transfers.create params.
  const transferPayload = {
    amount: transferAmountCents,
    currency: body.currency ?? 'usd',
    destination: body.creatorStripeAccountId,
    source_transaction: body.sourceTransactionId ?? null,
    description: body.description ?? 'Shoreburst creator revenue split',
    metadata: {
      platform_fee_cents: String(platformFeeCents),
      model: 'separate_charges_and_transfers',
    },
  }

  // Mocked Stripe response object.
  const mockTransfer = {
    id: `tr_mock_${Math.random().toString(36).slice(2, 12)}`,
    object: 'transfer',
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    ...transferPayload,
  }

  return NextResponse.json({
    ok: true,
    note: 'Mocked Stripe Connect transfer. Wire STRIPE_SECRET_KEY + stripe.transfers.create to go live.',
    breakdown: {
      grossAmountCents: body.grossAmountCents,
      platformFeeCents,
      transferAmountCents,
      platformFeeRate: PLATFORM_FEE_RATE,
    },
    transfer: mockTransfer,
  })
}
