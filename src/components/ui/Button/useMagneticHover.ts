"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export interface UseMagneticHoverOptions {
  /** Maximum translation, in px, applied at the edge of the button's own box. */
  strength?: number;
  /** quickTo duration — how quickly the pull catches up to the pointer. */
  duration?: number;
  /** quickTo ease — same curve as the rolling text, so the pull and the
   * label read as one gesture rather than two differently-timed ones. */
  ease?: string;
}

/**
 * useMagneticHover
 *
 * Layer 1 of the Button Motion System. GSAP is now the interaction
 * engine end-to-end — this hook reproduces the original PHP
 * button.js's magnetic pull exactly: two `gsap.quickTo` instances on
 * the wrapper's x/y, driven by the cursor's position *within* the
 * button's own bounding box (not a radius/falloff field), so the pull
 * is continuous across the whole surface and the "spring-like return"
 * on mouseleave comes from quickTo's own eased catch-up — no rAF loop,
 * no hand-rolled lerp, no --magnet-x/--magnet-y custom properties.
 *
 * Reduced motion: bails out before creating the quickTo instances or
 * attaching any listener, so a reduced-motion user's button never
 * receives a transform at all — identical contract to the previous
 * rAF implementation.
 */
export function useMagneticHover(
  ref: React.RefObject<HTMLElement | null>,
  { strength = 6, duration = 0.5, ease = "power3.out" }: UseMagneticHoverOptions = {},
) {
  const quickToX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickToY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    quickToX.current = gsap.quickTo(el, "x", { duration, ease });
    quickToY.current = gsap.quickTo(el, "y", { duration, ease });

    function handlePointerMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = event.clientX - rect.left;
      const relY = event.clientY - rect.top;
      const offsetX = (relX / rect.width - 0.5) * 2 * strength;
      const offsetY = (relY / rect.height - 0.5) * 2 * strength;
      quickToX.current?.(offsetX);
      quickToY.current?.(offsetY);
    }

    function handlePointerLeave() {
      quickToX.current?.(0);
      quickToY.current?.(0);
    }

    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [ref, strength, duration, ease]);
}