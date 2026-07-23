"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SpotlightContainer, type SpotlightSlot } from "./SpotlightContainer";
import type { CaseStudy } from "@/data/proof";
import styles from "./SpotlightExperience.module.css";

interface SpotlightExperienceProps {
  caseStudies: CaseStudy[];
}

/** A plain, serializable rect — not DOMRect — since these values are
 *  cached once and read many times, not re-derived from the DOM. */
interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Everything the hover-reaction effect needs, captured in one shot
 *  so it never has to call getBoundingClientRect() itself — see
 *  "GEOMETRY IS CACHED, NOT RE-READ" below. */
interface SpotlightLayout {
  container: { width: number; height: number };
  slots: Record<SpotlightSlot, Rect>;
}

const ANIMATION_DURATION = 0.6;
const ANIMATION_EASE = "power3.inOut";

/**
 * SpotlightExperience
 *
 * The section's only Client Component, and the owner of the
 * hover-driven "bento spotlight" interaction: which card is hovered
 * (React state) and the GSAP timeline that reacts to it (imperative,
 * DOM-direct). SpotlightContainer keeps owning layout/positioning/
 * clipping; SpotlightCard stays presentational.
 *
 * WHY WIDTH/HEIGHT, NOT scaleX/scaleY
 * The cards hold typography, a glass/blur panel, icons, and an image
 * — scaling the whole card visually stretches all of that (blurred
 * text, distorted icons), which isn't the "genuinely becomes the
 * container's size" feel this needs. So sizing is animated as real
 * `width`/`height` (the element's actual box, causing its content to
 * reflow at each size the way it would if you resized a real
 * container), and only POSITION is a transform (`x`/`y` translate).
 * Translate doesn't distort anything it moves — it's a pure position
 * shift — so it stays the right tool for "slide this card to a
 * different spot" even though `scale` was wrong for "resize this
 * card". `transformOrigin` is gone entirely: it only mattered for the
 * old scale-based math and has no effect on translate.
 *
 * GEOMETRY IS CACHED, NOT RE-READ
 * `layoutRef` holds the container's size AND every slot's rest
 * rect (position/size as CSS Grid laid it out, relative to the
 * container's own box), captured once on mount and again only on
 * resize (see the first effect below). The hover-reaction effect
 * (the second one) reads exclusively from `layoutRef.current` — it
 * never calls `getBoundingClientRect()` — so hovering back and forth
 * across the bento grid costs zero layout reads, only writes.
 *
 * WHY MOUSE-LEAVE LIVES ON THE OUTER WRAPPER, NOT PER-SLOT
 * Individual slots only report onMouseEnter. Moving the pointer
 * directly from one card to an adjacent one never fires a "leave" in
 * between (the pointer stays inside .experience the whole time), so
 * hovering across the grid re-targets smoothly without a flash back
 * to the resting layout. The reset to `null` only fires when the
 * pointer leaves the spotlight area entirely.
 */
export function SpotlightExperience({ caseStudies }: SpotlightExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const largeRef = useRef<HTMLDivElement>(null);
  const topRightRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);

  // The cached snapshot — see "GEOMETRY IS CACHED, NOT RE-READ" above.
  const layoutRef = useRef<SpotlightLayout | null>(null);

  const [hoveredSlot, setHoveredSlot] = useState<SpotlightSlot | null>(null);

  // Measure once on mount, and again only on resize — never per-hover.
  useEffect(() => {
    const measure = () => {
      const containerEl = containerRef.current;
      const largeEl = largeRef.current;
      const topRightEl = topRightRef.current;
      const bottomRightEl = bottomRightRef.current;
      if (!containerEl || !largeEl || !topRightEl || !bottomRightEl) return;

      // Clear any in-progress GSAP overrides before reading — reading
      // mid-animation (or after a previous hover left inline
      // width/height/transform behind) would bake a stale value into
      // what's supposed to be the untouched grid position/size.
      gsap.set([largeEl, topRightEl, bottomRightEl], {
        clearProps: "transform,width,height",
      });

      const containerBox = containerEl.getBoundingClientRect();
      const toLocal = (box: DOMRect): Rect => ({
        left: box.left - containerBox.left,
        top: box.top - containerBox.top,
        width: box.width,
        height: box.height,
      });

      layoutRef.current = {
        container: { width: containerBox.width, height: containerBox.height },
        slots: {
          large: toLocal(largeEl.getBoundingClientRect()),
          topRight: toLocal(topRightEl.getBoundingClientRect()),
          bottomRight: toLocal(bottomRightEl.getBoundingClientRect()),
        },
      };
    };

    const mm = gsap.matchMedia();
    // Mirrors ProofSection.module.css's `@media (max-width: 1024px)`:
    // below that breakpoint SpotlightContainer's grid collapses to a
    // single stacked column, so the "expand to fill / slide outside"
    // geometry computed here no longer describes the layout — the
    // hover interaction simply doesn't attach below that width.
    mm.add("(min-width: 1025px)", () => {
      measure();
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    });

    return () => mm.revert();
  }, []);

  // React to hover changes using ONLY the cached layout — no DOM reads.
  useEffect(() => {
    const layout = layoutRef.current;
    const largeEl = largeRef.current;
    const topRightEl = topRightRef.current;
    const bottomRightEl = bottomRightRef.current;
    if (!layout || !largeEl || !topRightEl || !bottomRightEl) return;

    const els: Record<SpotlightSlot, HTMLDivElement> = {
      large: largeEl,
      topRight: topRightEl,
      bottomRight: bottomRightEl,
    };

    const { width: containerWidth, height: containerHeight } = layout.container;

    const tl = gsap.timeline({
      defaults: { duration: ANIMATION_DURATION, ease: ANIMATION_EASE },
    });

    (Object.keys(els) as SpotlightSlot[]).forEach((slot) => {
      const el = els[slot];
      const rect = layout.slots[slot];

      if (hoveredSlot === null) {
        // Nothing hovered — every card returns to its untouched grid
        // position AND size. Absolute targets (not "undo the last
        // delta"), so this is safe even mid-animation.
        tl.to(
          el,
          { x: 0, y: 0, width: rect.width, height: rect.height, zIndex: 1 },
          0,
        );
        return;
      }

      if (slot === hoveredSlot) {
        // Translate this card's rest-rect top-left corner to the
        // container's top-left corner, and grow its real box to the
        // container's exact width/height — content reflows into that
        // size naturally, nothing is visually stretched.
        tl.set(el, { zIndex: 10 }, 0).to(
          el,
          { x: -rect.left, y: -rect.top, width: containerWidth, height: containerHeight },
          0,
        );
        return;
      }

      // Every other card keeps its own rest size and only translates
      // fully outside the container's clipped box, on the side that
      // keeps the motion reading as "making room" (see getExitTarget).
      const exit = getExitTarget(slot, hoveredSlot, rect, containerWidth, containerHeight);
      tl.set(el, { zIndex: 1 }, 0).to(
        el,
        { x: exit.x, y: exit.y, width: rect.width, height: rect.height },
        0,
      );
    });

    return () => {
      tl.kill();
    };
  }, [hoveredSlot]);

  return (
    <div className={styles.experience} onMouseLeave={() => setHoveredSlot(null)}>
      <SpotlightContainer
        caseStudies={caseStudies}
        containerRef={containerRef}
        slotRefs={{ large: largeRef, topRight: topRightRef, bottomRight: bottomRightRef }}
        onSlotEnter={setHoveredSlot}
      />
    </div>
  );
}

/**
 * getExitTarget
 *
 * Where a non-hovered card slides to, so it clears the container's
 * clipped edge on the side that keeps the motion reading as "making
 * room for the expanding card" rather than two cards crossing paths:
 *
 *   hovered = large      → topRight exits RIGHT, bottomRight exits DOWN
 *   hovered = topRight    → large exits LEFT,     bottomRight exits DOWN
 *   hovered = bottomRight → large exits LEFT,      topRight exits UP
 *
 * Distance is derived from each card's own cached rest rect (not a
 * fixed pixel value), so it still clears the container correctly if
 * the frame's measured size changes between resize-triggered
 * re-measurements.
 */
function getExitTarget(
  slot: SpotlightSlot,
  hoveredSlot: SpotlightSlot,
  rect: Rect,
  containerWidth: number,
  containerHeight: number,
): { x: number; y: number } {
  if (hoveredSlot === "large") {
    if (slot === "topRight") return { x: containerWidth - rect.left, y: 0 };
    return { x: 0, y: containerHeight - rect.top }; // bottomRight
  }

  if (slot === "large") {
    // Large only ever exits left — it's the sole left-column card.
    return { x: -(rect.left + rect.width), y: 0 };
  }

  // `slot` is whichever of topRight/bottomRight ISN'T hoveredSlot.
  return hoveredSlot === "topRight"
    ? { x: 0, y: containerHeight - rect.top } // bottomRight exits down
    : { x: 0, y: -(rect.top + rect.height) }; // topRight exits up
}