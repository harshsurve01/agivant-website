import styles from "./TrustProgress.module.css";

interface TrustProgressProps {
  total: number;
  activeIndex?: number;
}

/**
 * TrustProgress
 *
 * Static dots indicating position within the Trust stack. Purely
 * decorative — it duplicates information already conveyed by the
 * visible card, so it's marked aria-hidden rather than exposed as an
 * interactive tablist. `activeIndex` is still the source of truth for
 * the pre-hydration / prefers-reduced-motion state (rendered via the
 * existing dotActive class); once mounted, TrustAnimation drives the
 * fill/pulse itself via the data-progress-dot / data-progress-index
 * hooks below, without this component re-rendering.
 */
export function TrustProgress({ total, activeIndex = 0 }: TrustProgressProps) {
  return (
    <div className={styles.progress} aria-hidden="true" data-trust-progress>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          data-progress-dot
          data-progress-index={index}
          className={index === activeIndex ? `${styles.dot} ${styles.dotActive}` : styles.dot}
        />
      ))}
    </div>
  );
}