export { VideoPlayer } from "./VideoPlayer";
export type {
  VideoPlayerProps,
  VideoSource,
  PlayerState,
  PlayerStatus,
  PlayerError,
  PlayerErrorCode,
} from "./VideoPlayer.types";

// Deliberately NOT exported: PlayerController, ProviderAdapter,
// ProviderAdapterOptions. These are the internal engine/UI boundary and
// provider contract — consumers like EpisodePlayer only ever need the
// props above.
