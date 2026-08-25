import { Container } from "@/components/ui/Container";
import type { PartnerBuiltOnGeminiData } from "@/types/partnerDetail";
import { BuiltOnGeminiCard } from "./BuiltOnGeminiCard";
import styles from "./BuiltOnGemini.module.css";

export interface BuiltOnGeminiProps {
  data?: PartnerBuiltOnGeminiData;
}

/**
 * BuiltOnGemini
 *
 * "Built on Gemini Enterprise." section on the Gemini Enterprise Partner Detail page.
 * Sits after the "Proof from production." section.
 *
 * Features:
 * - Centered section heading: "Built on" (purple), "Gemini Enterprise." (black)
 * - Centered description subtitle
 * - 3 accelerator cards in one row on desktop (~400px width each)
 * - Translucent glass treatment with inset shadow
 * - Arrow badge rotation to ↙ on hover (zero card enlargement or layout shift)
 * - Semantic, typed data layer integration
 */
export function BuiltOnGemini({ data }: BuiltOnGeminiProps) {
  if (!data || !data.cards?.length) return null;

  return (
    <section className={styles.section} id="built-on-gemini">
      <Container size="xl" className={styles.container}>
        {/* Centered Section Header */}
        <div className={styles.headerWrapper}>
          <h2 className={styles.heading}>
            <span className={styles.purpleText}>{data.heading.highlight}</span>{" "}
            <span className={styles.darkText}>{data.heading.rest}</span>
          </h2>
          {data.description && (
            <p className={styles.subtitle}>{data.description}</p>
          )}
        </div>

        {/* 3 Accelerator Cards Grid */}
        <div className={styles.cardsGrid}>
          {data.cards.map((card) => (
            <BuiltOnGeminiCard key={card.id} card={card} />
          ))}
        </div>
      </Container>
    </section>
  );
}
