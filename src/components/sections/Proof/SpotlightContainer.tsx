import { SpotlightCard } from "./SpotlightCard";
import type { CaseStudy } from "@/data/proof";
import styles from "./SpotlightContainer.module.css";

interface SpotlightContainerProps {
  caseStudies: CaseStudy[];
}

/**
 * SpotlightContainer
 *
 * Owns the spotlight area as ONE parent surface, not three
 * independent cards: layout (the large-card + stacked-pair grid),
 * positioning (which slot each card sits in), clipping (`overflow:
 * hidden` on the outer surface — the boundary the other two cards
 * will animate out against in Phase 4), and viewport. Card content
 * itself is entirely SpotlightCard's concern.
 *
 * Slot assignment is by array position today (`caseStudies[0]` is
 * the large card, `[1]`/`[2]` are top-right/bottom-right) — see the
 * note in data/proof.ts about why that's a Phase-2 simplification,
 * not a permanent contract.
 *
 * Presentation only: no hover logic, no state. Server-renderable on
 * its own — it's only inside SpotlightExperience's Client Component
 * tree because its parent needs to be a Client Component ahead of
 * Phase 4, not because this component itself needs to be one.
 */
export function SpotlightContainer({ caseStudies }: SpotlightContainerProps) {
  const [large, topRight, bottomRight] = caseStudies;

  return (
    <div className={styles.container}>
      {large ? (
        <div className={styles.largeSlot}>
          <SpotlightCard caseStudy={large} />
        </div>
      ) : null}

      {topRight ? (
        <div className={styles.topRightSlot}>
          <SpotlightCard caseStudy={topRight} />
        </div>
      ) : null}

      {bottomRight ? (
        <div className={styles.bottomRightSlot}>
          <SpotlightCard caseStudy={bottomRight} />
        </div>
      ) : null}
    </div>
  );
}
