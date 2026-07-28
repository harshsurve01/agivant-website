"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useGradientLayer } from "./GradientLayer";
import styles from "./Gradient.module.css";

export interface GradientProps {
  /** "radial" (glow blob, default) or "linear" (brand-gradient wash). */
  kind?: "radial" | "linear";
  /** CSS color stops, e.g. ["#8500df 0%", "#edbf79 55%", "transparent 75%"] */
  stops: string[];
  /** Angle for linear gradients only, e.g. "90deg". Ignored for radial. */
  angle?: string;
  /** Width & height of the blob, e.g. "45rem". */
  size: string;
  /** e.g. "80px". Default "80px". */
  blur?: string;
  /** Overrides `blur` below a 768px viewport width, e.g. "60px". */
  blurMobile?: string;
  /** 0–1. Default 0.25. */
  opacity?: number;
  /** Adds the same slow breathing scale/opacity pulse HeroBackground used. */
  animate?: "breathe" | "none";
  /** e.g. "-4s" — offsets the breathe cycle so multiple glows don't
   * pulse in lockstep. Only meaningful with animate="breathe". */
  animationDelay?: string;
  /** Shifts the glow left by 50% of its own width, so `left`/`right`
   * marks its horizontal CENTER instead of its edge (matches CSS
   * `transform: translateX(-50%)`). */
  centerX?: boolean;
  /** Shifts the glow up by 50% of its own height, so `top`/`bottom`
   * marks its vertical CENTER instead of its edge (matches CSS
   * `transform: translateY(-50%)`). */
  centerY?: boolean;

  /**
   * Position, expressed relative to wherever this <Gradient/> is
   * rendered in your JSX — same mental model as the old
   * ::before/::after `top/left/right/bottom` rules. You can use %,
   * rem, px, vw — anything CSS accepts.
   */
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

/**
 * Drop this inside ANY section, as many times as you like — one
 * section can have zero, one, or five of these. Each instance:
 *
 * 1. Renders an invisible zero-size marker exactly where you placed
 *    it (positioned via the same top/left/right/bottom props a
 *    ::before rule would've used, relative to the nearest positioned
 *    ancestor — usually the section itself).
 * 2. Measures that marker's real position on the full page.
 * 3. Portals the actual glow into the shared <GradientLayerProvider/>
 *    canvas at that page position — so it's never clipped by the
 *    section's own box and can visually bleed across section
 *    boundaries.
 *
 * Requires <GradientLayerProvider> to be mounted somewhere above it
 * in the tree (once, at the page/layout level).
 */
export function Gradient({
  kind = "radial",
  stops,
  angle = "90deg",
  size,
  blur = "80px",
  blurMobile,
  opacity = 0.25,
  animate = "none",
  animationDelay,
  centerX = false,
  centerY = false,
  top,
  left,
  right,
  bottom,
}: GradientProps) {
  const layerNode = useGradientLayer();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const measure = () => {
      const rect = anchor.getBoundingClientRect();
      setPos({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    };

    measure();

    // Re-measure whenever layout can shift: viewport resize, fonts or
    // images loading in, content above this point changing height.
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const background =
    kind === "radial"
      ? `radial-gradient(circle, ${stops.join(", ")})`
      : `linear-gradient(${angle}, ${stops.join(", ")})`;

  const translateX = centerX ? "-50%" : "0";
  const translateY = centerY ? "-50%" : "0";

  const glowStyle = pos
    ? ({
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width: size,
        height: size,
        background,
        opacity,
        transform:
          centerX || centerY ? `translate(${translateX}, ${translateY})` : undefined,
        animationDelay: animate === "breathe" ? animationDelay : undefined,
        // Consumed by .glow's `filter: blur(var(--gradient-blur))` —
        // set as custom properties (rather than inline `filter`) so
        // the max-width:768px rule in Gradient.module.css can swap in
        // --gradient-blur-mobile when provided.
        "--gradient-blur": blur,
        "--gradient-blur-mobile": blurMobile ?? blur,
      } as CSSProperties)
    : undefined;

  return (
    <>
      <span
        ref={anchorRef}
        aria-hidden="true"
        className={styles.marker}
        style={{ top, left, right, bottom }}
      />
      {layerNode &&
        pos &&
        createPortal(
          // NOTE: `animate="breathe"` sets `transform: scale(...)` via a
          // CSS keyframe, which will override the inline `translate(...)`
          // from centerX/centerY if both are used together. None of the
          // current call sites combine the two; revisit (e.g. move the
          // translate into a wrapper element) if that changes.
          <div
            className={
              animate === "breathe" ? `${styles.glow} ${styles.breathe}` : styles.glow
            }
            style={glowStyle}
          />,
          layerNode
        )}
    </>
  );
}
