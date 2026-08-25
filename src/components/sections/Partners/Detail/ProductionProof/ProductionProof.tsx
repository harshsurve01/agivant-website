import { Container } from "@/components/ui/Container";
import type { PartnerProductionProofData } from "@/types/partnerDetail";
import { ProductionProofCard } from "./ProductionProofCard";
import styles from "./ProductionProof.module.css";

export interface ProductionProofProps {
  data?: PartnerProductionProofData;
}

/**
 * ProductionProof
 *
 * "Proof from production." section on the Gemini Enterprise Partner Detail page.
 * Sits after Section 04 Solutions & Accelerator Proof.
 *
 * Features:
 * - Left editorial column with purple highlight heading and description
 * - Right asymmetric 2-column case-study grid (2 stacked ~400x321 cards on left, 1 tall ~400x648 card on right)
 * - Zero hover enlargement or track resizing
 * - Data-driven and responsive
 */
export function ProductionProof({ data }: ProductionProofProps) {
  if (!data || !data.cards?.length) return null;

  const [card1, card2, card3] = data.cards;

  return (
    <section className={styles.section} id="proof-from-production">
      <Container size="xl" className={styles.container}>
        <div className={styles.layout}>
          {/* Left Editorial Column */}
          <div className={styles.editorial}>
            <h2 className={styles.heading}>
              <span className={styles.purpleText}>{data.heading.highlight}</span>{" "}
              <span className={styles.darkText}>{data.heading.rest}</span>
            </h2>
            <p className={styles.description}>{data.description}</p>
          </div>

          {/* Right Asymmetric Cards Grid */}
          <div className={styles.grid}>
            {/* Left Column: Card 1 and Card 2 stacked */}
            <div className={styles.leftCol}>
              {card1 && <ProductionProofCard card={card1} isTall={false} />}
              {card2 && <ProductionProofCard card={card2} isTall={false} />}
            </div>

            {/* Right Column: Card 3 tall */}
            <div className={styles.rightCol}>
              {card3 && <ProductionProofCard card={card3} isTall={true} />}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
