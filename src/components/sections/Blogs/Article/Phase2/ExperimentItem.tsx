import type { Phase2Item } from "./types";
import styles from "./ExperimentItem.module.css";

export interface ExperimentItemProps {
  item: Phase2Item;
  /** Whether to render the divider below this item. False for the last item in the list. */
  showDivider: boolean;
}

/**
 * ExperimentItem
 *
 * One row in the Phase 2 numbered list: a circular index badge
 * ("01") beside a bold title and a body paragraph, with an optional
 * divider beneath it. Pulled into its own component, mirroring
 * Phase1's own MetricCard, rather than inlining the markup five
 * times in Phase2.tsx.
 *
 * The divider is owned by the item (not a CSS border on the list
 * container) so the last item can omit it — the screenshots show no
 * rule beneath item 05.
 *
 * Server Component: no "use client", no hooks, no state, no data
 * imports. Every value arrives via props.
 */
export function ExperimentItem({ item, showDivider }: ExperimentItemProps) {
  return (
    <div className={styles.item}>
      <div className={styles.row}>
        <span className={styles.badge} aria-hidden="true">
          {item.index}
        </span>

        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.description}>{item.description}</p>
        </div>
      </div>

      {showDivider && <hr className={styles.divider} aria-hidden="true" />}
    </div>
  );
}
