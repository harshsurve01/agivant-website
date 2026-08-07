import type { PlayerError, PlayerErrorCode } from "../../VideoPlayer.types";

/**
 * Maps YouTube's onError event codes to our closed PlayerErrorCode
 * vocabulary. See:
 * https://developers.google.com/youtube/iframe_api_reference#onError
 *
 * 2   – invalid video id
 * 5   – HTML5 player error
 * 100 – video not found / removed / private
 * 101 / 150 – embedding disabled by video owner
 */
export function normalizeYouTubeError(code: number): PlayerError {
  const mapped: Record<number, { code: PlayerErrorCode; message: string }> = {
    2: { code: "NOT_FOUND", message: "This video is unavailable." },
    5: { code: "PLAYBACK_ERROR", message: "This video couldn't be played." },
    100: { code: "NOT_FOUND", message: "This video is unavailable." },
    101: {
      code: "EMBED_DISABLED",
      message: "This video isn't available to play here.",
    },
    150: {
      code: "EMBED_DISABLED",
      message: "This video isn't available to play here.",
    },
  };

  const match = mapped[code];

  return {
    code: match?.code ?? "UNKNOWN",
    message: match?.message ?? "Something went wrong playing this video.",
    raw: code,
  };
}
