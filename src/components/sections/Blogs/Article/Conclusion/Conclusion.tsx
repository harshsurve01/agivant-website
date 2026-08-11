import { Container } from "@/components/ui/Container";
import type { ConclusionProps } from "./types";
import styles from "./Conclusion.module.css";

/**
 * Conclusion
 *
 * Renders the Blog Inner page's final Article section: a heading
 * with a purple vertical accent bar (same headingRow pattern
 * ExecutiveBrief already establishes), two body paragraphs, and a
 * highlighted quote/callout card — soft background, rounded
 * corners, purple left accent, italic text — beneath them.
 *
 * SOURCE NOTE: the connected Figma MCP tool was not reachable for
 * this task (same rate-limit condition Phase2/Phase3/Phase4 already
 * hit) — no node IDs to cite. Built from the screenshot shared
 * directly in the conversation, cross-checked against the plain-text
 * Conclusion copy also provided (they matched). All spacing/sizing
 * is an ESTIMATE, matched to the closest existing token / Article
 * convention, flagged inline in Conclusion.module.css.
 *
 * The quote callout is small enough (one text block, no internal
 * sub-structure) that it stays inline in this file rather than
 * becoming its own ConclusionQuote component, per the task's own
 * "do not create unnecessary abstractions" instruction.
 *
 * No HeroBackground — screenshot shows a plain background, same as
 * every non-Hero Article section.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no data imports. Every value arrives via props, so this component
 * is already shaped for a future WordPress-sourced article object
 * with zero changes required on this end.
 */
export function Conclusion({ title, paragraphs, quote }: ConclusionProps) {
  return (
    <section className={styles.conclusion}>
      <Container>
        <div className={styles.headingRow}>
          <span className={styles.bar} aria-hidden="true" />
          <h2 className={styles.title}>{title}</h2>
        </div>

       <div className={styles.body}>
  {paragraphs.map((paragraph, index) => (
    <p
      key={index}
      className={`${styles.paragraph} ${
        index === 0 ? styles.emphasis : ""
      }`}
    >
      {paragraph}
    </p>
  ))}
</div>

        <blockquote className={styles.quoteCard}>
          <p className={styles.quoteText}>{quote}</p>
        </blockquote>
      </Container>
    </section>
  );
}
