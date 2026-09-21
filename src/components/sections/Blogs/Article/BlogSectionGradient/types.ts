/**
 * Types for BlogSectionGradient & BlogSectionWrapper
 */

export interface BlogGradientConfig {
  /** "radial" (ambient glow, default) or "linear" (brand gradient wash) */
  kind?: "radial" | "linear";
  /** Angle for linear gradients only, e.g. "180deg" or "135deg" */
  angle?: string;
  /** CSS color stops, matching Agivant brand language */
  stops: string[];
  /** Positioning relative to section */
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  centerX?: boolean;
  centerY?: boolean;
  /** Width & height of the glow */
  size: string;
  /** Opacity of the glow (0.15 - 0.25) */
  opacity: number;
  /** Filter blur */
  blur: string;
  /** Filter blur below 768px viewport width */
  blurMobile: string;
}

export interface BlogSectionGradientProps {
  /** Section index in the article (for alternating presets) */
  index: number;
  /** Section ID (e.g. "executive-brief", "baselines", "impact-table", "pillar-1") */
  sectionId: string;
  /** Optional custom gradient configuration override */
  config?: Partial<BlogGradientConfig>;
}

export interface BlogSectionWrapperProps {
  /** Unique section ID */
  sectionId: string;
  /** Section index in the article */
  index: number;
  /** The rendered section component */
  children: React.ReactNode;
  /** Optional additional class name */
  className?: string;
  /** Optional custom gradient configuration override */
  gradientConfig?: Partial<BlogGradientConfig>;
}
