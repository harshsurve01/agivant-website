import type { RunningTodayMetric } from "@/data/services";

export interface RunningTodayProps {
  /**
   * Section title (e.g. "Running Today, Across Enterprises")
   */
  heading: string;

  /**
   * Supporting subtitle/description text.
   */
  description?: string;

  /**
   * Array of 6 metric blocks from JSON data.
   */
  metrics: RunningTodayMetric[];

  /**
   * Optional wrapper class name override.
   */
  className?: string;

  /**
   * Whether to tint the final milestone card with lavender accent (default: true).
   */
  tintLastCard?: boolean;
}
