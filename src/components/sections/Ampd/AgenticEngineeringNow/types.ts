import type { StandardizedMediaObject } from "@/data/services";

/** One statistic card (standard `metric` block: value + label). */
export interface AgenticEngineeringMetric {
  id: string;
  value: string;
  label: string;
}

export interface AgenticEngineeringNowProps {
  /** Section id (anchor). */
  id?: string;
  /** Section heading; `<br>` marks the forced line break. The first line
   *  renders in brand purple, the rest in black. */
  heading: string;
  /** Large supporting statement under the heading. */
  description?: string | null;
  /** Smaller body paragraph under the statement. */
  body?: string | null;
  /** Statistic cards, in reading order (left column, right column, …). */
  metrics: AgenticEngineeringMetric[];
  /** Optional decorative ribbon behind the section (rendered via PageRibbon). */
  ribbon?: StandardizedMediaObject | null;
  /** Page-level class for scoped overrides. */
  className?: string;
}
