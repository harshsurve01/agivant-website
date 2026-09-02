import type { PreloaderData } from "@/data/preloader";

export interface PreloaderProps {
  /** Optional preloader data configuration override (defaults to defaultPreloaderData). */
  data?: PreloaderData;
  /** Optional callback fired when the preloader exit animation completes. */
  onComplete?: () => void;
}
