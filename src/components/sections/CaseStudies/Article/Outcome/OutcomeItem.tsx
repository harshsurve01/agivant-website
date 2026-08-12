import styles from "./OutcomeItem.module.css";
import type { OutcomeItem as OutcomeItemData } from "./types";

interface OutcomeItemProps extends OutcomeItemData {
  /**
   * Position in the flat 7-item list (1-based), used only to decide
   * divider placement and the 7th item's grid column — never rendered
   * as the visible number (that's `index`, e.g. "01").
   */
  position: number;
}

/**
 * OutcomeItem (Case Study Inner Page — Outcome section)
 *
 * One numbered result: circular numbered badge, then the emphasized
 * purple run immediately followed by the supporting black run, read
 * as a single sentence. See Outcome.module.css for the divider rule
 * that pairs with `position` and OutcomeItem.module.css for the badge
 * and typography derivation.
 */
export function OutcomeItem({ index, emphasis, text, position }: OutcomeItemProps) {
  return (
    <li
      className={styles.item}
      data-position={position}
    >
      <span className={styles.badge} aria-hidden="true">
        {index.replace(/^0/, "")}
      </span>
      <p className={styles.text}>
        <span className={styles.emphasis}>{emphasis}</span> {text}
      </p>
    </li>
  );
}
