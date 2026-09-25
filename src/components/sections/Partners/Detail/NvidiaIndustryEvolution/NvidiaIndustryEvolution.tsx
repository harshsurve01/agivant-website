import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { AnimatedChevrons } from "@/components/ui/AnimatedChevrons";
import type { NvidiaIndustryEvolutionProps } from "./types";
import styles from "./NvidiaIndustryEvolution.module.css";

/**
 * Presentational helper to split "Industry Evolution" into purple + dark text.
 */
function renderHeading(heading: string) {
  const match = "Industry";
  if (heading.startsWith(match)) {
    return (
      <>
        <span className={styles.purpleText}>{match}</span>
        <span className={styles.darkText}>{heading.slice(match.length)}</span>
      </>
    );
  }
  return <span className={styles.darkText}>{heading}</span>;
}

/**
 * Close / Cross Icon for Legacy Enterprise Approach
 */
function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.iconSvg}
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/**
 * Checkmark Icon for Modern Enterprise Approach
 */
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.iconSvg}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * NvidiaIndustryEvolution
 *
 * NVIDIA Partner Detail Page - "Industry Evolution" section.
 * Features:
 * - Two-tone heading: "Industry" (purple) + "Evolution" (black)
 * - Single description copy
 * - Large glass comparison card:
 *   - Left: Legacy Enterprise Approach with purple strikethrough labels
 *   - Center: Animated transition chevrons reusing Homepage AmpTransformation pattern
 *   - Right: Modern Approach with purple bold labels
 *   - Bottom: Decorative liquid ribbon clipped cleanly by card's rounded borders
 * - Strict rem-based typography and variables.css design tokens
 */
export function NvidiaIndustryEvolution({
  data,
  className,
}: NvidiaIndustryEvolutionProps) {
  if (!data?.legacy || !data?.modern) return null;

  const ribbonSrc = data.ribbon?.src ?? "/images/partners/nvidia/evolution-card-ribbon.png";
  const ribbonWidth = data.ribbon?.width ?? 4692;
  const ribbonHeight = data.ribbon?.height ?? 920;

  return (
    <section className={clsx(styles.section, className)} id="industry-evolution">
      <Container size="xl" className={styles.container}>
        <h2 className={styles.heading}>{renderHeading(data.heading)}</h2>
        {data.description && (
          <p className={styles.description}>{data.description}</p>
        )}

        <div className={styles.comparisonCard}>
          {/* Decorative bottom ribbon asset */}
          <Image
            src={ribbonSrc}
            alt={data.ribbon?.alt ?? ""}
            width={ribbonWidth}
            height={ribbonHeight}
            className={styles.ribbonImage}
            aria-hidden="true"
          />

          {/* Content Comparison Grid */}
          <div className={styles.cardContent}>
            {/* Left Column: Legacy Enterprise Approach */}
            <div className={clsx(styles.column, styles.legacyColumn)}>
              <div className={styles.columnHeader}>
                <div className={styles.iconBadge} aria-hidden="true">
                  <CloseIcon />
                </div>
                <h3 className={styles.columnTitle}>{data.legacy.title}</h3>
              </div>

              <ul className={styles.bulletList}>
                {data.legacy.items.map((item, idx) => (
                  <li key={idx} className={styles.bulletItem}>
                    <span className={styles.bulletDot} aria-hidden="true">•</span>
                    <span className={styles.legacyLabel}>{item.label}</span>
                    <p className={styles.legacyDescription}>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Center: Animated Transition Chevrons */}
            <div className={styles.centerChevrons}>
              <AnimatedChevrons />
            </div>

            {/* Right Column: Modern Approach */}
            <div className={clsx(styles.column, styles.modernColumn)}>
              <div className={styles.columnHeader}>
                <div className={styles.iconBadge} aria-hidden="true">
                  <CheckIcon />
                </div>
                <h3 className={styles.columnTitle}>{data.modern.title}</h3>
              </div>

              <ul className={styles.bulletList}>
                {data.modern.items.map((item, idx) => (
                  <li key={idx} className={styles.bulletItem}>
                    <span className={styles.bulletDot} aria-hidden="true">•</span>
                    <span className={styles.modernLabel}>{item.label}</span>
                    <p className={styles.modernDescription}>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
