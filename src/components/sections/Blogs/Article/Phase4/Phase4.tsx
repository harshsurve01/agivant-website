import { Container } from "@/components/ui/Container";
import { CaseStudyCard } from "./CaseStudyCard";
import type { Phase4Props } from "./types";
import styles from "./Phase4.module.css";

/**
 * Phase4
 *
 * Renders the Blog Inner page's "Phase 4 — Reporting in CFO
 * Language" section: eyebrow, two-tone underlined heading, a
 * regular-weight intro paragraph, a bold-weight emphasis paragraph,
 * then a vertical stack of three case-study cards (KPMG Auditing,
 * Metro Credit Union, Contingency & Mitigation).
 *
 * SOURCE NOTE: the connected Figma MCP tool returned a Starter-plan
 * rate-limit error on every call attempted for this task, same as
 * Phase2/Phase3 — there are no Figma node IDs to cite anywhere in
 * this section. Built entirely from one PNG screenshot the user
 * exported and shared directly, cross-checked against the exact copy
 * the user also pasted in text (they matched, so no discrepancy to
 * report — see this file's own PR-style report for details). All
 * spacing/sizing is an ESTIMATE, matched to the closest existing
 * token / the closest established Article convention, flagged
 * inline in Phase4.module.css / CaseStudyCard.module.css.
 *
 * Cards stack vertically (not a grid) — unlike Phase1/Phase3, the
 * screenshot shows each case-study card spanning the full content
 * width, one beneath the other.
 *
 * No HeroBackground — screenshot shows a plain background, same as
 * every non-Hero Article section.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no data imports. Every value arrives via props, so this component
 * is already shaped for a future WordPress-sourced article object
 * with zero changes required on this end.
 */
export function Phase4({
  eyebrow,
  title,
  description,
  emphasis,
  caseStudies,
}: Phase4Props) {
  const words = title.split(" ");
  // Screenshot shows the first TWO words plain, not one — see
  // Phase4Props.title's own doc comment for why this differs from
  // Phase2/Phase3's "first word only" split.
  const rest = words.slice(2).join(" ");
  const lead = words.slice(0, 2).join(" ");

  return (
    <section className={styles.phase4}>
      <Container>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}

        <h2 className={styles.title}>
          {lead}
          {rest ? " " : ""}
          <span className={styles.highlight}>{rest}</span>
        </h2>

        <p className={styles.description}>{description}</p>
        <p className={styles.emphasis}>{emphasis}</p>

        <div className={styles.list}>
          {caseStudies.map((caseStudy) => (
            <CaseStudyCard key={caseStudy.title} caseStudy={caseStudy} />
          ))}
        </div>
      </Container>
    </section>
  );
}
