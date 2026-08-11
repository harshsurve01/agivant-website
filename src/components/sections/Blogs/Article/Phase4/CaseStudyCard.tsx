import type { CaseStudy } from "./types";
import styles from "./CaseStudyCard.module.css";

export interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

/**
 * CaseStudyCard
 *
 * Renders one Phase 4 case-study card: a header row (title left,
 * metric label right), then a two-column body split by a vertical
 * divider — "Instead of saying:" on the left, "Say:" + a closing
 * explanation (under its own divider) on the right. Pulled into its
 * own local component since all three cards share this exact shape,
 * per the task's own instruction — same "small local card component"
 * pattern already used by Phase1's MetricCard and Phase3's
 * InstrumentationCard, not a new shared/global component, since
 * nothing elsewhere in the project has this two-column before/after
 * shape.
 *
 * Server Component: no "use client", no hooks, no state, no data
 * imports. Every value arrives via props.
 */
export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const {
    title,
    metricLabel,
    insteadLabel,
    insteadText,
    sayLabel,
    sayText,
    explanation,
  } = caseStudy;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.metricLabel}>{metricLabel}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.column}>
          <p className={styles.insteadLabel}>{insteadLabel}</p>
          <p className={styles.text}>{insteadText}</p>
        </div>

        <div className={`${styles.column} ${styles.rightColumn}`}>
          <p className={styles.sayLabel}>{sayLabel}</p>
          <p className={styles.text}>{sayText}</p>

          <hr className={styles.divider} aria-hidden="true" />

          <p className={styles.explanation}>{explanation}</p>
        </div>
      </div>
    </article>
  );
}
