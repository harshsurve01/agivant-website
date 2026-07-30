import { AmpColumn } from "./AmpColumn";
import { AmpConnectorLayer } from "./AmpConnectorLayer";
import { AmpCore } from "./AmpCore";
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
 * The pinned area of the section (see the section spec's Pin
 * Behaviour: "This section pins ONLY the Experience"). Arranges the
 * left column, AmpCore, right column, and the connector layer that
 * visually ties them together — no business logic of its own.
 *
 * Structure matches the spec's Experience breakdown exactly:
 *   Left Column → Connector Layer → AmpCore → Connector Layer → Right Column
 *
 * <AmpConnectorLayer/> is rendered as a plain sibling here, not inside
 * AmpCore. It positions itself as a full-area absolute overlay (see
 * AmpConnectorLayer.module.css) against this component's own
 * `.experience` container, which is why `.experience` carries
 * `position: relative` — see AmpExperience.module.css. Placing it
 * first in the JSX is arbitrary (it's taken out of normal flow, so
 * DOM order here doesn't affect layout); what keeps it visually
 * beneath the columns/core is `.leftSlot`/`.rightSlot`/`.core` each
 * having their own `z-index: 1` while the connector layer sits at
 * `z-index: 0`.
 *
 * The same reusable AmpColumn component renders both `leftColumn` and
 * `rightColumn`; only the data object and `side` tag passed to it
 * differ.
 *
 * Server Component today: no "use client", no hooks, no state. The
 * GSAP + ScrollTrigger pin/timeline (System 1 in the spec's Motion
 * Architecture — pin, logo reveal/shrink, orb reveal, card reveal,
 * connector drawing) lands on this component in a follow-up pass and
 * will require a Client Component boundary at that point; this
 * structural pass keeps it a plain layout shell. All the DOM-measuring
 * work needed to draw connectors lives inside AmpConnectorLayer itself,
 * which is why this component doesn't need to become a Client
 * Component just to host it today.
 */
export function AmpExperience({ leftColumn, hub, rightColumn }: AmpExperienceProps) {
  return (
    <div className={styles.experience}>
      <AmpConnectorLayer />

      <div className={styles.leftSlot}>
        <AmpColumn column={leftColumn} side="left" />
      </div>

      <AmpCore hub={hub} />

      <div className={styles.rightSlot}>
        <AmpColumn column={rightColumn} side="right" />
      </div>
    </div>
  );
}
