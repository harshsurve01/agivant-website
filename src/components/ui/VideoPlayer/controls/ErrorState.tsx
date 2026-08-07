import type { PlayerError } from "../VideoPlayer.types";
import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  error: PlayerError;
}

/**
 * ErrorState
 *
 * Renders only from `error.message` — the pre-normalized, safe-to-display
 * string every provider adapter is required to produce. Never touches
 * `error.raw`.
 */
export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className={styles.wrapper} role="alert">
      <p className={styles.message}>{error.message}</p>
    </div>
  );
}
