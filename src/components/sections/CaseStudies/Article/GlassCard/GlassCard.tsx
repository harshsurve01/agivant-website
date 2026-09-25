import Image from "next/image";
import clsx from "clsx";
import type { GlassCardProps } from "./types";
import styles from "./GlassCard.module.css";

/**
 * GlassCard
 *
 * Reusable presentational glass card for Case Study detail pages and Partner sections.
 * Displays:
 * - Rounded frosted-glass surface with 24px backdrop blur and subtle inset shadow
 * - Squircle gradient target icon badge (or custom icon)
 * - Standard variant: purple card title + description
 * - Benefit variant (NVIDIA Key Benefits):
 *   - Header row with squircle icon badge and label side-by-side
 *   - Bold purple highlighted stat/value
 *   - Dark description text
 *   - Full-width bottom artwork clipped by card rounded corners
 *
 * Presentational Server Component.
 */
export function GlassCard({
  title,
  description,
  icon,
  className,
  variant = "default",
  label,
  value,
  image,
}: GlassCardProps) {
  const isBenefit = variant === "benefit";

  return (
    <div
      className={clsx(
        styles.card,
        isBenefit && styles.benefitCard,
        className
      )}
    >
      <div className={clsx(isBenefit && styles.benefitContent)}>
        {/* Header row: for benefit variant, badge + label in horizontal row */}
        {isBenefit ? (
          <div className={styles.benefitHeaderRow}>
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
            {(label || title) && (
              <span className={styles.benefitLabel}>{label || title}</span>
            )}
          </div>
        ) : (
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
        )}

        {/* Value: bold purple highlight for benefit variant */}
        {isBenefit && value && (
          <div className={styles.benefitValue}>{value}</div>
        )}

        {/* Title: for default variant */}
        {!isBenefit && title ? (
          <h3 className={styles.cardTitle}>{title}</h3>
        ) : null}

        {/* Description: black text */}
        {description && (
          <p
            className={clsx(
              styles.cardDescription,
              isBenefit && styles.benefitDescription
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* Full-width artwork at bottom of card */}
      {isBenefit && image && (
        <div className={styles.benefitImageWrapper} aria-hidden="true">
          <Image
            src={image.src}
            alt={image.alt || ""}
            width={image.width ?? 400}
            height={image.height ?? 225}
            className={styles.benefitImage}
          />
        </div>
      )}
    </div>
  );
}
