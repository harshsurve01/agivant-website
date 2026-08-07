import type { YTNamespace } from "./youtube.types";

/**
 * loadYouTubeApi
 *
 * Injects https://www.youtube.com/iframe_api at most once per page,
 * regardless of how many VideoPlayer instances mount. All callers await
 * the same cached promise, so a grid of videos never races on
 * window.onYouTubeIframeAPIReady or double-injects the script tag.
 */

let youtubeApiPromise: Promise<YTNamespace> | null = null;

export function loadYouTubeApi(): Promise<YTNamespace> {
  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise<YTNamespace>((resolve, reject) => {
    // Already available (e.g. hot reload, or another consumer loaded it).
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      if (window.YT) {
        resolve(window.YT);
      } else {
        reject(new Error("YouTube API script loaded but window.YT is missing."));
      }
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    );

    if (existingScript) {
      // Script tag already present (e.g. injected before this module ran);
      // just wait on the callback above.
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      youtubeApiPromise = null; // allow a retry on next mount
      reject(new Error("Failed to load the YouTube IFrame API script."));
    };

    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}
