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
 * the pinned Experience (see the section spec's overall structure:
 * "The footer is NOT inside the pinned timeline. The footer exists
 * naturally below the experience."). Folds together what used to be
 * two separate siblings of AmpTransformation (AmpStatement and
 * AmpProgress) into the single AmpFooter the spec's folder structure
 * calls for, in the spec's own order:
 *
 *   Enterprise Statement → Timeline → CTA
 *
 * The chevron statement row and the "How Amp'd is Your Enterprise?"
 * timeline/CTA card keep their own internal sections below rather
 * than being flattened into one undifferentiated block, so either
 * piece's layout can still change independently without touching the
 * other — same separation of concerns the rest of this section
 * follows, just composed under one component per the new structure.
 * AmpTimeline itself stays its own file/component: it's reusable
 * layout (an ordered dot-and-line track) that AmpFooter composes, the
 * same way AmpColumn composes AmpNode.
 *
 * `progress.button` is optional per "Do NOT assume... the button
 * always exists" — this component renders nothing in its place when
 * a future WordPress response omits it, rather than rendering a
 * broken or empty CTA slot.
 *
 * Server Component: no "use client", no hooks, no state. Per the
 * spec's Pin Behaviour, this component is never touched by
 * ScrollTrigger — it scrolls normally, so it never needs to become a
 * Client Component for that reason. The orb/connector activity
 * visible above it while it scrolls into view (spec Phase 9: "the orb
 * keeps rotating... nothing freezes") lives entirely in AmpCore /
 * AmpConnectorLayer's own time-driven and event-driven systems, not
 * here.
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

        <div className={styles.progressRow}>
          <AmpTimeline stages={progress.stages} />

          {progress.button ? (
            <Link href={progress.button.href} className={styles.cta}>
              <Button variant="primary" size="lg" rightIcon={<Cube />}>
                {progress.button.label}
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
