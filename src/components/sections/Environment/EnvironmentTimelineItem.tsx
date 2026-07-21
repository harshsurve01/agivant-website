import styles from "./EnvironmentTimelineItem.module.css";

interface EnvironmentTimelineItemProps {
  step: string;
  title: string;
  isActive: boolean;
}

/**
 * EnvironmentTimelineItem
 *
 * A single numbered row: step number, a vertical divider, and the
 * stage title, with `isActive` swapping its visual treatment (see
 * .itemActive in the stylesheet). It owns none of the logic for
 * *which* item is active — that's computed once in
 * EnvironmentTimeline from a prop supplied by EnvironmentExperience —
 * this component only renders the appearance for whatever boolean
 * it's given.
 *
 * The divider is its own element now, not a border on .item, because
 * the future progressive-line-fill treatment (see the section spec's
 * Future Motion list) animates the line's fill independently of the
 * row it sits in — same "split it out before the animation needs it
 * split" reasoning as AIStackCard's layer split.
 */
export function EnvironmentTimelineItem({ step, title, isActive }: EnvironmentTimelineItemProps) {
  return (
    <li className={`${styles.item} ${isActive ? styles.itemActive : ""}`} aria-current={isActive ? "step" : undefined}>
      <span className={styles.step}>{step}</span>
      <span className={styles.divider} aria-hidden="true" />
      <span className={styles.title}>{title}</span>
    </li>
  );
}
