import { AmpColumn } from "./AmpColumn";
import { AmpConnectors } from "./AmpConnectors";
import { AmpHub } from "./AmpHub";
import type { AmpColumnData, AmpHubData } from "@/data/ampTransformation";
import styles from "./AmpExperience.module.css";

interface AmpExperienceProps {
  leftColumn: AmpColumnData;
  hub: AmpHubData;
  rightColumn: AmpColumnData;
}

/**
 * AmpExperience
 *
 * Responsible for arranging the left column, center hub, right
 * column, AND the connector layer that visually ties them together —
 * no business logic, no animation of its own.
 *
 * <AmpConnectors/> is rendered as a plain sibling here, not inside
 * AmpHub. It positions itself as a full-area absolute overlay (see
 * AmpConnectors.module.css) against this component's own
 * `.experience` container, which is why `.experience` carries
 * `position: relative` — see AmpExperience.module.css. Placing it
 * first in the JSX is arbitrary (it's taken out of normal flow, so
 * DOM order here doesn't affect layout); what keeps it visually
 * beneath the columns/hub is `.leftSlot`/`.rightSlot`/`.hub` each
 * having their own `z-index: 1` while the connector layer sits at
 * `z-index: 0`.
 *
 * The same reusable AmpColumn component renders both `leftColumn` and
 * `rightColumn`; only the data object and `side` tag passed to it
 * differ.
 *
 * Server Component: no "use client", no hooks, no state. All the
 * DOM-measuring work needed to draw connectors lives inside
 * AmpConnectors itself, which is why this component doesn't need to
 * become a Client Component just to host it.
 */
export function AmpExperience({ leftColumn, hub, rightColumn }: AmpExperienceProps) {
  return (
    <div className={styles.experience}>
      <AmpConnectors />

      <div className={styles.leftSlot}>
        <AmpColumn column={leftColumn} side="left" />
      </div>

      <AmpHub hub={hub} />

      <div className={styles.rightSlot}>
        <AmpColumn column={rightColumn} side="right" />
      </div>
    </div>
  );
}