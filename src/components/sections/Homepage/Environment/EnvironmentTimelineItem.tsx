import type { EnvironmentStageStat } from "@/data/environment";
import styles from "./EnvironmentTimelineItem.module.css";

interface EnvironmentTimelineItemProps {
  step: string;
  title: string;
  stat: EnvironmentStageStat;
  isActive: boolean;
  /** True once the sequence has advanced past this stage. Distinct
   *  from `isActive`: a past item's dot/title stay in the "reached"
   *  visual state (filled dot, no pulse) rather than reverting to the
   *  same dim, not-yet-reached look as a step still ahead. */
  isPast: boolean;
  /** Fired on click or Enter/Space — jumps the experience straight to
   *  this stage's card. See EnvironmentTimeline's doc comment for why
   *  this component only reports the interaction rather than deciding
   *  what it does. */
  onSelect: () => void;
}

/**
 * EnvironmentTimelineItem
 *
 * A single, clickable row on the vertical dot-and-line timeline: a
 * dot (sized/positioned to line up with EnvironmentTimeline's shared
 * .line — see that file's comment on the coupling), the step number,
 * title, and — only while `isActive` — this stage's stat.
 *
 * Rendered as a <button> wrapping the row's content (rather than an
 * onClick on the <li> itself) so the interaction is keyboard-
 * reachable and screen-reader-announced as a button for free, instead
 * of hand-rolling role="button"/tabIndex/onKeyDown here.
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
  onSelect,
}: EnvironmentTimelineItemProps) {
  return (
    <li
      className={`${styles.item} ${isActive ? styles.itemActive : ""} ${isPast ? styles.itemPast : ""}`}
      aria-current={isActive ? "step" : undefined}
    >
      <button
        type="button"
        className={styles.trigger}
        onClick={onSelect}
        onMouseEnter={onSelect}
        onFocus={onSelect}
      >
        <span className={styles.dot} aria-hidden="true" />

        <div className={styles.content}>
          <div className={styles.row}>
            <span className={styles.step}>{step}</span>
            <span className={styles.title}>{title}</span>
          </div>
        </div>
      </button>
    </li>
  );
}