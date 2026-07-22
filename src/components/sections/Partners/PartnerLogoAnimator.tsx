// PartnerLogoAnimator.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { LogoShift } from "./LogoShift";
import type { PartnerLogo } from "@/data/partners";

interface PartnerLogoAnimatorProps {
  logos: PartnerLogo[];
  /** +1 moves the belt leftward, -1 moves it rightward. */
  direction: 1 | -1;
  trackClassName: string;
  slotClassName: string;
}

// Constant belt speed (px/sec) rather than a fixed duration, so every
// row travels at the same *visual* speed no matter how wide its
// rendered sequence ends up being.
const PIXELS_PER_SECOND = 800;
// Within the spec's 40–60ms neighbour-to-neighbour reveal stagger.
const STAGGER_MS = 450;

/**
 * PartnerLogoAnimator ("InfiniteLogoStrip")
 *
 * One continuous conveyor-belt row. This is the ONLY thing in the
 * section that moves under animation — a single GSAP tween on the
 * track element. Individual logos never translate independently;
 * PartnerLogoShift below only ever toggles a static reveal state.
 *
 * SEAMLESS LOOP: `logos` (the shared, single source-of-truth array
 * from data/partners.ts) is rendered twice back-to-back — purely a
 * rendering technique, never written back to the data layer. With
 * two identical copies side by side, animating the track exactly
 * -50% (one copy's width) means the pixels on screen the instant
 * before repeat === the pixels on screen the instant after. Combined
 * with a linear ("none") ease and repeat: -1, the belt never
 * decelerates, snaps, or visibly resets.
 *
 * DIRECTION: both directions reuse the same 0 <-> -50% loop, just
 * run in opposite senses, so leftward and rightward rows are equally
 * seamless.
 *
 * ACCESSIBILITY: the second (duplicate) copy of the sequence is
 * marked aria-hidden — it's a visual-only loop artifact, not new
 * content, so it shouldn't be announced twice.
 */
export function PartnerLogoAnimator({
  logos,
  direction,
  trackClassName,
  slotClassName,
}: PartnerLogoAnimatorProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const sequence = useMemo(() => [...logos, ...logos], [logos]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || logos.length === 0) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // CSS also hard-disables the transform as a second guard — see
    // the @media block in PartnerLogoStrip.module.css.
    if (reducedMotion) return;

    // scrollWidth covers the full duplicated track; half of it is
    // exactly one copy's rendered width.
    const halfWidth = track.scrollWidth / 2;
    const duration = halfWidth / PIXELS_PER_SECOND;

    if (direction === 1) {
      gsap.set(track, { xPercent: 0 });
      tweenRef.current = gsap.to(track, {
        xPercent: -50,
        duration,
        ease: "none",
        repeat: -1,
      });
    } else {
      gsap.set(track, { xPercent: -50 });
      tweenRef.current = gsap.to(track, {
        xPercent: 0,
        duration,
        ease: "none",
        repeat: -1,
      });
    }

    return () => {
      tweenRef.current?.kill();
    };
  }, [logos, direction]);

  return (
    <div ref={trackRef} className={trackClassName}>
      {sequence.map((logo, index) => {
        const isDuplicate = index >= logos.length;
        return (
          <div
            key={`${logo.id}-${index}`}
            className={slotClassName}
            aria-hidden={isDuplicate || undefined}
          >
            <LogoShift
              pair={[logo, logo]} // same logo twice, just for the reveal animation
              initialDelayMs={0}
              holdMs={STAGGER_MS * 0.8} // slightly less than the stagger so the next logo starts revealing before this one is fully revealed
              durationMs={STAGGER_MS * 0.2} // slightly more than the stagger so the next logo starts revealing before this one is fully revealed
              ease="power1.inOut"
            
            />
          </div>
        );
      })}
    </div>
  );
}