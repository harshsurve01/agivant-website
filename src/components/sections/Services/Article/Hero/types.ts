import type { StandardizedMediaObject } from "@/data/services";

/**
 * Props for the Service Single/Inner Page Hero (/services/[slug]).
 * Receives typed editorial and presentation data from the page layer,
 * backed by service-cloud-platform-engineering.json.
 */
export interface ServiceHeroProps {
  /**
   * Service page headline, supporting intentional <br> line breaks.
   * Example: "Cloud and platform engineering<br>that carries agentic AI at scale"
   */
  heading: string;

  /**
   * Optional supporting summary paragraph beneath the headline.
   * Nullable / omitted for heroes without description copy.
   */
  description?: string | null;

  /**
   * Service-specific hero ribbon media asset.
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
