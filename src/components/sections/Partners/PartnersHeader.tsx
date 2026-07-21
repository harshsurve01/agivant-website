import styles from "./PartnersHeader.module.css";

interface PartnersHeaderProps {
  heading: {
    line1: string;
    line2: string;
  };
  description: string;
}

/**
 * PartnersHeader
 *
 * Owns the section's heading block: two lines ("Agivant Is Trusted
 * By" / "Global Partners"), with the entire second line accent-
 * colored. Unlike EnvironmentHeader — where only one word inside a
 * line is highlighted, requiring a {line1, highlight, line2} shape —
 * Figma highlights the whole second line here, so two plain strings
 * are enough.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function PartnersHeader({ heading, description }: PartnersHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.heading}>
        <span className={styles.headingLine}>{heading.line1}</span>
        <span className={`${styles.headingLine} ${styles.highlight}`}>{heading.line2}</span>
      </h2>

      <p className={styles.description}>{description}</p>
    </div>
  );
}
