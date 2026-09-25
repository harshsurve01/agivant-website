import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Gradient } from "@/components/effects/Gradient";
import { ServiceCapabilityCardItem } from "./ServiceCapabilityCardItem";
import type { ServiceCapabilityCardsProps } from "./types";
import styles from "./ServiceCapabilityCards.module.css";

const HIGHLIGHT_PHRASES = [
  "Engineered for domain,",
  "Where autonomy",
];

/**
 * ServiceCapabilityCards
 *
 * Dedicated Service Inner Page section:
 * "Engineered for domain, tuned for impact" / "Where autonomy meets accountability"
 *
 * Features:
 * - Centered two-tone heading
 * - 2-column grid of fixed-size cards (574px × 502px = 35.875rem × 31.375rem)
 * - Content-aware dynamic image shrink: when glass area expands, image shrinks to accommodate text
 * - Total card dimensions remain fixed between collapsed and expanded states
 * - Ambient page gradients
 *
 * Server Component: renders client card items as interactive leaves.
 */
export function ServiceCapabilityCards({
  id,
  heading,
  description,
  align = "center",
  highlightPhrase,
  cards,
  className,
  ribbon,
  variant = "default",
  nvidiaTypography = false,
}: ServiceCapabilityCardsProps) {
  const renderHeading = (text?: string) => {
    if (!text) return null;
    const cleanText = text.replace(/<br\s*\/?>/gi, " ");

    const phrases = highlightPhrase
      ? [highlightPhrase, ...HIGHLIGHT_PHRASES]
      : HIGHLIGHT_PHRASES;

    for (const phrase of phrases) {
      if (cleanText.includes(phrase)) {
        const parts = cleanText.split(phrase);
        return (
          <>
            <span className={styles.headingHighlight}>{phrase}</span>
            {parts.slice(1).join(phrase)}
          </>
        );
      }
    }

    return cleanText;
  };

  return (
    <section
      id={id}
      className={clsx(
        styles.section,
        ribbon && styles.hasRibbon,
        variant === "nvidia" && styles.nvidiaVariant,
        nvidiaTypography && styles.nvidiaTypography,
        className
      )}
    >
      {/* ── Background Ribbon (when provided) ── */}
      {ribbon && (
        <div className={styles.ribbonWrapper} aria-hidden="true">
          <Image
            src={ribbon.src}
            alt={ribbon.alt || ""}
            width={ribbon.width || 1440}
            height={ribbon.height || 1834}
            className={styles.ribbonImage}
            priority={false}
          />
        </div>
      )}

      {/* ── Ambient Glows ── */}
      <Gradient
        top="5%"
        left="-8%"
        size="42rem"
        stops={["#8500df18 0%", "transparent 70%"]}
        opacity={0.4}
        blur="4.375rem"
      />
      <Gradient
        top="45%"
        right="-8%"
        size="40rem"
        stops={["#edbf7920 0%", "transparent 70%"]}
        opacity={0.35}
        blur="4.6875rem"
      />

      <Container size="xl" className={styles.container}>
        {heading && (
          <header
            className={clsx(
              styles.header,
              align === "left" && styles.headerLeft
            )}
          >
            <h2 className={styles.heading}>{renderHeading(heading)}</h2>
            {description && (
              <p className={styles.description}>{description}</p>
            )}
          </header>
        )}

        <div className={clsx(styles.grid, variant === "nvidia" && styles.gridNvidia)}>
          {cards.map((card) => (
            <ServiceCapabilityCardItem
              key={card.id}
              card={card}
              variant={variant}
              nvidiaTypography={nvidiaTypography}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
