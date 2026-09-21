import clsx from "clsx";
import styles from "./StatsCard.module.css";

export interface StatsCardProps {
  /** Metric stat value (e.g. "500+", "30M+", "Every 5 days") */
  value: string;
  /** Metric descriptive label (e.g. "AI agents in production") */
  label: string;
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
 * - Optional lavender tint variant matching Figma card 6
 */
export function StatsCard({
  value,
  label,
  isTinted = false,
  className,
}: StatsCardProps) {
  return (
    <article
      className={clsx(styles.card, isTinted && styles.tinted, className)}
    >
      <div className={styles.value}>{value}</div>
      <p className={styles.label}>{label}</p>
    </article>
  );
}
