"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useGradientLayer } from "./GradientLayer";
import styles from "./Gradient.module.css";

export interface GradientProps {
  /** "radial" (glow blob, default), "linear" (brand-gradient wash), or
   * "conic" (color sweep around the center — use with `donutHole` for
   * a ring/donut). */
  kind?: "radial" | "linear" | "conic";
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
  /** Punches a transparent hole in the middle, turning the blob into a
   * ring/donut. 0–1 as a fraction of the blob's radius that stays
   * hollow — e.g. 0.55 keeps the inner 55% empty, leaving a ring
   * filling the outer 45%. Works with any `kind`; pairs best with
   * `kind="conic"` so the hue sweep reads as a donut rather than a
   * single directional wash. Omit for a solid blob (default). */
  donutHole?: number;
  /** Width, in percentage points of the blob's radius, of the soft
   * transition at the hole's edge. The mask is applied AFTER `blur`
   * (per the CSS filter/mask order), so a razor-thin mask edge clips
   * the blur's soft halo and looks hard no matter how large `blur`
   * is. Bigger `donutFeather` = softer inner edge. Default 12. Only
   * used when `donutHole` is set. */
  donutFeather?: number;

  /** Whether to portal to the shared page-wide GradientLayer (default true). Set to false to render in-place inside a pinned section. */
  portal?: boolean;

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
  donutHole,
  donutFeather = 20,
  portal = true,
  top,
  left,
  right,
  bottom,
}: GradientProps) {
  const layerNode = useGradientLayer();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!portal) return;
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
      : kind === "conic"
      ? `conic-gradient(from ${angle}, ${stops.join(", ")})`
      : `linear-gradient(${angle}, ${stops.join(", ")})`;

  // donutHole punches the hole via a mask rather than the background
  // itself, so it composes with any `kind` (radial/linear/conic)
  // without touching the color stops. The transition is spread over
  // `donutFeather` percentage points (not a hard 1pt jump) because
  // mask is applied AFTER filter/blur — a sharp mask edge would clip
  // the blurred halo and look hard regardless of `blur`.
  const maskImage =
    donutHole != null
      ? `radial-gradient(circle, transparent ${Math.max(
          donutHole * 100 - donutFeather,
          0
        )}%, black ${donutHole * 100}%)`
      : undefined;

  const translateX = centerX ? "-50%" : "0";
  const translateY = centerY ? "-50%" : "0";

  if (!portal) {
    const localGlowStyle: CSSProperties = {
      position: "absolute",
      top: top ?? "auto",
      left: left ?? "auto",
      right: right ?? "auto",
      bottom: bottom ?? "auto",
      width: size,
      height: size,
      background,
      opacity,
      transform:
        centerX || centerY ? `translate(${translateX}, ${translateY})` : undefined,
      animationDelay: animate === "breathe" ? animationDelay : undefined,
      WebkitMaskImage: maskImage,
      maskImage,
      pointerEvents: "none",
      zIndex: 0,
      borderRadius: "9999px",
      "--gradient-blur": blur,
      "--gradient-blur-mobile": blurMobile ?? blur,
    } as CSSProperties;

    return (
      <div
        aria-hidden="true"
        className={
          animate === "breathe" ? `${styles.glow} ${styles.breathe}` : styles.glow
        }
        style={localGlowStyle}
      />
    );
  }

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
        WebkitMaskImage: maskImage,
        maskImage,
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