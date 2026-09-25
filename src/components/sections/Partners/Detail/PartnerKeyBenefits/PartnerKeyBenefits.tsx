import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/sections/CaseStudies/Article/GlassCard";
import type { NvidiaKeyBenefitsData } from "@/types/partnerDetail";
import styles from "./PartnerKeyBenefits.module.css";

export interface PartnerKeyBenefitsProps {
  data: NvidiaKeyBenefitsData;
  className?: string;
}

/**
 * Presentational helper to format "Key" in brand purple and "Benefits" in dark/black.
 */
function renderHeading(heading: string) {
  const match = "Key";
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
 * PartnerKeyBenefits
 *
 * Section 2 of the NVIDIA Partner Detail Page (/partners/nvidia).
 * Displays:
 * - Intro paragraph positioned above heading (matching Figma)
 * - Two-tone section heading: "Key" (purple) + "Benefits" (black)
 * - 5 glass benefit cards in a single horizontal row on desktop
 * - Each card uses the shared GlassCard architecture with variant="benefit":
 *   - Header row with squircle gradient target icon badge + label
 *   - Bold purple highlighted value
 *   - Dark description
 *   - Full-width bottom artwork clipped by card's rounded border
 *
 * Server Component: pure presentation, no client state.
 */
export function PartnerKeyBenefits({
  data,
  className,
}: PartnerKeyBenefitsProps) {
  if (!data?.cards?.length) return null;

  return (
    <section className={clsx(styles.section, className)} id="key-benefits">
      <Container size="xl" className={styles.container}>
        {data.description && <p className={styles.intro}>{data.description}</p>}

        <h2 className={styles.heading}>{renderHeading(data.heading)}</h2>

        <div className={styles.cardsGrid}>
          {data.cards.map((card) => (
            <GlassCard
              key={card.id}
              variant="benefit"
              label={card.label}
              value={card.value}
              description={card.description}
              image={card.image}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
