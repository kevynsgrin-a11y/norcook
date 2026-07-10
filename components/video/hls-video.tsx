'use client'

import { cn } from '@/lib/utils'
import { MUX_DATA_KEY } from '@/lib/video'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type VideoHTMLAttributes,
} from 'react'

/**
 * HlsVideo — adaptive-bitrate HLS player.
 *
 * Uses hls.js where MSE is available and falls back to native HLS on Safari.
 * The prop surface (`src`, `poster`, `muted`, `autoPlay`, `loop`) intentionally
 * mirrors Mux's `next-video` <Video> component, so going live is a drop-in swap:
 *
 *   import Video from 'next-video'
 *   <Video playbackId={recipe.muxPlaybackId} ... />
 *
 * Here we point `src` at sample HLS streams instead of a Mux playback URL.
 */

export interface HlsVideoHandle {
  play: () => Promise<void> | void
  pause: () => void
  seek: (seconds: number) => void
  getCurrentTime: () => number
  setMuted: (muted: boolean) => void
}

interface HlsVideoProps
  extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
  src: string
  poster?: string
  /** Called on every timeupdate with the current playback time in seconds. */
  onTime?: (seconds: number) => void
  /** Only attach the heavy HLS engine when the item is active/visible. */
  active?: boolean
  /** Stable id reported to Mux Data for per-video analytics. */
  videoId?: string
  /** Human-readable title reported to Mux Data. */
  videoTitle?: string
}

export const HlsVideo = forwardRef<HlsVideoHandle, HlsVideoProps>(
  function HlsVideo(
    { src, poster, onTime, active = true, videoId, videoTitle, className, muted, autoPlay, loop, playsInline = true, ...rest },
    ref,
  ) {
    const videoRef = useRef<HTMLVideoElement>(null)
    // Holds the lazily-loaded mux-embed module so cleanup can detach monitoring.
    const muxRef = useRef<typeof import('mux-embed').default | null>(null)

    useImperativeHandle(ref, () => ({
      play: () => {
        // Swallow autoplay-policy rejections (play before user gesture).
        const p = videoRef.current?.play()
        if (p && typeof p.catch === 'function') p.catch(() => {})
        return p
      },
      pause: () => videoRef.current?.pause(),
      seek: (seconds: number) => {
        if (videoRef.current) videoRef.current.currentTime = seconds
      },
      getCurrentTime: () => videoRef.current?.currentTime ?? 0,
      setMuted: (m: boolean) => {
        if (videoRef.current) videoRef.current.muted = m
      },
    }))

    useEffect(() => {
      const video = videoRef.current
      if (!video || !active) return

      let hls: import('hls.js').default | null = null
      let cancelled = false

      const isNativeHls = video.canPlayType('application/vnd.apple.mpegurl')
      const isHls = src.includes('.m3u8')
      const initTime = Date.now()

      // Attach Mux Data monitoring (no-op without an env key configured).
      async function monitor(Hls?: typeof import('hls.js').default) {
        if (!video || !MUX_DATA_KEY) return
        const mux = (await import('mux-embed')).default
        if (cancelled) return
        muxRef.current = mux
        mux.monitor(video, {
          debug: false,
          ...(hls ? { hlsjs: hls, Hls } : {}),
          data: {
            env_key: MUX_DATA_KEY,
            player_name: 'RecipeMatrix Player',
            player_init_time: initTime,
            video_id: videoId,
            video_title: videoTitle,
            video_stream_type: 'on-demand',
          },
        })
      }

      async function setup() {
        if (!video) return
        if (isHls && !isNativeHls) {
          const Hls = (await import('hls.js')).default
          if (cancelled) return
          if (Hls.isSupported()) {
            hls = new Hls({
              // Adaptive bitrate: start low, climb to the best the network allows.
              startLevel: -1,
              capLevelToPlayerSize: true,
              maxBufferLength: 12,
            })
            void monitor(Hls)
            hls.loadSource(src)
            hls.attachMedia(video)
            return
          }
        }
        // Native HLS (Safari/iOS) or plain mp4.
        video.src = src
        void monitor()
      }

      void setup()

      return () => {
        cancelled = true
        if (muxRef.current && video) {
          muxRef.current.destroyMonitor(video)
          muxRef.current = null
        }
        if (hls) {
          hls.destroy()
          hls = null
        }
      }
    }, [src, active, videoId, videoTitle])

    useEffect(() => {
      const video = videoRef.current
      if (!video || !onTime) return
      const handler = () => onTime(video.currentTime)
      video.addEventListener('timeupdate', handler)
      return () => video.removeEventListener('timeupdate', handler)
    }, [onTime])

    return (
      <video
        ref={videoRef}
        poster={poster}
        muted={muted}
        autoPlay={autoPlay && active}
        loop={loop}
        playsInline={playsInline}
        preload={active ? 'auto' : 'none'}
        className={cn('h-full w-full object-cover', className)}
        {...rest}
      />
    )
  },
)
