import styles from "./LifecycleIndicator.module.css";

interface LifecycleIndicatorProps {
  totalStages: number;
  activeIndex?: number | null;
}

/**
 * LifecycleIndicator
 *
 * Horizontal 5-dot indicator track positioned below the Lifecycle cards.
 * - Dot matching `activeIndex` is styled in Agivant brand purple.
 * - Inactive dots are styled in neutral gray.
 * - Connecting line spans from the first dot to the last dot.
 */
export function LifecycleIndicator({
  totalStages,
  activeIndex = null,
}: LifecycleIndicatorProps) {
  return (
    <div className={styles.track} role="tablist" aria-label="Lifecycle stages">
      <div className={styles.line} aria-hidden="true" />

      {Array.from({ length: totalStages }).map((_, index) => {
        const isActive = activeIndex !== null && index === activeIndex;
        return (
          <div key={index} className={styles.slot}>
            <span
              className={`${styles.dot} ${isActive ? styles.dotActive : styles.dotInactive}`}
              data-active={isActive}
              aria-label={`Stage ${index + 1}`}
            />
          </div>
        );
      })}
    </div>
  );
}
