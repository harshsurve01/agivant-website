import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Cube } from "@/components/ui/Icon/Cube";
import { AmpTimeline } from "./AmpTimeline";
import type { AmpStatementData, AmpProgressData } from "@/data/ampTransformation";
import styles from "./AmpFooter.module.css";

interface AmpFooterProps {
  statement: AmpStatementData;
  progress: AmpProgressData;
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
 * AmpFooter
 *
 * The section's normal-scroll footer — everything that lives below
 * the pinned Experience. Layout refinement per the latest approved
 * Figma: this is a straight vertical stack now, not a two-part
 * statement-row-plus-card —
 *
 *   Enterprise Statement → Timeline Title → Timeline → CTA Button
 *
 * all centered, with no bordered/padded "card" around the timeline
 * section anymore (see AmpFooter.module.css's .progress — it's a
 * plain flex column now, card visuals removed).
 *
 * The timeline itself is unchanged (still AmpTimeline, still fed the
 * same `progress.stages`) — it's wrapped in `.timelineWrap` purely to
 * constrain it to ~45-50% width and keep it centered, per the updated
 * Figma. AmpTimeline's own internals (nodes, dots, line, mobile
 * breakpoint) aren't touched.
 *
 * `progress.button` is still optional per "Do NOT assume... the
 * button always exists" — renders nothing in its place when a future
 * WordPress response omits it.
 *
 * Server Component: no "use client", no hooks, no state. Per the
 * spec's Pin Behaviour, this component is never touched by
 * ScrollTrigger — it scrolls normally.
 */
export function AmpFooter({ statement, progress }: AmpFooterProps) {
  return (
    <div className={styles.footer}>
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

        <p className={styles.statementText}>
          {statement.prefix}{" "}
          <span className={styles.statementHighlight}>{statement.highlight}</span>
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

      <div className={styles.progress}>
        <h3 className={styles.progressTitle}>{progress.title}</h3>

        <div className={styles.timelineWrap}>
          <AmpTimeline stages={progress.stages} />
        </div>

        {progress.button ? (
          <Link href={progress.button.href} className={styles.cta}>
            <Button variant="primary" size="lg" rightIcon={<Cube />}>
              {progress.button.label}
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}