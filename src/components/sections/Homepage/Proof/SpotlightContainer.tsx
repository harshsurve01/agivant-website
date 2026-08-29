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
export type SpotlightSlot =
  | "large"
  | "topRight"
  | "bottomRight"
  | "topLeft"
  | "bottomLeft";

export type ProofLayoutVariant = "large-left" | "large-right";

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
  /** Generic visual arrangement: large card on left (default) or right */
  layout?: ProofLayoutVariant;
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
 * Presentation + wiring only: no hover state, no GSAP, no
 * measurement.
 */
export function SpotlightContainer({
  caseStudies,
  containerRef,
  onSlotEnter,
  layout = "large-right",
}: SpotlightContainerProps) {
  if (layout === "large-right") {
    // New Figma reference:
    // Column 1 (Left): Two stacked cards:
    //   - Top Left: Card 1 (caseStudies[0])
    //   - Bottom Left: Card 3 (caseStudies[2])
    // Column 2 (Right): Tall card:
    //   - Tall Right: Card 2 (caseStudies[1], spanning both rows)
    const [card1, card2, card3] = caseStudies;

    return (
      <div className={styles.container} ref={containerRef}>
        {card1 ? (
          <div
            className={styles.topLeftSlot}
            onMouseEnter={() => onSlotEnter("topLeft")}
          >
            <SpotlightCard caseStudy={card1} slot="topLeft" />
          </div>
        ) : null}

        {card3 ? (
          <div
            className={styles.bottomLeftSlot}
            onMouseEnter={() => onSlotEnter("bottomLeft")}
          >
            <SpotlightCard caseStudy={card3} slot="bottomLeft" />
          </div>
        ) : null}

        {card2 ? (
          <div
            className={styles.largeRightSlot}
            onMouseEnter={() => onSlotEnter("large")}
          >
            <SpotlightCard caseStudy={card2} slot="large" />
          </div>
        ) : null}
      </div>
    );
  }

  // layout === "large-left" (default Homepage layout)
  const [large, topRight, bottomRight] = caseStudies;

  return (
    <div className={styles.container} ref={containerRef}>
      {large ? (
        <div
          className={styles.largeSlot}
          onMouseEnter={() => onSlotEnter("large")}
        >
          <SpotlightCard caseStudy={large} slot="large" />
        </div>
      ) : null}

      {topRight ? (
        <div
          className={styles.topRightSlot}
          onMouseEnter={() => onSlotEnter("topRight")}
        >
          <SpotlightCard caseStudy={topRight} slot="topRight" />
        </div>
      ) : null}

      {bottomRight ? (
        <div
          className={styles.bottomRightSlot}
          onMouseEnter={() => onSlotEnter("bottomRight")}
        >
          <SpotlightCard caseStudy={bottomRight} slot="bottomRight" />
        </div>
      ) : null}
    </div>
  );
}