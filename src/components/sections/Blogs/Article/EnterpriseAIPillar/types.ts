/**
 * Types for EnterpriseAIPillar component.
 *
 * Represents one of the "6 Pillars of Enterprise-Grade AI" sections in Blog Page 3.
 */

export interface PillarCardContent {
  label?: string;
  content?: string;
  items?: string[];
  ribbonSrc?: string | null;
  ribbonAlt?: string;
}

export interface EnterpriseAIPillarProps {
  id?: string;
  sectionTitle?: string | null;
  title: string;
  problemLayout?: "split" | "full";
  problem: PillarCardContent;
  whyItMatters?: PillarCardContent | null;
  implementation: PillarCardContent;
  pov: PillarCardContent;
  className?: string;
}
