import styles from "./TrustProgress.module.css";

interface TrustProgressProps {
  total: number;
  activeIndex?: number;
}

/**
 * TrustProgress
 *
 * Static dots indicating position within the Trust stack. Purely
 * decorative today — it duplicates information already conveyed by the
 * visible card, so it's marked aria-hidden rather than exposed as an
 * interactive tablist. `activeIndex` is a prop (not hardcoded) so a
 * future GSAP-driven Trust can pass the current stack position without
 * any change to this component.
 */
export function TrustProgress({ total, activeIndex = 0 }: TrustProgressProps) {
  return (
    <div className={styles.progress} aria-hidden="true">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={index === activeIndex ? `${styles.dot} ${styles.dotActive}` : styles.dot}
        />
      ))}
    </div>
  );
}