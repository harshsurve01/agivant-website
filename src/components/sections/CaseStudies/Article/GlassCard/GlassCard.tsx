import clsx from "clsx";
import type { GlassCardProps } from "./types";
import styles from "./GlassCard.module.css";

/**
 * GlassCard
 *
 * Reusable presentational glass card for Case Study detail pages.
 * Displays:
 * - Rounded frosted-glass surface with 24px backdrop blur and subtle inset shadow
 * - Squircle gradient target icon badge (or custom icon)
 * - Agivant purple card title
 * - Regular text body / description
 *
 * Presentational Server Component.
 */
export function GlassCard({
  title,
  description,
  icon,
  className,
}: GlassCardProps) {
  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.iconBadge} aria-hidden="true">
        {icon ? (
          icon
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="8"
              cy="8"
              r="6"
              stroke="var(--color-brand-primary)"
              strokeWidth="1.5"
            />
            <circle cx="8" cy="8" r="2.5" fill="var(--color-brand-primary)" />
          </svg>
        )}
      </div>

      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  );
}
