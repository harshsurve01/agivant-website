import type { AmpStatementData } from "@/data/ampTransformation";
import styles from "./AmpStatement.module.css";

interface AmpStatementProps {
  statement: AmpStatementData;
}

/** Single chevron path, reused three times per side at increasing
 *  horizontal offsets and decreasing opacity to build the layered
 *  chevron-stack glyph seen in the supplied screenshot. */
function ChevronMark({ offset }: { offset: number }) {
  return (
    <path
      d="M0 2L6 9L0 16"
      transform={`translate(${offset} 0)`}
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

/**
 * AmpStatement
 *
 * Responsible only for rendering the left chevron mark, the statement
 * text, and the right chevron mark — no business logic, no animation.
 * Both chevron stacks are static SVG (decorative, `aria-hidden`), not
 * icon-font glyphs, so a future Framer Motion pass can animate each
 * chevron in the stack independently without touching the markup.
 *
 * `statement.prefix`/`statement.highlight` split the sentence into a
 * default-color lead-in and an accent-colored close, matching how
 * data/ampTransformation.ts models it — no text is hardcoded here.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function AmpStatement({ statement }: AmpStatementProps) {
  return (
    <div className={styles.statement}>
      <svg
        className={styles.chevronLeft}
        viewBox="0 0 24 16"
        aria-hidden="true"
        focusable="false"
      >
        <ChevronMark offset={0} />
        <ChevronMark offset={7} />
        <ChevronMark offset={14} />
      </svg>

      <p className={styles.text}>
        {statement.prefix} <span className={styles.highlight}>{statement.highlight}</span>
      </p>

      <svg
        className={styles.chevronRight}
        viewBox="0 0 24 16"
        aria-hidden="true"
        focusable="false"
      >
        <ChevronMark offset={0} />
        <ChevronMark offset={7} />
        <ChevronMark offset={14} />
      </svg>
    </div>
  );
}
