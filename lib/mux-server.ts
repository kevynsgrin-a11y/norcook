import 'server-only'
import Mux from '@mux/mux-node'

/**
 * Server-side Mux client for creating assets and minting playback IDs.
 *
 * Requires API Access Token credentials (NOT the Mux Data env key):
 *   - MUX_TOKEN_ID
 *   - MUX_TOKEN_SECRET
 * Create them at Mux Dashboard → Settings → API Access Tokens.
 */

let client: Mux | null = null

export function getMuxClient(): Mux {
  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    throw new Error(
      'Mux API credentials missing. Set MUX_TOKEN_ID and MUX_TOKEN_SECRET ' +
        '(Mux Dashboard → Settings → API Access Tokens).',
    )
  }
  if (!client) {
    client = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
    })
  }
  return client
}

/**
 * Create a Mux asset from a publicly accessible source URL and return its
 * public playback id. Store the returned id on the recipe (muxPlaybackId).
 */
export async function createMuxAssetFromUrl(sourceUrl: string): Promise<string> {
  const mux = getMuxClient()
  const asset = await mux.video.assets.create({
    inputs: [{ url: sourceUrl }],
    playback_policy: ['public'],
    encoding_tier: 'smart',
  })
  const playbackId = asset.playback_ids?.[0]?.id
  if (!playbackId) throw new Error('Mux asset created without a playback id')
  return playbackId
}

/**
 * Create a direct-upload URL so creators can upload their own videos from the
 * browser. On completion, Mux fires a webhook (video.asset.ready) carrying the
 * playback id to persist against the recipe.
 */
export async function createDirectUpload(corsOrigin: string) {
  const mux = getMuxClient()
  return mux.video.uploads.create({
    cors_origin: corsOrigin,
    new_asset_settings: {
      playback_policy: ['public'],
      encoding_tier: 'smart',
    },
  })
}
