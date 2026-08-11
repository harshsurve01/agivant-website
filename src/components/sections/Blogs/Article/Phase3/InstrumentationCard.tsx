import type { Phase3Card } from "./types";
import styles from "./InstrumentationCard.module.css";

export interface InstrumentationCardProps {
  card: Phase3Card;
}

/**
 * InstrumentationCard
 *
 * Renders one Phase 3 card: a primary (black) heading + body, a
 * divider, then a secondary (brand-purple) heading + body. Kept as
 * its own small local component — same "pull repeated card markup
 * into its own file" pattern Phase1 already established with
 * MetricCard — but intentionally NOT the same component or shape as
 * MetricCard itself, since Phase 3's cards have a fixed two-block
 * structure rather than a variable-length reference list. See
 * Phase3Card's own doc comment for why.
 *
 * `primaryTitleUnderlined` is applied only when the data says so
 * (currently just the "Prompt/tool telemetry" card) — see that
 * field's doc comment for why this isn't baked into the base style.
 *
 * Server Component: no "use client", no hooks, no state, no data
 * imports. Every value arrives via props.
 */
export function InstrumentationCard({ card }: InstrumentationCardProps) {
  const {
    primaryTitle,
    primaryDescription,
    secondaryTitle,
    secondaryDescription,
    primaryTitleUnderlined,
  } = card;

  return (
    <article className={styles.card}>
 <h3 className={styles.primaryTitle}>{primaryTitle}</h3>
      <p className={styles.primaryDescription}>{primaryDescription}</p>

      <hr className={styles.divider} aria-hidden="true" />

      <h3 className={styles.secondaryTitle}>{secondaryTitle}</h3>
      <p className={styles.secondaryDescription}>{secondaryDescription}</p>
    </article>
  );
}
