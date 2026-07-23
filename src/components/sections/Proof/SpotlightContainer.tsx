import type { RefObject } from "react";
import { SpotlightCard } from "./SpotlightCard";
import type { CaseStudy } from "@/data/proof";
import styles from "./SpotlightContainer.module.css";

/**
 * Named after the three grid slots this component already renders
 * (.largeSlot/.topRightSlot/.bottomRightSlot) — not "card index" or
 * "case study id", since the animation in SpotlightExperience cares
 * about POSITION (which corner of the bento grid), not which case
 * study happens to be sitting there today.
 */
export type SpotlightSlot = "large" | "topRight" | "bottomRight";

interface SpotlightContainerProps {
  caseStudies: CaseStudy[];
  /** Forwarded from SpotlightExperience so it can measure this
   *  container's own fixed 824×648 box as the animation's coordinate
   *  space (see that file's "GEOMETRY" comment) — this component still
   *  owns rendering the node the ref points to and the aspect-ratio
   *  that fixes its size; it just doesn't own what's measured from it.
   *  Typed `| null` because `useRef<HTMLDivElement>(null)` in
   *  SpotlightExperience produces `RefObject<HTMLDivElement | null>`
   *  — `.current` is genuinely null until after mount — not because
   *  this component ever treats a null ref as a valid case itself. */
  containerRef: RefObject<HTMLDivElement | null>;
  /** One ref per slot, same `| null` reasoning as containerRef.
   *  SpotlightExperience animates these nodes directly via GSAP
   *  transforms (translate/scale only — never grid-column/grid-row,
   *  per the architecture constraint), but it never decides WHERE
   *  they render in the grid; that's still this component's job via
   *  .largeSlot/.topRightSlot/.bottomRightSlot below. Refs point at
   *  the slot wrappers, not at SpotlightCard itself, so SpotlightCard
   *  stays purely presentational and has no idea an animation exists. */
  slotRefs: {
    large: RefObject<HTMLDivElement | null>;
    topRight: RefObject<HTMLDivElement | null>;
    bottomRight: RefObject<HTMLDivElement | null>;
  };
  /** Fired when the pointer enters a slot. SpotlightContainer doesn't
   *  hold or interpret hover state itself — see SpotlightExperience's
   *  doc comment on state ownership — it only reports WHICH slot the
   *  pointer entered; SpotlightExperience decides what that means. */
  onSlotEnter: (slot: SpotlightSlot) => void;
}

/**
 * SpotlightContainer
 *
 * Owns the spotlight area as ONE parent surface: layout (the
 * large-card + stacked-pair grid), positioning (which slot each card
 * sits in), and clipping (`overflow: hidden` — now doing real work,
 * not just reserved for later: it's the boundary the two non-hovered
 * cards animate fully outside of). Card content itself is entirely
 * SpotlightCard's concern; hover STATE and the GSAP timeline that
 * reacts to it are entirely SpotlightExperience's concern (see that
 * file). This component is the seam between the two: it exposes the
 * DOM nodes (via refs) and the raw pointer signal (via onSlotEnter)
 * that SpotlightExperience needs, without holding any animation logic
 * of its own.
 *
 * Presentation + wiring only: no hover state, no GSAP, no measurement.
 */
export function SpotlightContainer({
  caseStudies,
  containerRef,
  slotRefs,
  onSlotEnter,
}: SpotlightContainerProps) {
  const [large, topRight, bottomRight] = caseStudies;

  return (
    <div className={styles.container} ref={containerRef}>
      {large ? (
        <div
          ref={slotRefs.large}
          className={styles.largeSlot}
          onMouseEnter={() => onSlotEnter("large")}
        >
          <SpotlightCard caseStudy={large} />
        </div>
      ) : null}

      {topRight ? (
        <div
          ref={slotRefs.topRight}
          className={styles.topRightSlot}
          onMouseEnter={() => onSlotEnter("topRight")}
        >
          <SpotlightCard caseStudy={topRight} />
        </div>
      ) : null}

      {bottomRight ? (
        <div
          ref={slotRefs.bottomRight}
          className={styles.bottomRightSlot}
          onMouseEnter={() => onSlotEnter("bottomRight")}
        >
          <SpotlightCard caseStudy={bottomRight} />
        </div>
      ) : null}
    </div>
  );
}