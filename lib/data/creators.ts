import type { Creator } from '@/lib/types'

/**
 * Creator roster — one voice per region covered by the catalog. In
 * production this is the `creators` table. Each maps to a Stripe Connect
 * account for payout routing (mocked ids).
 */
export const creators: Record<string, Creator> = {
  elin: {
    id: 'cr_elin',
    handle: 'elinsapmi',
    name: 'Elin Partapuoli',
    avatarUrl: '/creators/elin.png',
    bio: 'Sámi reindeer-herding family, Finnmark. Árran-fire cooking, zero waste.',
    verified: true,
    followers: 610_000,
    stripeAccountId: 'acct_mock_elin',
  },
  kristoffer: {
    id: 'cr_kristoffer',
    handle: 'vestlandcatch',
    name: 'Kristoffer Nystrøm',
    avatarUrl: '/creators/kristoffer.png',
    bio: 'Bergen fisherman family. Cod, salmon, and the fjord in every dish.',
    verified: true,
    followers: 940_000,
    stripeAccountId: 'acct_mock_kristoffer',
  },
  ingrid: {
    id: 'cr_ingrid',
    handle: 'sorlandbaker',
    name: 'Ingrid Solberg',
    avatarUrl: '/creators/ingrid.png',
    bio: 'Kristiansand coast. Shellfish straight off the boat, kransekake at Christmas.',
    verified: true,
    followers: 720_000,
    stripeAccountId: 'acct_mock_ingrid',
  },
  lars: {
    id: 'cr_lars',
    handle: 'ostlandhearth',
    name: 'Lars Haugen',
    avatarUrl: '/creators/lars.png',
    bio: 'Farmhouse cook, Hedmark valley. Slow pots, rendered fat, Sunday fårikål.',
    verified: false,
    followers: 385_000,
    stripeAccountId: 'acct_mock_lars',
  },
  frida: {
    id: 'cr_frida',
    handle: 'fridabakes',
    name: 'Frida Berg',
    avatarUrl: '/creators/frida.png',
    bio: 'Oslo baker turned cardamom evangelist. Knots, buns, and oven spring.',
    verified: true,
    followers: 1_380_000,
    stripeAccountId: 'acct_mock_frida',
  },
}

export const creatorList: Creator[] = Object.values(creators)
