import type { ReactNode } from "react";

export interface GlassCardProps {
  /** Card title rendered in Agivant purple */
  title: string;
  /** Body text / description of the card */
  description: string;
  /** Optional custom icon node (defaults to target squircle badge) */
  icon?: ReactNode;
  /** Optional additional CSS class for layout-specific overrides */
  className?: string;
}
