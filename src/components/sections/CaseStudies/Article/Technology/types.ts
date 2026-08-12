/**
 * Props for the Technology section (heading + comma-separated tech
 * list + a separate "Anaplan for productivity modelling" line).
 *
 * Matches the brief's suggested shape exactly. `technologies` is kept
 * as a single pre-joined string (not `string[]`) because the Figma
 * source node is itself one text run — "Azure Data Factory, Azure
 * Databricks, ... H2O" — with no per-item structure (no bullets, no
 * separate list items to map array entries onto), and `additionalText`
 * covers the visually distinct "Anaplan for productivity modelling"
 * line beneath it.
 */
export interface TechnologyProps {
  /** Section heading, e.g. "Technology". */
  title: string;
  /** Comma-separated technology list, as one text run. */
  technologies: string;
  /** Secondary line below the technology list, e.g. Anaplan credit. */
  additionalText: string;
}
