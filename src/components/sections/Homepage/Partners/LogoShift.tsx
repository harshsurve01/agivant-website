// LogoShift.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PartnerLogo } from "./PartnerLogo";
import type { PartnerLogo as PartnerLogoType } from "@/data/partners";
import styles from "./LogoShift.module.css";

interface LogoShiftProps {
  /** The logos this instance cycles through, in order, forever. A
   *  two-logo pair (the original design) is just the length-2 case
   *  of this — LogoShift walks the sequence one step at a time,
   *  wrapping back to the start after the last entry, so a slot can
   *  hold 2, 3, or more logos with no change to this component. The
   *  sequence is fixed for the instance's lifetime. */
  logos: PartnerLogoType[];
  /** One-time delay (ms) before this instance's first transition.
   *  This is the entire stagger mechanism for a "wave" across
   *  multiple instances placed side by side — after the first cycle,
   *  each instance free-runs on its own hold/duration cadence with no
   *  further coordination between instances. */
  initialDelayMs?: number;
  /** How long the resting logo stays fully visible before the next
   *  transition begins. Either one number applied to every logo in
   *  the sequence (the original behavior — all logos in this slot
   *  get equal time), or an array indexed 1:1 with `logos`, so an
   *  individual logo can hold longer or shorter than its
   *  slot-mates — e.g. give a newly-added logo more time without
   *  changing how long the others in the same slot are shown. An
   *  array shorter than `logos` wraps (index % array.length). */
  holdMs?: number | number[];
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
 * Holds a sequence of 2+ logos and steps through them forever, one at
 * a time, wrapping to the start after the last. Two layers (layerA,
 * layerB) are both permanently mounted — never conditionally
 * added/removed — one always "at rest" (visible) and the other
 * always "parked" (invisible, waiting below), with which role
 * belongs to which layer toggling every cycle, exactly as before.
 *
 * What's new vs. the fixed-pair version: each layer's *content* can
 * change between cycles instead of being permanently bound to one of
 * two logos. Layer A ends up showing every even-indexed logo in the
 * sequence (0, 2, 4, ...) and layer B every odd-indexed one (1, 3,
 * 5, ...), so with exactly 2 logos this collapses back to the
 * original "swap between these two" behavior unchanged.
 *
 * Every cycle runs the same fixed three-stage loop as before:
 *
 * 1. REST — the active layer sits at y:0, opacity:1, no blur. The
 *    parked layer sits at y:+20px (below, out of view via the slot's
 *    overflow:hidden), opacity:0, blurred.
 *
 * 2. TRANSITION — on a timer, both layers animate simultaneously in
 *    one GSAP timeline: the resting layer lifts up and fades out
 *    while the parked layer rises into view. Same start position on
 *    the same timeline, so there's never a frame with neither logo
 *    visible.
 *
 * 3. RESET (silent) — the instant the transition completes, the
 *    layer that just exited is fully invisible, sitting above the
 *    slot. While it's invisible we do two things at once, silently:
 *    snap it back down to the parked position (as before), AND swap
 *    which logo it's holding to whichever one is two steps ahead in
 *    the sequence — i.e. the logo that won't be revealed until the
 *    cycle *after* next. That's what lets a layer cycle through more
 *    than one logo over time: by the time it's this layer's turn to
 *    rise again, it's already showing the right upcoming logo.
 *
 * The slot itself (this component's root) never moves or resizes —
 * only the two layers inside it translate/fade/blur, clipped by the
 * slot's overflow:hidden.
 */
export function LogoShift({
  logos,
  initialDelayMs = 0,
  holdMs = DEFAULT_HOLD_MS,
  durationMs = DEFAULT_DURATION_MS,
  ease = DEFAULT_EASE,
}: LogoShiftProps) {
  const [layerALogo, setLayerALogo] = useState<PartnerLogoType>(() => logos[0]);
  const [layerBLogo, setLayerBLogo] = useState<PartnerLogoType>(
    () => logos[1 % logos.length]
  );
  const [activeIsA, setActiveIsA] = useState(true);

  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>(0);
  const activeIsARef = useRef(true);
  const reducedMotionRef = useRef(false);
  // Index into `logos` of whichever logo is currently at rest. Drives
  // which logo gets loaded into a layer during its silent reset, and
  // which hold duration applies to it (see resolveHoldMs below).
  const restIndexRef = useRef(0);

  // A specific logo's own hold time, if `holdMs` was given as an
  // array; otherwise the single shared value for every logo in this
  // slot. Read fresh each time it's needed rather than captured in
  // the mount-only effect below, so changing the prop takes effect
  // on the next scheduled cycle.
  const holdMsRef = useRef(holdMs);
  useEffect(() => {
    holdMsRef.current = holdMs;
  }, [holdMs]);

  function resolveHoldMs(logoIndex: number): number {
    const h = holdMsRef.current;
    if (Array.isArray(h)) {
      return h.length > 0 ? h[logoIndex % h.length] : DEFAULT_HOLD_MS;
    }
    return h;
  }

  useEffect(() => {
    activeIsARef.current = activeIsA;
  }, [activeIsA]);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  // Warm the browser cache for every logo in the sequence up front —
  // same reasoning as before, just no longer limited to 2 logos.
  useEffect(() => {
    logos.forEach((logo) => {
      const img = new window.Image();
      img.src = logo.image.src;
    });
  }, [logos]);

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
    // Nothing to cycle between: fewer than 2 logos, or every entry
    // is the same logo (e.g. PartnerLogoAnimator's reveal-only use).
    const allSameLogo = logos.every((logo) => logo.id === logos[0].id);
    if (logos.length < 2 || allSameLogo) return;
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
          // while it's still invisible, and load it with whichever
          // logo is two steps ahead in the sequence, so it's ready
          // to rise from below with the right content next time it's
          // this layer's turn.
          const upcomingIndex = (restIndexRef.current + 2) % logos.length;
          const upcomingLogo = logos[upcomingIndex];
          if (activeIsARef.current) {
            setLayerALogo(upcomingLogo);
          } else {
            setLayerBLogo(upcomingLogo);
          }

          gsap.set(restEl, {
            y: TRANSLATE_PX,
            opacity: 0,
            filter: `blur(${BLUR_PX}px)`,
          });
          restIndexRef.current = (restIndexRef.current + 1) % logos.length;
          setActiveIsA((prev) => !prev);
          // The logo now at rest holds for its own duration — either
          // the slot's shared holdMs, or its individual entry if
          // holdMs was given as an array.
          timerRef.current = window.setTimeout(
            runCycle,
            resolveHoldMs(restIndexRef.current)
          );
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

    timerRef.current = window.setTimeout(
      runCycle,
      initialDelayMs + resolveHoldMs(0)
    );

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
        <PartnerLogo logo={layerALogo} active={activeIsA} />
      </div>
      <div ref={layerBRef} className={styles.layer}>
        <PartnerLogo logo={layerBLogo} active={!activeIsA} />
      </div>
    </div>
  );
}