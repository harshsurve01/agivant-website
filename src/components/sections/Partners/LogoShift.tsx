// LogoShift.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PartnerLogo } from "./PartnerLogo";
import type { PartnerLogoPair } from "@/data/partners";
import styles from "./LogoShift.module.css";

interface LogoShiftProps {
  /** The two logos this instance holds. Fixed for the instance's
   *  lifetime — LogoShift swaps which of the two is at rest, it
   *  never introduces a third. */
  pair: PartnerLogoPair;
  /** One-time delay (ms) before this instance's first transition.
   *  This is the entire stagger mechanism for a "wave" across
   *  multiple instances placed side by side — after the first cycle,
   *  each instance free-runs on its own hold/duration cadence with no
   *  further coordination between instances. */
  initialDelayMs?: number;
  /** How long the resting logo stays fully visible before the next
   *  transition begins. */
  holdMs?: number;
  /** Length of the swap transition itself. */
  durationMs?: number;
  /** GSAP ease for the swap. No bounce/spring — calm and premium. */
  ease?: string;
}

const DEFAULT_HOLD_MS = 2500;
const DEFAULT_DURATION_MS = 600; // within the 500–700ms spec
const DEFAULT_EASE = "power3.out";
const TRANSLATE_PX = 20;
const BLUR_PX = 2;

/**
 * LogoShift
 *
 * Holds exactly one logo pair and swaps between them forever. Two
 * layers (layerA, layerB) are both permanently mounted — never
 * conditionally added/removed — one always "at rest" (visible) and
 * the other always "parked" (invisible, waiting below), with which
 * role belongs to which layer toggling every cycle.
 *
 * Every cycle runs a fixed three-stage loop:
 *
 * 1. REST — the active layer sits at y:0, opacity:1, no blur. The
 *    parked layer sits at y:+20px (below, out of view via the slot's
 *    overflow:hidden), opacity:0, blurred. Nothing animates here;
 *    this is simply the state both layers hold between cycles.
 *
 * 2. TRANSITION — on a timer, both layers animate simultaneously in
 *    one GSAP timeline: the resting layer lifts up and fades out
 *    (y:0→-20px, opacity:1→0, blur:0→2px) while the parked layer
 *    rises into view (y:+20px→0, opacity:0→1, blur:2px→0). Because
 *    both run on the same timeline at the same start position, there
 *    is never a frame with neither logo visible.
 *
 * 3. RESET (silent) — the instant the transition timeline completes,
 *    the layer that just exited is now fully invisible (opacity:0)
 *    sitting above the slot (y:-20px). Before anything is scheduled
 *    to move again, it's snapped — via gsap.set, no animation, no
 *    visible motion since it's invisible — back down to the parked
 *    position (y:+20px) it needs to be in to rise from "below" again
 *    next cycle. Skipping this step is exactly what causes a visible
 *    jump/reset: without it, the next transition would have that
 *    layer rising from *above* the slot instead of below, breaking
 *    the "always rises from below" motion the very next time it's
 *    used. Doing it while opacity is 0 is what makes the loop
 *    genuinely seamless rather than just mostly seamless.
 *
 * The slot itself (this component's root) never moves or resizes —
 * only the two layers inside it translate/fade/blur, and they're
 * clipped by the slot's overflow:hidden so neither can ever become
 * visible outside its bounds.
 */
export function LogoShift({
  pair,
  initialDelayMs = 0,
  holdMs = DEFAULT_HOLD_MS,
  durationMs = DEFAULT_DURATION_MS,
  ease = DEFAULT_EASE,
}: LogoShiftProps) {
  const [logoA, logoB] = pair;
  const [activeIsA, setActiveIsA] = useState(true);

  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>(0);
  const activeIsARef = useRef(true);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    activeIsARef.current = activeIsA;
  }, [activeIsA]);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  // Warm the browser cache for both logos up front. Only whichever
  // logo starts "at rest" is guaranteed to already be visible on
  // mount; the parked one otherwise wouldn't start loading until the
  // moment it's animated in, which is exactly the kind of load delay
  // that shows up as a blank slot mid-transition.
  useEffect(() => {
    [logoA, logoB].forEach((logo) => {
      const img = new window.Image();
      img.src = logo.image.src;
    });
  }, [logoA, logoB]);

  // Stage 1 (REST), set once on mount: layerA starts at rest,
  // layerB starts parked below.
  useEffect(() => {
    const layerAEl = layerARef.current;
    const layerBEl = layerBRef.current;
    if (!layerAEl || !layerBEl) return;

    gsap.set(layerAEl, { y: 0, opacity: 1, filter: "blur(0px)" });
    gsap.set(layerBEl, {
      y: TRANSLATE_PX,
      opacity: 0,
      filter: `blur(${BLUR_PX}px)`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial rest state only
  }, []);

  useEffect(() => {
    if (logoA.id === logoB.id) return; // nothing to swap between
    if (reducedMotionRef.current) return; // stay on layerA, static

    function runCycle() {
      const restEl = activeIsARef.current
        ? layerARef.current
        : layerBRef.current;
      const parkedEl = activeIsARef.current
        ? layerBRef.current
        : layerARef.current;
      if (!restEl || !parkedEl) return;

      // Stage 2: TRANSITION — both layers move together, one
      // timeline, same start position, so there's never a gap.
      const tl = gsap.timeline({
        onComplete: () => {
          // Stage 3: RESET — silently park the layer that just left,
          // while it's still invisible, so it's ready to rise from
          // below again whenever it's this pair's turn next.
          gsap.set(restEl, {
            y: TRANSLATE_PX,
            opacity: 0,
            filter: `blur(${BLUR_PX}px)`,
          });
          setActiveIsA((prev) => !prev);
          timerRef.current = window.setTimeout(runCycle, holdMs);
        },
      });

      tl.to(
        restEl,
        {
          y: -TRANSLATE_PX,
          opacity: 0,
          filter: `blur(${BLUR_PX}px)`,
          duration: durationMs / 1000,
          ease,
        },
        0
      ).to(
        parkedEl,
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: durationMs / 1000,
          ease,
        },
        0
      );
    }

    timerRef.current = window.setTimeout(runCycle, initialDelayMs + holdMs);

    return () => window.clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- self-scheduling loop, deps intentionally fixed at mount
  }, []);

  // `activeIsA` already exists for scheduling (see runCycle above) —
  // reusing it here as PartnerLogo's `active` gate means the
  // currently-invisible, parked copy's link is never a tab stop or
  // announced (see PartnerLogo.tsx's doc comment on that prop), with
  // no extra state: the same toggle that flips which layer animates
  // in next also flips which one's link is reachable.
  return (
    <div className={styles.slot}>
      <div ref={layerARef} className={styles.layer}>
        <PartnerLogo logo={logoA} active={activeIsA} />
      </div>
      <div ref={layerBRef} className={styles.layer}>
        <PartnerLogo logo={logoB} active={!activeIsA} />
      </div>
    </div>
  );
}