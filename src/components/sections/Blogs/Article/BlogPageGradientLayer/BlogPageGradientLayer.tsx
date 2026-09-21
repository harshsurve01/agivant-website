import clsx from "clsx";
import { Gradient } from "@/components/effects/Gradient";
import type { BlogGlowConfig, BlogPageGradientLayerProps } from "./types";
import styles from "./BlogPageGradientLayer.module.css";

/**
 * Canonical Agivant brand gradient presets adapted directly from Homepage usage:
 *
 * 1. LINEAR_SPECTRUM: Adapted from Homepage Trust (`Trust.tsx` lines 47-58) and AmpTransformation (`AmpTransformation.tsx` lines 67-76):
 *    - kind: "linear", angle: "180deg"
 *    - stops: ["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]
 *    - opacity: 0.20, blur: "90px", blurMobile: "50px"
 *
 * 2. WARM_GOLD_PEACH: Adapted from Homepage AIStack (`AIStack.tsx` lines 49-61) and AmpTransformation (`AmpTransformation.tsx` lines 77-88):
 *    - kind: "radial"
 *    - stops: ["color-mix(in srgb, #EDBF79 70%, transparent) 0%", "transparent 100%"]
 *    - opacity: 0.22, blur: "75px", blurMobile: "45px"
 *
 * 3. PURPLE_AMBER: Adapted from Homepage AIStack (`AIStack.tsx` lines 41-48) and Hero (`HeroBackground.tsx` lines 75-82):
 *    - kind: "radial"
 *    - stops: ["#8500df 50%", "#edbf79 85%", "transparent 100%"]
 *    - opacity: 0.16, blur: "80px", blurMobile: "45px"
 *
 * 4. SOFT_LAVENDER: Adapted from Homepage Partners (`Partners.tsx` lines 52-60) and Proof (`ProofSection.tsx` lines 46-63):
 *    - kind: "radial"
 *    - stops: ["color-mix(in srgb, #9d84f2 85%, transparent) 0%", "transparent 78%"]
 *    - opacity: 0.22, blur: "90px", blurMobile: "45px"
 */

const DEFAULT_LEFT_GLOWS: BlogGlowConfig[] = [
  // 1. Upper Left (~14% height, ExecutiveBrief / Phase 1 area): Warm Gold & Peach
  {
    id: "left-upper-gold",
    kind: "radial",
    top: "14%",
    left: "-12%",
    centerY: true,
    size: "clamp(380px, 38vw, 620px)",
    stops: [
      "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
      "transparent 100%",
    ],
    opacity: 0.22,
    blur: "75px",
    blurMobile: "45px",
  },
  // 2. Mid Left (~46% height, middle phases / table / pillars area): Brand Purple & Amber
  {
    id: "left-mid-purple",
    kind: "radial",
    top: "46%",
    left: "-14%",
    centerY: true,
    size: "clamp(380px, 38vw, 620px)",
    stops: ["#8500df 80%", "transparent 100%"],
    opacity: 0.1,
    blur: "80px",
    blurMobile: "45px",
  },
  // 3. Lower Left (~80% height, Conclusion / SplitContent area): Brand Linear Spectrum
  // This seamlessly bathes the Conclusion section without any section boundary clipping.
  {
    id: "left-lower-spectrum",
    kind: "linear",
    angle: "180deg",
    top: "80%",
    left: "-12%",
    centerY: true,
    size: "clamp(380px, 38vw, 620px)",
    stops: ["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"],
    opacity: 0.20,
    blur: "90px",
    blurMobile: "50px",
  }
];

const DEFAULT_RIGHT_GLOWS: BlogGlowConfig[] = [
  // 1. Upper Right (~28% height): Brand Linear Spectrum
  {
    id: "right-upper-spectrum",
    kind: "linear",
    angle: "180deg",
    top: "28%",
    right: "-12%",
    centerY: true,
    size: "clamp(380px, 38vw, 620px)",
    stops: ["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"],
    opacity: 0.18,
    blur: "90px",
    blurMobile: "50px",
  },
  // 2. Mid Right (~62% height): Soft Lavender & Violet
  {
    id: "right-mid-lavender",
    kind: "radial",
    top: "62%",
    right: "-12%",
    centerY: true,
    size: "clamp(380px, 38vw, 620px)",
    stops: [
      "color-mix(in srgb, #9d84f2 85%, transparent) 0%",
      "transparent 78%",
    ],
    opacity: 0.22,
    blur: "90px",
    blurMobile: "45px",
  },
  // 3. Lower Right (~92% height): Warm Gold & Peach
  {
    id: "right-lower-gold",
    kind: "radial",
    top: "92%",
    right: "-10%",
    centerY: true,
    size: "clamp(360px, 36vw, 600px)",
    stops: [
      "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
      "transparent 100%",
    ],
    opacity: 0.20,
    blur: "75px",
    blurMobile: "45px",
  },
];

/**
 * BlogPageGradientLayer
 *
 * Page/article-level continuous decorative gradient canvas.
 * - Spans the full height of the Blog Article (inset: 0, z-index: 0, pointer-events: none)
 * - Independent Left and Right rails provide bilateral visual balance
 * - Extends naturally across section boundaries with ZERO rectangular clipping
 * - Reuses canonical Agivant Homepage gradient stops, blur, and opacity language
 */
export function BlogPageGradientLayer({
  className,
  leftGlows = DEFAULT_LEFT_GLOWS,
  rightGlows = DEFAULT_RIGHT_GLOWS,
}: BlogPageGradientLayerProps) {
  return (
    <div
      className={clsx(styles.canvas, className)}
      aria-hidden="true"
      data-blog-gradient-canvas
    >
      {/* Left Rail Glows */}
      {leftGlows.map((glow, idx) => (
        <Gradient
          key={glow.id ?? `left-glow-${idx}`}
          portal={false}
          kind={glow.kind ?? "radial"}
          angle={glow.angle ?? "180deg"}
          top={glow.top}
          left={glow.left}
          bottom={glow.bottom}
          size={glow.size ?? "clamp(380px, 38vw, 620px)"}
          stops={glow.stops}
          opacity={glow.opacity ?? 0.2}
          blur={glow.blur ?? "80px"}
          blurMobile={glow.blurMobile ?? "45px"}
          centerY={glow.centerY ?? true}
          centerX={glow.centerX ?? false}
        />
      ))}

      {/* Right Rail Glows */}
      {rightGlows.map((glow, idx) => (
        <Gradient
          key={glow.id ?? `right-glow-${idx}`}
          portal={false}
          kind={glow.kind ?? "radial"}
          angle={glow.angle ?? "180deg"}
          top={glow.top}
          right={glow.right}
          bottom={glow.bottom}
          size={glow.size ?? "clamp(380px, 38vw, 620px)"}
          stops={glow.stops}
          opacity={glow.opacity ?? 0.2}
          blur={glow.blur ?? "80px"}
          blurMobile={glow.blurMobile ?? "45px"}
          centerY={glow.centerY ?? true}
          centerX={glow.centerX ?? false}
        />
      ))}
    </div>
  );
}
