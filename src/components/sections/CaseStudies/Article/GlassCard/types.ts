import type { ReactNode } from "react";

export interface GlassCardProps {
  /** Card title rendered in Agivant purple (default variant) */
  title?: string;
  /** Body text / description of the card */
  description?: string;
  /** Optional custom icon node (defaults to target squircle badge) */
  icon?: ReactNode;
  /** Optional additional CSS class for layout-specific overrides */
  className?: string;
  /** Card variant (default: standard case study/databricks vertical card) */
  variant?: "default" | "benefit";
  /** Optional label next to icon badge (used in benefit variant) */
  label?: string;
  /** Optional highlighted stat/value in purple (used in benefit variant) */
  value?: string;
  /** Optional bottom artwork image (used in benefit variant) */
  image?: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  };
}
