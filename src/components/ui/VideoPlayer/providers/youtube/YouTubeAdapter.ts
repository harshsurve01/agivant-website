import type {
  PlayerController,
  PlayerState,
  ProviderAdapter,
  ProviderAdapterOptions,
} from "../../VideoPlayer.types";
import { INITIAL_PLAYER_STATE } from "../../VideoPlayer.types";
import { loadYouTubeApi } from "./loadYouTubeApi";
import { normalizeYouTubeError } from "./normalizeYouTubeError";
import { YTPlayerState, type YTPlayer, type YTPlayerEvent } from "./youtube.types";

/**
 * YouTubeAdapter
 *
 * Implements ProviderAdapter for source.provider === "youtube". Owns:
 *  - loading the IFrame API (via the singleton loader)
 *  - instantiating YT.Player with our chrome disabled (controls: 0, etc.)
 *  - translating YT.Player's native events/state into PlayerState
 *  - exposing a PlayerController so the shared UI never touches YT.Player
 *    directly.
 *
 * This is the ONLY file in the component that imports youtube.types or
 * calls the YouTube API. Nothing else in VideoPlayer knows YouTube exists.
 */
export const youtubeAdapter: ProviderAdapter = {
  init(options: ProviderAdapterOptions): Promise<PlayerController> {
    const { containerRef, source, autoPlay, loop, startTime, muted, onStateChange } =
      options;

    if (source.provider !== "youtube") {
      return Promise.reject(
        new Error("youtubeAdapter.init called with a non-youtube source.")
      );
    }

    const container = containerRef.current;
    if (!container) {
      return Promise.reject(
        new Error("youtubeAdapter.init called before container was mounted.")
      );
    }

    let state: PlayerState = { ...INITIAL_PLAYER_STATE, status: "loading" };
    let pollHandle: number | null = null;

    const emit = (patch: Partial<PlayerState>) => {
      state = { ...state, ...patch };
      onStateChange(state);
    };

    const startPolling = (player: YTPlayer) => {
      stopPolling();
      pollHandle = window.setInterval(() => {
        // Only poll while something time-relevant is happening; avoids
        // needless work while idle/paused/ended.
        if (state.status === "playing" || state.status === "buffering") {
          emit({
            currentTime: player.getCurrentTime(),
            duration: player.getDuration() || state.duration,
          });
        }
      }, 250);
    };

    const stopPolling = () => {
      if (pollHandle !== null) {
        window.clearInterval(pollHandle);
        pollHandle = null;
      }
    };

    return loadYouTubeApi().then(
      (YT) =>
        new Promise<PlayerController>((resolve, reject) => {
          let ytPlayer: YTPlayer;

          const handleReady = (event: YTPlayerEvent) => {
            ytPlayer = event.target;

            emit({
              status: "ready",
              duration: ytPlayer.getDuration(),
              volume: ytPlayer.getVolume(),
              muted: ytPlayer.isMuted(),
            });

            startPolling(ytPlayer);

            const controller: PlayerController = {
              play: () => ytPlayer.playVideo(),
              pause: () => ytPlayer.pauseVideo(),
              togglePlay: () =>
                state.status === "playing" ? ytPlayer.pauseVideo() : ytPlayer.playVideo(),
              seek: (seconds) => ytPlayer.seekTo(seconds, true),
              seekByRatio: (ratio) => {
                const duration = ytPlayer.getDuration();
                ytPlayer.seekTo(duration * ratio, true);
              },
              setVolume: (level) => {
                ytPlayer.setVolume(level);
                emit({ volume: level, muted: level === 0 });
              },
              mute: () => {
                ytPlayer.mute();
                emit({ muted: true });
              },
              unmute: () => {
                ytPlayer.unMute();
                emit({ muted: false });
              },
              toggleMute: () =>
                state.muted ? controller.unmute() : controller.mute(),
              requestFullscreen: () => {
                // Fullscreen targets the outer container (iframe + custom
                // controls overlay), not the iframe itself, so our glass UI
                // stays on top in fullscreen. Handled by the orchestrator's
                // ref — the adapter only reports intent via state.
                emit({ isFullscreen: true });
              },
              exitFullscreen: () => emit({ isFullscreen: false }),
              toggleFullscreen: () =>
                state.isFullscreen
                  ? controller.exitFullscreen()
                  : controller.requestFullscreen(),
              getState: () => state,
              destroy: () => {
                stopPolling();
                ytPlayer.destroy();
              },
            };

            resolve(controller);
          };

          const handleStateChange = (event: YTPlayerEvent) => {
            switch (event.data) {
              case YTPlayerState.PLAYING:
                try {
                  ytPlayer.unloadModule?.("captions");
                  ytPlayer.unloadModule?.("cc");
                } catch {
                  // Ignore if caption module is not present
                }
                emit({ status: "playing" });
                break;
              case YTPlayerState.PAUSED:
                emit({ status: "paused" });
                break;
              case YTPlayerState.BUFFERING:
                emit({ status: "buffering" });
                break;
              case YTPlayerState.ENDED:
                emit({ status: "ended" });
                break;
              default:
                break;
            }
          };

          const handleError = (event: YTPlayerEvent) => {
            const error = normalizeYouTubeError(event.data ?? -1);
            emit({ status: "error", error });
            reject(error);
          };

          new YT.Player(container, {
            videoId: source.id,
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: autoPlay ? 1 : 0,
              cc_load_policy: 0, // keep captions/subtitles disabled by default
              controls: 0, // our glass UI replaces YouTube's chrome entirely
              disablekb: 1, // we own keyboard handling on our own controls
              fs: 0, // we own fullscreen via the container, not YouTube's button
              iv_load_policy: 3, // hide video annotations
              loop: loop ? 1 : 0,
              modestbranding: 1,
              playsinline: 1,
              rel: 0, // no related videos from other channels at the end
              start: startTime || undefined,
              mute: muted ? 1 : 0,
              origin: window.location.origin,
            },
            events: {
              onReady: handleReady,
              onStateChange: handleStateChange,
              onError: handleError,
            },
          });
        })
    );
  },
};
