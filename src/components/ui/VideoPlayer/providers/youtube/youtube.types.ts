/**
 * youtube.types.ts
 *
 * Minimal typings for the parts of the YouTube IFrame Player API this
 * adapter actually uses. Deliberately not exhaustive — we only type the
 * surface we call, and nothing here is exported outside providers/youtube.
 *
 * Reference: https://developers.google.com/youtube/iframe_api_reference
 */

export const enum YTPlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

export interface YTPlayerEvent {
  target: YTPlayer;
  data?: number;
}

export interface YTPlayerOptions {
  height?: string | number;
  width?: string | number;
  videoId: string;
  playerVars?: {
    autoplay?: 0 | 1;
    cc_load_policy?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    fs?: 0 | 1;
    iv_load_policy?: 1 | 3;
    loop?: 0 | 1;
    modestbranding?: 1;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
    start?: number;
    mute?: 0 | 1;
    origin?: string;
  };
  events?: {
    onReady?: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTPlayerEvent) => void;
    onError?: (event: YTPlayerEvent) => void;
  };
}

export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  setVolume(volume: number): void;
  getVolume(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getPlayerState(): YTPlayerState;
  destroy(): void;
  unloadModule?(moduleName: string): void;
  getIframe(): HTMLIFrameElement;
}

export interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: YTPlayerOptions
  ) => YTPlayer;
  PlayerState: typeof YTPlayerState;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}
