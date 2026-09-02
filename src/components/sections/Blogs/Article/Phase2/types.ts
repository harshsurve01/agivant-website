/**
 * Phase2Item
 *
 * One numbered entry in the Phase 2 list — a circular index badge
 * ("01"–"05") beside a bold title and a body paragraph. Modeled as a
 * flat list (see Phase2Props) rather than fixed item1..item5 fields,
 * same reasoning as Phase1Card, so the list can grow/shrink from a
 * future WordPress query with no shape changes to Phase2 itself.
 *
 * `index` is carried as data (not derived from array position) since
 * the source screenshot renders it as its own text node ("01", "02",
 * ...) rather than an auto-incrementing counter — keeps this
 * component correct even if a future CMS entry is inserted,
 * reordered, or removed without renumbering everything downstream.
 */
export interface Phase2Item {
  /** Badge number as shown, e.g. "01". Zero-padded per the design. */
  index: string;
  /** Item heading, e.g. "Difference-in-Differences (Diff-in-Diff)". */
  title: string;
  /** Body copy for this item. */
  description: string;
}

/**
 * Phase2Props
 *
 * Screenshot-sourced (live Figma MCP access was rate-limited on the
 * Starter plan for this task — see Phase2's own component doc
 * comment). Mirrors Phase1Props' shape (eyebrow / title / description
 * / list) since Phase 2 is visually the same "eyebrow + two-tone
 * heading + intro + repeating item" pattern already established by
 * Phase1, just with a numbered-list layout instead of a card grid.
 */
export interface Phase2Props {
  /** Small label above the heading, e.g. "Phase 2". */
  eyebrow?: string | null;
  /**
   * Section heading, e.g. "Running Proper Experiments". Unlike
   * Phase1/ExecutiveBrief (which highlight only the LAST word),
   * the source screenshot shows the FIRST word ("Running") in the
   * default text color and every word after it ("Proper
   * Experiments") in the brand highlight color — confirmed visually
   * across all three screenshots. Kept as a single plain string, the
   * split-point is a presentational decision made inside
   * Phase2.tsx, same pattern as the other two sections.
   */
  title: string;
  /** Intro copy beneath the heading. */
  description: string;
  /** The numbered items, rendered in order. */
  items: Phase2Item[];
}
