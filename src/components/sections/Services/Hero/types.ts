import type { StandardizedCTAObject, StandardizedMediaObject } from "@/data/services";

export interface ServicesHeroProps {
  /**
   * Main hero title, supporting intentional <br> line breaks.
   * Example: "500+ agents in production.<br>Every one started as a<br>data problem."
   */
  title: string;

  /**
   * Supporting summary paragraph beneath the heading.
   */
  summary: string;

  /**
   * Primary call-to-action button configuration.
   */
  primaryCta?: StandardizedCTAObject | null;

  /**
   * Decorative hero ribbon media asset.
   */
  media?: StandardizedMediaObject | null;

  /**
   * Optional container class name for page-level overrides.
   */
  className?: string;

  /**
   * Optional ribbon class name for page-level positioning overrides.
   */
  ribbonClassName?: string;
}
