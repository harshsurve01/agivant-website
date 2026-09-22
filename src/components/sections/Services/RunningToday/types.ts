import type { RunningTodayMetric } from "@/data/services";

export interface RunningTodayProps {
  /**
   * Section title (e.g. "Running Today, Across Enterprises").
   * Optional for pages that use an intro-only layout.
   */
  heading?: string | null;

  /**
   * Supporting subtitle/description text or section intro paragraph.
   */
  description?: string | null;

  /**
   * Array of metric blocks from JSON data.
   */
  metrics: RunningTodayMetric[];

  /**
   * Optional pill tags rendered beneath the metric cards (e.g. engineering teams).
   */
  tags?: string[];

  /**
   * Desktop grid column configuration.
   * "auto" (default) chooses 4 columns if metrics.length === 4, otherwise 3 columns.
   */
  columns?: 3 | 4 | "auto";

  /**
   * Optional wrapper class name override.
   */
  className?: string;

  /**
   * Whether to tint the final milestone card with lavender accent.
   * Default: true for 6 cards (landing page), false when 4 cards.
   */
  tintLastCard?: boolean;
}
