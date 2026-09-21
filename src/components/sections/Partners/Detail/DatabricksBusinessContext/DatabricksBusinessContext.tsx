import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/sections/CaseStudies/Article/GlassCard";
import type { DatabricksBusinessContextData } from "@/types/partnerDetail";
import styles from "./DatabricksBusinessContext.module.css";

export interface DatabricksBusinessContextProps {
  data: DatabricksBusinessContextData;
}

/**
 * Presentational helper to highlight the purple accent in the section heading
 * while keeping the heading data as one conceptual field in JSON.
 */
function renderHeading(heading: string) {
  const target = "Give every agent";
  if (heading.startsWith(target)) {
    return (
      <>
        <span className={styles.headingHighlight}>{target}</span>
        {heading.slice(target.length)}
      </>
    );
  }
  return heading;
}

/**
 * DatabricksBusinessContext
 *
 * Section 4 of the Databricks Partner Single Page (/partners/databricks).
 * Renders the "Business Context" 4-card grid:
 * - Section heading ("Give every agent" in purple, "the business context to answer with confidence." in black)
 * - Intro / supporting paragraph
 * - 4-card single-row grid reusing the Case Study "Where It Started" GlassCard & squircle concentric-circle badge
 * - Closing paragraph below the cards
 *
 * Reuses the existing GlassCard component directly with zero duplication.
 * Consumes design tokens exclusively from variables.css.
 * Server Component: pure presentation, no client overhead.
 */
export function DatabricksBusinessContext({
  data,
}: DatabricksBusinessContextProps) {
  if (!data) return null;

  return (
    <section className={styles.section} id="business-context">
      <Container size="xl" className={styles.container}>
        <h2 className={styles.heading}>{renderHeading(data.heading)}</h2>
        {data.description && (
          <p className={styles.description}>{data.description}</p>
        )}

        <div className={styles.cardsGrid}>
          {data.cards.map((card) => (
            <GlassCard
              key={card.id}
              title={card.title}
              description={card.description}
              className={styles.card}
            />
          ))}
        </div>

        {data.closingStatement && (
          <p className={styles.closingStatement}>{data.closingStatement}</p>
        )}
      </Container>
    </section>
  );
}
