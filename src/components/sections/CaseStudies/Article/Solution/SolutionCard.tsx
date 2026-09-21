import Image from "next/image";
import clsx from "clsx";
import styles from "./Solution.module.css";

export interface SolutionCardProps {
  title?: string;
  text: string;
  ribbon?: string;
  className?: string;
  variant?: "default" | "compact";
  as?: "li" | "div";
}

/**
 * SolutionCard
 *
 * Reusable solution workflow card design originally established for Case Study inner pages.
 * Features:
 * - Rounded frosted-glass surface with subtle inner glow
 * - Upper clipped ribbon artwork
 * - Solution narrative text (with optional title heading)
 * - Decorative dotted purple arrow divider
 *
 * Supports `variant="compact"` for horizontal 4-column layouts (Shopify and Databricks Partner pages)
 * while preserving `variant="default"` for 100% pixel-identical Case Study rendering.
 */
export function SolutionCard({
  title,
  text,
  ribbon,
  className,
  variant = "default",
  as: Component = "li",
}: SolutionCardProps) {
  return (
    <Component
      className={clsx(
        styles.card,
        variant === "compact" && styles.cardCompact,
        className
      )}
    >
      {ribbon ? (
        <div
          className={clsx(
            styles.ribbonWrapper,
            variant === "compact" && styles.ribbonWrapperCompact
          )}
        >
          <Image
            src={ribbon}
            alt=""
            width={401}
            height={345}
            className={styles.ribbonImage}
          />
        </div>
      ) : null}

      <div
        className={clsx(
          styles.content,
          variant === "compact" && styles.contentCompact
        )}
      >
        <div className={styles.bodyWrapper}>
          {title && (
            <h3
              className={clsx(
                styles.cardTitle,
                variant === "compact" && styles.cardTitleCompact
              )}
            >
              {title}
            </h3>
          )}
          <p
            className={clsx(
              styles.text,
              variant === "compact" && styles.textCompact
            )}
          >
            {text}
          </p>
        </div>
        <span
          className={clsx(
            styles.line,
            variant === "compact" && styles.lineCompact
          )}
          aria-hidden="true"
        />
      </div>
    </Component>
  );
}
