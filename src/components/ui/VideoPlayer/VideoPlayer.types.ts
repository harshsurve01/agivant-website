/**
 * VideoPlayer.types.ts
 *
 * This file defines the full contract for the VideoPlayer component:
 *  - the public, provider-agnostic API (VideoPlayerProps, VideoSource)
 *  - the shared playback state machine (PlayerStatus, PlayerState, PlayerError)
 *  - the PlayerController: the single boundary between a provider engine
 *    (YouTube today; Vimeo / self-hosted later) and the shared glass UI.
 *
 * No provider-specific types live here. YouTube's own types live in
 * providers/youtube/youtube.types.ts and never leak past the adapter.
 */

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Discriminated union of playback sources.
 * Only "youtube" is implemented today. Adding a new provider later means
 * adding a member here plus one branch in VideoPlayer.tsx's provider
 * switch — consumers (e.g. EpisodePlayer) never change.
 */
export type VideoSource =
  | { provider: "youtube"; id: string };
// Future members, added when implemented (not stubbed ahead of time):
// | { provider: "vimeo"; id: string }
// | { provider: "self-hosted"; src: string }

export interface VideoPlayerProps {
  /** Which engine to use and the id/src it needs. */
  source: VideoSource;
  /** Always shown before playback starts; gates the lazy load. Required. */
  poster: string;
  /** Accessible name for the player region and the underlying iframe/video. */
  title: string;

  /** Attempt autoplay once the engine is ready. Still gated behind the lazy-load click. */
  autoPlay?: boolean;
  loop?: boolean;
  /** Resume position / deep link, in seconds. */
  startTime?: number;
  /** Initial muted state — relevant for autoplay policies. */
  muted?: boolean;

  /** Layout-level sizing/positioning hook. No styling API beyond this. */
  className?: string;

  /** Optional escape hatch for consumers that need to observe state (e.g. analytics). */
  onStateChange?: (state: PlayerState) => void;
}

// ---------------------------------------------------------------------------
// Shared playback state machine
// ---------------------------------------------------------------------------

export type PlayerStatus =
  | "idle" // poster shown, engine not yet loaded, no network activity
  | "loading" // user pressed play; script/engine loading, iframe mounting
  | "ready" // engine loaded, not yet playing
  | "playing"
  | "paused"
  | "buffering" // playing but stalled on data
  | "seeking" // user is dragging/dropping on the timeline
  | "ended"
  | "error";

/**
 * Closed vocabulary for playback errors. Every provider adapter must
 * normalize its native errors into one of these — the error UI switches
 * on `code` and must never see a provider-specific shape.
 */
export type PlayerErrorCode =
  | "EMBED_DISABLED" // owner has disabled embedding for this video
  | "NOT_FOUND" // video removed, private, or invalid id
  | "NETWORK_ERROR" // script/engine failed to load
  | "PLAYBACK_ERROR" // engine loaded but playback itself failed
  | "UNKNOWN";

export interface PlayerError {
  code: PlayerErrorCode;
  /** Human-readable, safe to render directly in the error state UI. */
  message: string;
  /** Original provider error, for logging only. Never rendered. */
  raw?: unknown;
}

export interface PlayerState {
  status: PlayerStatus;
  /** Seconds. */
  currentTime: number;
  /** Seconds. 0 until the engine reports metadata. */
  duration: number;
  /** 0–100. */
  volume: number;
  muted: boolean;
  isFullscreen: boolean;
  error: PlayerError | null;
}

export const INITIAL_PLAYER_STATE: PlayerState = {
  status: "idle",
  currentTime: 0,
  duration: 0,
  volume: 100,
  muted: false,
  isFullscreen: false,
  error: null,
};

// ---------------------------------------------------------------------------
// PlayerController — the engine/UI boundary
// ---------------------------------------------------------------------------

/**
 * The single contract the shared UI programs against. Any provider engine
 * (YouTube adapter today) must produce an object implementing this.
 *
 * Snapshot-based by design: getState() returns a point-in-time read.
 * VideoPlayer is currently the only consumer, so reactivity is handled by
 * a separate hook (usePlayerController) that decides polling/update
 * cadence, rather than the controller carrying its own subscription
 * mechanism. Revisit only if a second, independent UI surface needs to
 * observe the same controller.
 */
export interface PlayerController {
  // Commands
  play(): void;
  pause(): void;
  togglePlay(): void;
  /** Absolute seek, in seconds. */
  seek(seconds: number): void;
  /** Convenience for scrubber drag: ratio is 0–1 of duration. */
  seekByRatio(ratio: number): void;
  /** 0–100. */
  setVolume(level: number): void;
  mute(): void;
  unmute(): void;
  toggleMute(): void;
  requestFullscreen(): void;
  exitFullscreen(): void;
  toggleFullscreen(): void;

  // State
  getState(): PlayerState;

  // Lifecycle
  destroy(): void;
}

// ---------------------------------------------------------------------------
// Internal provider adapter contract (not exported from index.ts)
// ---------------------------------------------------------------------------

export interface ProviderAdapterOptions {
  /** Element the engine mounts its player into (iframe target). */
  containerRef: React.RefObject<HTMLDivElement | null>;
  source: VideoSource;
  autoPlay: boolean;
  loop: boolean;
  startTime: number;
  muted: boolean;
  /** Called by the adapter whenever the engine's native state changes. */
  onStateChange: (state: PlayerState) => void;
}

export interface ProviderAdapter {
  /**
   * Loads whatever the engine needs (script, SDK) and mounts the player.
   * Resolves once the engine is ready to receive commands. Rejects with
   * a PlayerError-shaped reason on fatal setup failure.
   */
  init(options: ProviderAdapterOptions): Promise<PlayerController>;
}
