import type { GradientProps } from "@/components/effects/Gradient";

export interface BlogGlowConfig {
  id?: string;
  kind?: GradientProps["kind"];
  angle?: string;
  stops: string[];
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size?: string;
  opacity?: number;
  blur?: string;
  blurMobile?: string;
  centerY?: boolean;
  centerX?: boolean;
}

export interface BlogPageGradientLayerProps {
  className?: string;
  leftGlows?: BlogGlowConfig[];
  rightGlows?: BlogGlowConfig[];
}
