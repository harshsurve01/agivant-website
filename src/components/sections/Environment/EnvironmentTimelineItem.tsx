import type { EnvironmentStageStat } from "@/data/environment";
import styles from "./EnvironmentTimelineItem.module.css";

interface EnvironmentTimelineItemProps {
  step: string;
  title: string;
  stat: EnvironmentStageStat;
  isActive: boolean;
  /** True once scroll has progressed past this stage. Distinct from
   *  `isActive`: a past item's dot/title stay in the "reached" visual
   *  state (filled dot, no pulse) rather than reverting to the same
   *  dim, not-yet-reached look as a step still ahead. */
  isPast: boolean;
}

/**
 * EnvironmentTimelineItem
 *
 * A single row on the vertical dot-and-line timeline: a dot (sized/
 * positioned to line up with EnvironmentTimeline's shared .line — see
 * that file's comment on the coupling), the step number, title, and
 * — only while `isActive` — this stage's stat. It owns none of the
 * logic for *which* item is active or past; those booleans are
 * computed once in EnvironmentTimeline from state supplied by
 * EnvironmentExperience.
 *
 * The pulsing ring on the active dot is a `::after` pseudo-element
 * (see .dotActive::after in the stylesheet) animating its own
 * transform/opacity rather than an rgba box-shadow — this project's
 * color tokens aren't guaranteed to be defined as raw r/g/b triples,
 * so a box-shadow pulse would need to invent a hardcoded pulse color
 * instead of reusing var(--color-text-link) directly.
 */
export function EnvironmentTimelineItem({
  step,
  title,
  stat,
  isActive,
  isPast,
}: EnvironmentTimelineItemProps) {
  return (
    <li
      className={`${styles.item} ${isActive ? styles.itemActive : ""} ${isPast ? styles.itemPast : ""}`}
      aria-current={isActive ? "step" : undefined}
    >
      <span className={styles.dot} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.row}>
          <span className={styles.step}>{step}</span>
          <span className={styles.title}>{title}</span>
        </div>

       
      </div>
    </li>
  );
}
