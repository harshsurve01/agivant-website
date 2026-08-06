import type { AmpProgressStage } from "@/data/ampTransformation";
import styles from "./AmpTimeline.module.css";

interface AmpTimelineProps {
  stages: AmpProgressStage[];
}

/**
 * AmpTimeline
 *
 * Horizontal dot-and-line timeline: one circular node per stage
 * (range number inside, e.g. "1 to 3"), a purple dot on the
 * connecting line between each pair of nodes, and a title/description
 * pair centered under each node — matches the Figma reference exactly.
 *
 * The connecting line is one continuous absolutely-positioned layer
 * behind the node list (`.line`), not a per-item border — it spans
 * every stage as a single track.
 *
 * Dots are positioned with a plain `left` percentage instead of being
 * measured in JS: since every `.item` is an equal-width flex child,
 * the dot between item `i` and item `i + 1` always sits at exactly
 * `((i + 1) / stages.length) * 100%` of the track's width, correct at
 * any rendered width with no ResizeObserver.
 *
 * Server Component: no "use client", no hooks, no state — static
 * layout only.
 */
export function AmpTimeline({ stages }: AmpTimelineProps) {
  return (
    <div className={styles.track}>
      <div className={styles.line} aria-hidden="true" />

      {stages.slice(0, -1).map((_, index) => (
        <span
          key={`dot-${index}`}
          className={styles.dot}
          aria-hidden="true"
          style={{ left: `${((index + 1) / stages.length) * 100}%` }}
        />
      ))}

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