/**
 * Preloader Data Configuration
 *
 * This file serves as the single source of truth for the Preloader content and settings.
 *
 * ARCHITECTURE NOTE FOR BACKEND/WORDPRESS INTEGRATION:
 * The presentation component (`Preloader.tsx`) consumes this data configuration.
 * When the WordPress/backend API is connected in a future release, this file (or its fetcher)
 * will supply the dynamic Lottie JSON URL from the CMS without requiring any changes or
 * refactoring of the Preloader UI component.
 */

export interface PreloaderData {
  /** Whether the global preloader is active. */
  enabled: boolean;
  /**
   * The Lottie JSON asset URL.
   * Currently set to the client's development Lottie.host JSON URL.
   */
  animationUrl: string;
  /** Speed multiplier for playback. Defaults to 1. */
  speed?: number;
  /** Whether the animation loops. Defaults to false (plays once). */
  loop?: boolean;
  /** Whether playback starts automatically. Defaults to true. */
  autoplay?: boolean;
  /** Safety timeout in milliseconds to guarantee page accessibility. Defaults to 4000ms. */
  timeoutMs?: number;
}

export const defaultPreloaderData: PreloaderData = {
  enabled: true,
  animationUrl: "/animations/preloader.json",
  speed: 1,
  loop: false,
  autoplay: true,
  timeoutMs: 4000,
};
