import styles from "./EnvironmentHeader.module.css";

interface EnvironmentHeaderProps {
  heading: {
    line1: string;
    highlight: string;
    line2: string;
  };
  description: string;
}

/**
 * EnvironmentHeader
 *
 * Owns the section's heading block: two explicit lines ("What's
 * Inside The Amp'd" / "Build Environment?", with only "Amp'd"
 * accent-colored) plus the supporting description. Three distinct
 * fields (see data/environment.ts), not one string — same reasoning
 * as AIStackHeader's heading object, just with the highlight on line 1
 * instead of line 2 here, matching where it actually falls in the
 * supplied screenshot.
 *
 * Lines are explicit <span> blocks rather than relying on text wrap,
 * same precedent as AIStackHeader.module.css's .headingLine —
 * deterministic breaks regardless of container width.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function EnvironmentHeader({ heading, description }: EnvironmentHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.heading}>
        <span className={styles.headingLine}>
          {heading.line1} <span className={styles.highlight}>{heading.highlight}</span>
        </span>
        <span className={styles.headingLine}>{heading.line2}</span>
      </h2>

      <p className={styles.description}>{description}</p>
    </div>
  );
}
