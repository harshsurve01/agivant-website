import clsx from "clsx";
import styles from "./StatsCard.module.css";

export interface StatsCardProps {
  /** Metric stat value (e.g. "500+", "30M+", "Every 5 days") */
  value: string;
  /** Metric descriptive label (e.g. "AI agents in production") */
  label?: string;
  /** Optional eyebrow text (e.g. "Latency", "Real-Time") */
  eyebrow?: string | null;
  /** Optional description alias for label */
  description?: string | null;
  /** Whether to apply the lavender/purple-tinted background (used on Card 6) */
  isTinted?: boolean;
  /** Optional class name override */
  className?: string;
}

/**
 * StatsCard
 *
 * Presentation-only statistics card component.
 * Features:
 * - Equal height and width distribution
 * - Centered vertical rhythm with 36px/32px SemiBold stat and 16px/25px description
 * - Optional eyebrow tag and 3-tier layout
 * - Optional lavender tint variant matching Figma card 6
 */
export function StatsCard({
  value,
  label,
  eyebrow,
  description,
  isTinted = false,
  className,
}: StatsCardProps) {
  const displayLabel = description ?? label;
  return (
    <article
      className={clsx(styles.card, isTinted && styles.tinted, className)}
    >
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <div className={clsx(styles.value, eyebrow && styles.valueWithEyebrow)}>
        {value}
      </div>
      {displayLabel && (
        <p
          className={clsx(
            styles.label,
            eyebrow && styles.descriptionWithEyebrow
          )}
        >
          {displayLabel}
        </p>
      )}
    </article>
  );
}
