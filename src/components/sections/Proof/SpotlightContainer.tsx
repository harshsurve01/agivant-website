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
  /** Forwarded from SpotlightExperience so it can write the animated
   *  `grid-template-columns` / `grid-template-rows` directly onto
   *  this container's own DOM node (see that file's doc comment for
   *  why the interaction targets the grid's own tracks rather than
   *  individual cards). This component still owns the CSS that
   *  defines the container's rest-state grid, slot placement, and
   *  fixed 824×648 box (SpotlightContainer.module.css); it just
   *  doesn't own the inline style overrides written to it mid-hover.
   *  Typed `| null` because `useRef<HTMLDivElement>(null)` in
   *  SpotlightExperience produces `RefObject<HTMLDivElement | null>`
   *  — `.current` is genuinely null until after mount. */
  containerRef: RefObject<HTMLDivElement | null>;
  /** Fired when the pointer enters a slot. SpotlightContainer doesn't
   *  hold or interpret hover state itself — see SpotlightExperience's
   *  doc comment on state ownership — it only reports WHICH slot the
   *  pointer entered; SpotlightExperience decides what grid split
   *  that means. */
  onSlotEnter: (slot: SpotlightSlot) => void;
}

/**
 * SpotlightContainer
 *
 * Owns the spotlight area as ONE parent surface: the bento grid's
 * rest-state layout (large-card + stacked-pair), which slot each
 * card sits in, and clipping. Card content itself is entirely
 * SpotlightCard's concern; hover STATE and the grid-track tween that
 * reacts to it are entirely SpotlightExperience's concern (see that
 * file). This component is the seam between the two: it exposes the
 * one DOM node (via `containerRef`) SpotlightExperience animates and
 * the raw pointer signal (via `onSlotEnter`) it needs, without
 * holding any animation logic of its own.
 *
 * No per-slot refs any more — unlike the previous width/transform-
 * based interaction, the current version never reads or writes an
 * individual card's box directly. Every card fills its slot at
 * `width: 100%; height: 100%` (SpotlightCard.module.css's `.card`)
 * purely because the slot's grid track resized underneath it, so
 * there's nothing per-card left for this component to expose.
 *
 * Presentation + wiring only: no hover state, no GSAP, no
 * measurement.
 */
export function SpotlightContainer({
  caseStudies,
  containerRef,
  onSlotEnter,
}: SpotlightContainerProps) {
  const [large, topRight, bottomRight] = caseStudies;

  return (
    <div className={styles.container} ref={containerRef}>
      {large ? (
        <div
          className={styles.largeSlot}
          onMouseEnter={() => onSlotEnter("large")}
        >
          <SpotlightCard caseStudy={large} />
        </div>
      ) : null}

      {topRight ? (
        <div
          className={styles.topRightSlot}
          onMouseEnter={() => onSlotEnter("topRight")}
        >
          <SpotlightCard caseStudy={topRight} />
        </div>
      ) : null}

      {bottomRight ? (
        <div
          className={styles.bottomRightSlot}
          onMouseEnter={() => onSlotEnter("bottomRight")}
        >
          <SpotlightCard caseStudy={bottomRight} />
        </div>
      ) : null}
    </div>
  );
}