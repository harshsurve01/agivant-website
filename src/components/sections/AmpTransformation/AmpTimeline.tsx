import type { AmpProgressStage } from "@/data/ampTransformation";
import styles from "./AmpTimeline.module.css";

interface AmpTimelineProps {
  stages: AmpProgressStage[];
}

/**
 * AmpTimeline
 *
 * Receives an array of stages and renders the horizontal dot-and-line
 * timeline dynamically — no assumption that there will always be
 * three stages (per the implementation brief). The connecting line is
 * rendered once, as a single absolutely-positioned layer behind the
 * whole list (`.line`), not as a per-item border/pseudo-element: it's
 * one continuous track spanning every stage, not N-1 independent
 * segments, same reasoning as EnvironmentTimeline's `.line`/`.lineFill`
 * split for its vertical equivalent.
 *
 * An <ol> rather than <ul>/<div> because the stages are an
 * intrinsically ordered sequence (Foundational → Operational →
 * Autonomous), not an unordered collection.
 *
 * Static: no active/current-stage state, no scroll sync, no
 * animation — this section ships as a static layout only.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function AmpTimeline({ stages }: AmpTimelineProps) {
  return (
    <div className={styles.track}>
      <div className={styles.line} aria-hidden="true" />

      <ol className={styles.list}>
        {stages.map((stage) => (
          <li key={stage.id} className={styles.item}>
            <span className={styles.node}>
              <span className={styles.range}>{stage.range}</span>
            </span>

            <div className={styles.copy}>
              <span className={styles.title}>{stage.title}</span>
              <span className={styles.description}>{stage.description}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
