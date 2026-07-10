import type { Recipe } from '@/lib/types'

/**
 * Mux Data environment key (a.k.a. "Environment Key" in the Mux dashboard).
 * Safe to expose to the client — it only enables playback monitoring, it does
 * not grant API access. Set NEXT_PUBLIC_MUX_DATA_KEY in project env vars.
 */
export const MUX_DATA_KEY = process.env.NEXT_PUBLIC_MUX_DATA_KEY ?? ''

/** Build the adaptive-bitrate HLS URL for a Mux playback id. */
export function muxSrc(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`
}

/**
 * Resolve the playback source for a recipe. Prefers a real Mux asset when a
 * playback id is present, otherwise falls back to the sample/`videoSrc`.
 * This is the single swap point for going live: populate `muxPlaybackId` in
 * the data layer and every surface (feed, masonry, theater, recipe page)
 * streams from Mux automatically.
 */
export function resolveVideoSrc(recipe: Pick<Recipe, 'muxPlaybackId' | 'videoSrc'>): string {
  return recipe.muxPlaybackId ? muxSrc(recipe.muxPlaybackId) : recipe.videoSrc
}
