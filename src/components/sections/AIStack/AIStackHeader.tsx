import styles from "./AIStackHeader.module.css";

interface AIStackHeaderProps {
  heading: {
    line1: string;
    line2Prefix: string;
    highlight: string;
  };
  description: string;
}

/**
 * AIStackHeader
 *
 * Owns the section's heading block: two explicit lines ("Engineering
 * Every Layer" / "Of Your AI Stack", with only "AI Stack" accent-
 * colored) plus the supporting description. Three distinct fields
 * (see data/ai-stack.ts), not one string — matches the same reasoning
 * as Hero's and Lifecycle's title objects: each piece needs different
 * styling a merged string couldn't carry.
 *
 * Lines are explicit <span> blocks rather than relying on text wrap,
 * same precedent as Hero.module.css's .headingLine — deterministic
 * breaks regardless of container width.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function AIStackHeader({ heading, description }: AIStackHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.heading}>
        <span className={styles.headingLine}>{heading.line1}</span>
        <span className={styles.headingLine}>
          {heading.line2Prefix} <span className={styles.highlight}>{heading.highlight}</span>
        </span>
      </h2>

      <p className={styles.description}>{description}</p>
    </div>
  );
}
