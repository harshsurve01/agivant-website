import { Gradient } from "@/components/effects/Gradient";
import type { BlogGradientConfig, BlogSectionGradientProps } from "./types";
import styles from "./BlogSectionGradient.module.css";

/**
 * Curated Agivant brand gradient presets derived from the Homepage design language.
 * Alternates position (right/left), color harmony (warm gold, lavender, purple, linear spectrum),
 * and dimensions across sections to provide natural visual rhythm without monotony.
 */
const BLOG_GRADIENT_PRESETS: BlogGradientConfig[] = [
  // Preset 0: Top-right warm gold & peach ambient glow
  {
    kind: "radial",
    top: "5%",
    right: "25%",
    size: "clamp(360px, 40vw, 620px)",
    stops: [
      "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
      "transparent 75%",
    ],
    opacity: 0.22,
    blur: "85px",
    blurMobile: "50px",
  },
  // Preset 1: Center-left brand linear spectrum
  {
    kind: "linear",
    angle: "180deg",
    top: "35%",
    left: "-16%",
    centerY: true,
    size: "clamp(340px, 36vw, 560px)",
    stops: ["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"],
    opacity: 0.16,
    blur: "90px",
    blurMobile: "50px",
  },
  // Preset 2: Center-right soft lavender & violet glow
  {
    kind: "radial",
    top: "40%",
    right: "18%",
    centerY: true,
    size: "clamp(360px, 38vw, 580px)",
    stops: [
      "color-mix(in srgb, #9d84f2 85%, transparent) 0%",
      "transparent 78%",
    ],
    opacity: 0.10,
    blur: "85px",
    blurMobile: "50px",
  },
  // Preset 3: Top-left brand purple & gold glow
  {
    kind: "radial",
    top: "8%",
    left: "-18%",
    size: "clamp(340px, 36vw, 550px)",
    stops: ["#8500df 85%", "transparent 100%"],
    opacity: 0.15,
    blur: "80px",
    blurMobile: "45px",
  },
  // Preset 4: Bottom-right warm gold & peach glow
  {
    kind: "radial",
    bottom: "8%",
    right: "26%",
    size: "clamp(350px, 38vw, 560px)",
    stops: [
      "color-mix(in srgb, #EDBF79 65%, transparent) 0%",
      "transparent 75%",
    ],
    opacity: 0.20,
    blur: "80px",
    blurMobile: "50px",
  },
  // Preset 5: Center-left angled brand spectrum
  {
    kind: "linear",
    angle: "135deg",
    top: "30%",
    left: "-13%",
    centerY: true,
    size: "clamp(320px, 35vw, 520px)",
    stops: ["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"],
    opacity: 0.15,
    blur: "90px",
    blurMobile: "50px",
  },
];

/**
 * BlogSectionGradient
 *
 * Renders an in-place, contained decorative gradient layer behind a Blog section.
 * - portal={false} ensures the glow is rendered directly inside the section's wrapper
 * - contained by .gradientContainer with overflow: clip to guarantee zero bleed across section boundaries
 * - pointer-events: none ensures zero interaction interference
 * - z-index: 0 ensures it always paints behind section text, glass cards, and tables
 */
export function BlogSectionGradient({
  index,
  sectionId,
  config: customConfig,
}: BlogSectionGradientProps) {
  const baseConfig = BLOG_GRADIENT_PRESETS[index % BLOG_GRADIENT_PRESETS.length];
  const config = { ...baseConfig, ...customConfig };

  return (
    <div className={styles.gradientContainer} aria-hidden="true">
      <Gradient
        portal={false}
        kind={config.kind ?? "radial"}
        angle={config.angle}
        stops={config.stops}
        top={config.top}
        bottom={config.bottom}
        left={config.left}
        right={config.right}
        centerX={config.centerX}
        centerY={config.centerY}
        size={config.size}
        opacity={config.opacity}
        blur={config.blur}
        blurMobile={config.blurMobile}
        animate="none"
      />
    </div>
  );
}
