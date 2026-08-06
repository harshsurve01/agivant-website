import styles from "./LifecycleHeader.module.css";

interface LifecycleHeaderProps {
  eyebrow: string;
  title: {
    highlight: string;
    suffix: string;
  };
  description: string;
}

/**
 * LifecycleHeader
 *
 * Owns the section's heading block: the struck-through "Traditional
 * SDLC" line, the two-tone "AI-Native Engineering Lifecycle" heading,
 * and the supporting description. Three distinct fields (see
 * data/lifecycle.ts), not one string — each needs different styling
 * that a merged string couldn't carry.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function LifecycleHeader({ eyebrow, title, description }: LifecycleHeaderProps) {
  return (
    <div className={styles.header}>
      <p className={styles.eyebrow}>{eyebrow}</p>

      <h2 className={styles.heading}>
        <span className={styles.highlight}>{title.highlight}</span>{" "}
        {title.suffix}
      </h2>

      <p className={styles.description}>{description}</p>
    </div>
  );
}
