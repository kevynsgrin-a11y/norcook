declare module 'mux-embed' {
  interface MuxMonitorData {
    env_key?: string
    player_name?: string
    player_init_time?: number
    video_id?: string
    video_title?: string
    video_stream_type?: string
    [key: string]: unknown
  }

  interface MuxMonitorOptions {
    debug?: boolean
    hlsjs?: unknown
    Hls?: unknown
    data: MuxMonitorData
    [key: string]: unknown
  }

  interface MuxEmbed {
    monitor(element: HTMLMediaElement | string, options: MuxMonitorOptions): void
    destroyMonitor(element: HTMLMediaElement | string): void
    [key: string]: unknown
  }

  const mux: MuxEmbed
  export default mux
}
