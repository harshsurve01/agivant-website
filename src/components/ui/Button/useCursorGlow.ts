"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * useCursorGlow
 *
 * Layer 2 of the Button Motion System — position only. Mirrors the
 * original PHP button.js's bgPos/bgXTo/bgYTo pattern exactly: a plain
 * proxy object tweened by `gsap.quickTo`, with `onUpdate` writing the
 * result into `--glow-x`/`--glow-y`, which ButtonMotion.module.css's
 * `.glow` radial-gradient reads. Using a proxy (rather than tweening
 * the custom property directly) keeps the value a plain percentage
 * number GSAP can quickTo cheaply, same as the reference.
 *
 * Opacity is intentionally NOT handled here. It used to be a CSS
 * `:hover` transition living on its own clock; that made it possible
 * for the glow to fade in/out slightly out of step with the rolling
 * text, icon, and shadow. Opacity now lives inside ButtonMotion's
 * single coordinated hover timeline (see playHover in
 * ButtonMotion.tsx), so every layer starts and eases together.
 *
 * Reduced motion: skips creating the quickTo instances and attaching
 * the listener entirely — the glow overlay stays in the DOM but never
 * receives a position, and its opacity tween never fires from
 * ButtonMotion either (see reducedMotionRef there).
 */
export function useCursorGlow(ref: React.RefObject<HTMLElement | null>) {
  const quickToX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickToY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const glow = { x: 80, y: 80 };

    quickToX.current = gsap.quickTo(glow, "x", {
      duration: 0.35,
      ease: "power2.out",
      onUpdate: () => el!.style.setProperty("--glow-x", `${glow.x}%`),
    });
    quickToY.current = gsap.quickTo(glow, "y", {
      duration: 0.55,
      ease: "power2.out",
      onUpdate: () => el!.style.setProperty("--glow-y", `${glow.y}%`),
    });

    function handlePointerMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      quickToX.current?.(x);
      quickToY.current?.(y);
    }

    el.addEventListener("pointermove", handlePointerMove);
    return () => el.removeEventListener("pointermove", handlePointerMove);
  }, [ref]);
}