"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SpotlightContainer, type SpotlightSlot } from "./SpotlightContainer";
import type { CaseStudy } from "@/data/proof";
import styles from "./SpotlightExperience.module.css";

interface SpotlightExperienceProps {
  caseStudies: CaseStudy[];
}

/** The container's grid split, expressed as fr-unit numbers rather
 *  than percentages. `grid-template-columns`/`grid-template-rows`
 *  normalize each pair of tracks against their own combined total —
 *  what a pair of fr values produces on screen is entirely about the
 *  RATIO between the two numbers, not their absolute size — so these
 *  don't need to sum to anything in particular; see HOVER_FR/OTHER_FR
 *  below for the ratio this interaction actually uses. */
interface GridState {
  colLarge: number;
  colRight: number;
  rowTop: number;
  rowBottom: number;
}

const REST: GridState = { colLarge: 1, colRight: 1, rowTop: 1, rowBottom: 1 };

/** HOVER_FR / OTHER_FR — the two fr values a pair of tracks animates
 *  between. At 1.175 / 0.85, a pair's hovered track ends up ~15.7%
 *  above its 50/50 rest share and the compressed track ~15.8% below
 *  it (1.175 / (1.175 + 0.85) ≈ 0.5799), which lands inside the
 *  spec's "hovered +15–20%, other −10–15%" range without hardcoding
 *  percentages that would fight the fr-normalization math above.
 *  Tune these two constants together to make the effect more or less
 *  dramatic — everything else derives from them. */
const HOVER_FR = 1.45;
const OTHER_FR = 0.5;

const ANIMATION_DURATION = 0.55; // 450–600ms range
const ANIMATION_EASE = "cubic-bezier(.22,.61,.36,1)";

/**
 * SpotlightExperience
 *
 * The section's only Client Component, and the owner of the
 * hover-driven "bento spotlight" interaction: which slot is hovered
 * (React state) and the grid-track tween that reacts to it
 * (imperative, DOM-direct, via a ref straight onto the container
 * SpotlightContainer renders). SpotlightContainer keeps owning the
 * grid's rest-state layout, slot placement, and sizing;
 * SpotlightCard stays presentational.
 *
 * REDISTRIBUTION, NOT EXPANSION
 * Hovering a slot animates the CONTAINER's own `grid-template-
 * columns` / `grid-template-rows` between REST and a fixed hover
 * split (see GridState/HOVER_FR/OTHER_FR above) — never a card's own
 * width, height, transform, or position. Every card is `width: 100%;
 * height: 100%` inside its slot (SpotlightCard.module.css's `.card`),
 * so a card only ever resizes because the grid TRACK underneath it
 * resized. That's what keeps the container's own box permanently
 * fixed (SpotlightContainer.module.css's `aspect-ratio: 824 / 648`
 * never changes) and guarantees the two tracks in a pair always sum
 * back to that fixed size — there's no "steal space from the other
 * card" step that can run away and crush one card, because the
 * hovered/compressed ratio is a constant (HOVER_FR/OTHER_FR), not a
 * function of how much room is left over.
 *
 * WHY A TWEENED JS OBJECT, NOT A CSS TRANSITION
 * Animating `grid-template-columns`/`rows` via a plain CSS transition
 * isn't reliably supported across browsers. Tweening a plain
 * {colLarge, colRight, rowTop, rowBottom} object with GSAP and
 * writing the interpolated fr values to the container's inline style
 * on every tick (`onUpdate`) gets smooth, easing-controlled
 * interpolation everywhere GSAP runs, independent of the browser's
 * native grid-animation support.
 *
 * WHY THE STATE OBJECT LIVES IN A REF, NOT RECREATED PER HOVER
 * `gridStateRef` is the SAME object across every hover change, and
 * each new tween targets it directly. That means moving the pointer
 * from one card straight to another (a re-hover with no mouse-leave
 * in between) starts its tween from wherever the in-flight values
 * currently are, not from REST — the grid re-targets smoothly instead
 * of snapping back to 1fr/1fr and then back out again on every
 * switch.
 *
 * WHY MOUSE-LEAVE LIVES ON THE OUTER WRAPPER, NOT PER-SLOT
 * Individual slots only report onMouseEnter. Moving the pointer
 * directly from one card to an adjacent one never fires a "leave" in
 * between (the pointer stays inside .experience the whole time), so
 * hovering across the grid re-targets smoothly without a flash back
 * to REST. The reset to `null` only fires when the pointer leaves the
 * spotlight area entirely.
 *
 * BREAKPOINT GATE
 * Mirrors SpotlightContainer.module.css's `@media (max-width:
 * 1024px)`, where the grid collapses to a single stacked column and
 * there's no column/row split left to animate. The hover effect below
 * checks the viewport before starting a tween; a separate effect
 * watches for the breakpoint being crossed mid-hover and clears any
 * inline `grid-template-*` left behind, so mobile always falls back
 * to the CSS-authored single-column layout untouched.
 */
export function SpotlightExperience({ caseStudies }: SpotlightExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // The single, persistent tween target — see "WHY THE STATE OBJECT
  // LIVES IN A REF" above.
  const gridStateRef = useRef<GridState>({ ...REST });

  const [hoveredSlot, setHoveredSlot] = useState<SpotlightSlot | null>(null);

  // Tween the grid split whenever the hovered slot changes.
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    // Below 1025px the grid is a single stacked column (see
    // SpotlightContainer.module.css) — there's no split to animate,
    // so skip rather than write inline grid-template-* that would
    // fight the mobile layout.
    if (!window.matchMedia("(min-width: 1025px)").matches) return;

    const target = getGridTarget(hoveredSlot);

    const tween = gsap.to(gridStateRef.current, {
      ...target,
      duration: ANIMATION_DURATION,
      ease: ANIMATION_EASE,
      onUpdate: () => {
        const state = gridStateRef.current;
        containerEl.style.gridTemplateColumns = `${state.colLarge}fr ${state.colRight}fr`;
        containerEl.style.gridTemplateRows = `${state.rowTop}fr ${state.rowBottom}fr`;
      },
    });

    return () => {
      tween.kill();
    };
  }, [hoveredSlot]);

  // If the viewport crosses below the breakpoint mid-hover (window
  // resize, devtools, orientation change), clear any inline
  // grid-template-* left behind and drop hover state, so the
  // CSS-authored single-column mobile layout always wins and nothing
  // tries to re-animate back once the viewport widens again.
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const mql = window.matchMedia("(max-width: 1024px)");

    const handleChange = (event: MediaQueryList | MediaQueryListEvent) => {
      if (!event.matches) return;
      containerEl.style.gridTemplateColumns = "";
      containerEl.style.gridTemplateRows = "";
      gridStateRef.current = { ...REST };
      setHoveredSlot(null);
    };

    handleChange(mql);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className={styles.experience} onMouseLeave={() => setHoveredSlot(null)}>
      <SpotlightContainer
        caseStudies={caseStudies}
        containerRef={containerRef}
        onSlotEnter={setHoveredSlot}
      />
    </div>
  );
}

/**
 * getGridTarget
 *
 * The single source of truth for the container's target grid split
 * for a given hovered slot. Two independent pairs, each mirroring one
 * of the spec's Layout Rules:
 *
 *   COLUMN pair (colLarge vs. colRight) — moves off 1:1 whenever ANY
 *   slot is hovered: hovering `large` makes colLarge the HOVER_FR
 *   track; hovering `topRight` OR `bottomRight` makes colRight the
 *   HOVER_FR track instead, since both right-column cards live in
 *   that one shared track — hovering either one grows the whole
 *   column together, which is exactly "right column expands, left
 *   column shrinks" from the spec, expressed as one grid track
 *   instead of two independently-sized elements.
 *
 *   ROW pair (rowTop vs. rowBottom) — only moves off 1:1 when
 *   `topRight` or `bottomRight` is hovered. Hovering `large` leaves
 *   this pair at REST ("the two right cards remain stacked and equal
 *   height" per the spec), since `large` spans both rows regardless
 *   of the row split — there's no separate "large row" to grow.
 */
function getGridTarget(hoveredSlot: SpotlightSlot | null): GridState {
  if (hoveredSlot === "large") {
    return { colLarge: HOVER_FR, colRight: OTHER_FR, rowTop: 1, rowBottom: 1 };
  }

  if (hoveredSlot === "topRight") {
    return {
      colLarge: OTHER_FR,
      colRight: HOVER_FR,
      rowTop: HOVER_FR,
      rowBottom: OTHER_FR,
    };
  }

  if (hoveredSlot === "bottomRight") {
    return {
      colLarge: OTHER_FR,
      colRight: HOVER_FR,
      rowTop: OTHER_FR,
      rowBottom: HOVER_FR,
    };
  }

  return { ...REST };
}