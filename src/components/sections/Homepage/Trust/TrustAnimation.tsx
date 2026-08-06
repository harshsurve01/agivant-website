"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TrustAnimationProps {
  totalCards: number;
  accentColors: string[];
}

// ---- depth constants (module scope: shared by the animated path and
// the static prefers-reduced-motion resting frame below) --------------
const MAX_DEPTH_STEPS = 6;
const DEPTH_SCALE_STEP = 0.06;
const DEPTH_Z_STEP = 20;
const DEPTH_Y_STEP = 30;
const DEPTH_BLUR_STEP = 2;
const DEPTH_BLUR_MAX = 12;
const DEPTH_OPACITY_STEP = 0.3;
const DEPTH_OPACITY_MIN = 0.12;

const EXIT_SCALE = 1;
const EXIT_Z = 260;
const EXIT_Y = -250;
const EXIT_ROTATION_X = -36;
// Fraction of the exit (0-1) the card spends at full opacity before it
// starts fading. y/z/rotation still move immediately at exitProgress
// 0 — only opacity is held back — so the card visibly peels away
// before it starts disappearing, instead of fading and moving at the
// same rate.
const EXIT_OPACITY_DELAY = 0.45;

const lerp = gsap.utils.interpolate;
const clamp01 = gsap.utils.clamp(0, 1);

const applyDepth = (el: HTMLElement, depth: number) => {
  const d = Math.min(depth, MAX_DEPTH_STEPS);
  gsap.set(el, {
    x: 0,
    y: depth * DEPTH_Y_STEP,
    z: -d * DEPTH_Z_STEP,
    scale: 1 - d * DEPTH_SCALE_STEP,
    opacity: Math.max(1 - depth * DEPTH_OPACITY_STEP, DEPTH_OPACITY_MIN),
    rotationX: 0,
    filter: `blur(${Math.min(depth * DEPTH_BLUR_STEP, DEPTH_BLUR_MAX)}px)`,
  });
};

const applyExit = (el: HTMLElement, exitProgress: number) => {
  const e = clamp01(exitProgress);
  // Opacity uses its own progress value, remapped so it stays at 0
  // (i.e. no fade yet) until e passes EXIT_OPACITY_DELAY, then ramps
  // 0 -> 1 over the remaining span. Transforms below still use e
  // directly and are unaffected by this delay.
  const opacityProgress = clamp01(
    (e - EXIT_OPACITY_DELAY) / (1 - EXIT_OPACITY_DELAY)
  );
  gsap.set(el, {
    x: 0,
    y: lerp(0, EXIT_Y, e),
    z: lerp(0, EXIT_Z, e),
    scale: lerp(1, EXIT_SCALE, e),
    opacity: lerp(1, 0, opacityProgress),
    rotationX: lerp(0, EXIT_ROTATION_X, e),
    filter: "blur(0px)",
  });
};

const hexToRgb = (hex: string) => {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

const mixColor = (a: string, b: string, t: number) => {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(lerp(ar, br, t), lerp(ag, bg, t), lerp(ab, bb, t));
};

/**
 * TrustAnimation
 *
 * The cinematic scroll-driven animation layer for the Trust stack.
 * Pin + 3D depth stack + peel-away transitions + ambient glow color +
 * progress-dot fill, all driven by ScrollTrigger progress. No cursor
 * tilt — the active card stays still until scrolled.
 *
 * This component is purely additive: it renders nothing, never touches
 * React state, never mounts/unmounts cards, and never changes markup
 * owned by Trust / TrustCard / TrustProgress. It locates the DOM nodes
 * those components already render — via the data-trust-* attributes
 * Trust.tsx exposes — and drives their transforms directly with GSAP,
 * scoped inside a gsap.context() so teardown is exhaustive.
 *
 * Everything is a pure function of ScrollTrigger progress (no timers,
 * no autoplay), so forward and backward scroll are automatically
 * frame-accurate and perfectly reversible.
 *
 * Required data-attributes (already present in Trust.tsx / TrustProgress.tsx):
 *   [data-trust-root]        the pinned <section>
 *   [data-trust-stack]       the grid stage all cards share
 *   [data-trust-stack-item]  one per card, with data-stack-index
 *   [data-trust-glow]        the ambient background layer
 *   [data-trust-progress]    the progress-dot wrapper
 *   [data-progress-dot]      one per dot, with data-progress-index
 */
export function TrustAnimation({ totalCards, accentColors }: TrustAnimationProps) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-trust-root]");
    const stack = document.querySelector<HTMLElement>("[data-trust-stack]");
    const glow = document.querySelector<HTMLElement>("[data-trust-glow]");
    const progressRoot = document.querySelector<HTMLElement>("[data-trust-progress]");

    if (!root || !stack || totalCards < 1) return;

    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-trust-stack-item]")
    ).sort((a, b) => Number(a.dataset.stackIndex) - Number(b.dataset.stackIndex));

    const dots = progressRoot
      ? Array.from(
          progressRoot.querySelectorAll<HTMLElement>("[data-progress-dot]")
        ).sort((a, b) => Number(a.dataset.progressIndex) - Number(b.dataset.progressIndex))
      : [];

    if (items.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ------------------------------------------------------------------
    // Reduced motion: no pin, no scroll-linked sequence. The stack
    // still reads as a stack — front card sharp, the rest peeking
    // behind it — it just never moves. This is the same resting frame
    // as the CSS fallback in Trust.module.css; setting it again here
    // just guarantees it even if JS re-runs after CSS was overridden.
    // ------------------------------------------------------------------
    if (reduceMotion) {
      items.forEach((el, i) => {
        applyDepth(el, i);
        el.style.zIndex = String(1000 - i * 10);
        el.style.pointerEvents = i === 0 ? "auto" : "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      let lastFrontIndex = -1;

      // continuous, stateless: given only the current scroll progress,
      // compute every card's transform. This is what makes reverse
      // scroll perfectly reconstruct the stack — there's no stored
      // "previous state" to get out of sync.
      const updateStack = (progress: number) => {
        const continuous = progress * (totalCards - 1);

        items.forEach((el, i) => {
          const relativeDepth = i - continuous;
          if (relativeDepth >= 0) {
            applyDepth(el, relativeDepth);
          } else {
            applyExit(el, -relativeDepth);
          }
          el.style.zIndex = String(Math.round(1000 - relativeDepth * 10));
        });

        const frontIndex = gsap.utils.clamp(0, totalCards - 1, Math.round(continuous));

        items.forEach((el, i) => {
          el.style.pointerEvents = i === frontIndex ? "auto" : "none";
        });

        if (glow) {
          const lower = Math.max(0, Math.min(totalCards - 1, Math.floor(continuous)));
          const upper = Math.min(totalCards - 1, lower + 1);
          const t = clamp01(continuous - lower);
          const color = mixColor(
            accentColors[lower] ?? accentColors[0],
            accentColors[upper] ?? accentColors[accentColors.length - 1],
            t
          );
          glow.style.setProperty("--trust-glow-color", color);
        }

         if (frontIndex !== lastFrontIndex) {
          dots.forEach((dot, i) => {
            if (i === frontIndex) {
              gsap.to(dot, {
                backgroundColor: "#8d8c8c",
                width: 12,
                height: 12,
                duration: 0.3,
              });
              gsap.fromTo(
                dot,
                { scale: 1 },
                { scale: 1.6, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }
              );
            } else {
              gsap.to(dot, {
                backgroundColor: "#cfc9c9",
                width: 8,
                height: 8,
                duration: 0.3,
              });
            }
          });
          lastFrontIndex = frontIndex;
        }
      };

      // paint the resting state before any scroll happens
      updateStack(0);

      const transitions = Math.max(totalCards - 1, 0);

      if (transitions > 0) {
        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: () => `+=${transitions * window.innerHeight}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => updateStack(self.progress),
        });
      }
    }, root);

    return () => {
      ctx.revert();
    };
  }, [totalCards, accentColors]);

  return null;
}