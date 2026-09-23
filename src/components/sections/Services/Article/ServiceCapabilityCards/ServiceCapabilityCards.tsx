import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Gradient } from "@/components/effects/Gradient";
import { ServiceCapabilityCardItem } from "./ServiceCapabilityCardItem";
import type { ServiceCapabilityCardsProps } from "./types";
import styles from "./ServiceCapabilityCards.module.css";

const HIGHLIGHT_PHRASE = "Engineered for domain,";

/**
 * ServiceCapabilityCards
 *
 * Dedicated Service Inner Page section:
 * "Engineered for domain, tuned for impact"
 *
 * Features:
 * - Centered two-tone heading: "Engineered for domain," (brand purple) + " tuned for impact" (black)
 * - 2-column grid of fixed-size cards (574px × 502px = 35.875rem × 31.375rem)
 * - Content-aware dynamic image shrink: when glass area expands, image shrinks to accommodate text
 * - Total card dimensions remain fixed between collapsed and expanded states
 * - Ambient page gradients
 *
 * Server Component: renders client card items as interactive leaves.
 */
export function ServiceCapabilityCards({
  heading,
  cards,
  className,
}: ServiceCapabilityCardsProps) {
  const renderHeading = (text?: string) => {
    if (!text) return null;
    const cleanText = text.replace(/<br\s*\/?>/gi, " ");
    if (cleanText.includes(HIGHLIGHT_PHRASE)) {
      const parts = cleanText.split(HIGHLIGHT_PHRASE);
      return (
        <>
          <span className={styles.headingHighlight}>{HIGHLIGHT_PHRASE}</span>
          {parts.slice(1).join(HIGHLIGHT_PHRASE)}
        </>
      );
    }
    return cleanText;
  };

  return (
    <section className={clsx(styles.section, className)}>
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

      <Container size="xl">
        {heading && (
          <header className={styles.header}>
            <h2 className={styles.heading}>{renderHeading(heading)}</h2>
          </header>
        )}

        <div className={styles.grid}>
          {cards.map((card) => (
            <ServiceCapabilityCardItem key={card.id} card={card} />
          ))}
        </div>
      </Container>
    </section>
  );
}
