"use client";

import styles from "./NumberedIndicator.module.css";

export interface NumberedIndicatorProps {
  totalStages: number;
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

/**
 * NumberedIndicator
 *
 * Horizontal numbered pagination track (1 --- 2 --- ③ --- 4 --- 5)
 * positioned below the Lifecycle cards in "How Agivant Works With You".
 *
 * - Active number is enlarged (38px), styled in vibrant Agivant purple with white text.
 * - Inactive numbers are 28px in neutral gray.
 * - Connected by a 2px horizontal line spanning from circle 1 to circle 5.
 * - Interactive: Clicking any number activates the corresponding card.
 */
export function NumberedIndicator({
  totalStages,
  activeIndex,
  onSelectIndex,
}: NumberedIndicatorProps) {
  return (
    <nav
      className={styles.track}
      aria-label="How Agivant Works With You pagination"
    >
      <div className={styles.line} aria-hidden="true" />

      {Array.from({ length: totalStages }).map((_, index) => {
        const isActive = index === activeIndex;
        const stageNumber = index + 1;

        return (
          <div key={index} className={styles.slot}>
            <button
              type="button"
              className={`${styles.button} ${
                isActive ? styles.buttonActive : styles.buttonInactive
              }`}
              onClick={() => onSelectIndex(index)}
              aria-label={`Go to stage ${stageNumber}`}
              aria-current={isActive ? "step" : undefined}
            >
              {stageNumber}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
