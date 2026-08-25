"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";

export interface UsePartnerCardHoverOptions {
  /** Maximum scale multiplier to ensure the circle covers the rectangular card diagonal. */
  maxScale?: number;
  /** Hover entrance duration in seconds (Purple Soil: 0.7s). */
  enterDuration?: number;
  /** Hover entrance easing (Purple Soil: power4.out). */
  enterEase?: string;
  /** Hover exit duration in seconds (Purple Soil: 0.55s). */
  leaveDuration?: number;
  /** Hover exit easing (Purple Soil: power3.out). */
  leaveEase?: string;
}

/**
 * usePartnerCardHover
 *
 * Reproduces the Purple Soil button hover interaction:
 * 1. Tracks cursor entry coordinates relative to the card (`--x`, `--y`).
 * 2. Expands a circular pseudo-element via GSAP animating `--scale` from 0 to `maxScale` (0.7s, power4.out).
 * 3. On mouseleave, updates `--x` and `--y` to the cursor's exit position and animates `--scale` back to 0 (0.55s, power3.out).
 * 4. Respects `prefers-reduced-motion` and handles keyboard focus/blur gracefully.
 */
export function usePartnerCardHover(
  ref: RefObject<HTMLElement | null>,
  {
    maxScale = 45,
    enterDuration = 0.7,
    enterEase = "power4.out",
    leaveDuration = 0.55,
    leaveEase = "power3.out",
  }: UsePartnerCardHoverOptions = {}
) {
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    reducedMotionRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleMouseEnter = (e: MouseEvent) => {
      gsap.killTweensOf(el);

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);

      if (reducedMotionRef.current) {
        el.style.setProperty("--scale", `${maxScale}`);
        return;
      }

      gsap.to(el, {
        "--scale": maxScale,
        duration: enterDuration,
        ease: enterEase,
        overwrite: true,
      });
    };

    const handleMouseLeave = (e: MouseEvent) => {
      gsap.killTweensOf(el);

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);

      if (reducedMotionRef.current) {
        el.style.setProperty("--scale", "0");
        return;
      }

      gsap.to(el, {
        "--scale": 0,
        duration: leaveDuration,
        ease: leaveEase,
        overwrite: true,
      });
    };

    const handleFocus = () => {
      gsap.killTweensOf(el);
      el.style.setProperty("--x", "50%");
      el.style.setProperty("--y", "50%");

      if (reducedMotionRef.current) {
        el.style.setProperty("--scale", `${maxScale}`);
        return;
      }

      gsap.to(el, {
        "--scale": maxScale,
        duration: enterDuration,
        ease: enterEase,
        overwrite: true,
      });
    };

    const handleBlur = () => {
      gsap.killTweensOf(el);

      if (reducedMotionRef.current) {
        el.style.setProperty("--scale", "0");
        return;
      }

      gsap.to(el, {
        "--scale": 0,
        duration: leaveDuration,
        ease: leaveEase,
        overwrite: true,
      });
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("focus", handleFocus);
    el.addEventListener("blur", handleBlur);

    return () => {
      gsap.killTweensOf(el);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("focus", handleFocus);
      el.removeEventListener("blur", handleBlur);
    };
  }, [ref, maxScale, enterDuration, enterEase, leaveDuration, leaveEase]);
}
