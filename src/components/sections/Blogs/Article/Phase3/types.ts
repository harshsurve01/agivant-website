/**
 * Phase3Card
 *
 * One card in the Phase 3 2x2 grid. Deliberately NOT modeled after
 * Phase1Card/MetricCard's `references: []` shape — the screenshot
 * shows every card built from exactly two fixed blocks (a primary
 * black heading+body, a divider, then a secondary PURPLE
 * heading+body), not a variable-length list of same-styled
 * "Case Reference" entries the way Phase1's cards are. Modeling it
 * as two explicit fields is more accurate to what's actually on
 * screen than reusing Phase1's array-of-references shape would be.
 */
export interface Phase3Card {
  /** Card title, e.g. "Prompt/tool telemetry". In Figma, rendered in purple. */
  title?: string;
  /** Full card body copy. Rendered as a single continuous paragraph without dividers. */
  description?: string;
  /** Legacy primary heading, e.g. "Prompt/tool telemetry". */
  primaryTitle?: string;
  /** Legacy primary body copy. */
  primaryDescription?: string;
  /** Legacy secondary heading. */
  secondaryTitle?: string;
  /** Legacy secondary body copy. */
  secondaryDescription?: string;
  /** Legacy body fallback. */
  body?: string;
  /** Legacy underline flag. */
  primaryTitleUnderlined?: boolean;
}

/**
 * Phase3Props
 *
 * SOURCE: one PNG screenshot the user exported directly (Figma MCP
 * access was rate-limited for this whole task — see Phase3's own
 * component doc comment). No node IDs to cite.
 *
 * Shape mirrors Phase1Props/Phase2Props (eyebrow / title /
 * description / repeating items) since that's the established
 * pattern for every Article section so far — only `cards` differs
 * in internal shape to match what Phase 3's cards actually contain.
 */
export interface Phase3Props {
  /** Small label above the heading, e.g. "Phase 3". */
  eyebrow?: string | null;
  /**
   * Section heading, e.g. "End-to-End Instrumentation Strategy".
   * Same highlight convention as Phase2 (NOT Phase1/ExecutiveBrief's
   * "last word" rule): the FIRST word stays the default text color
   * and every word after it is rendered in the brand highlight
   * color — confirmed against the screenshot ("End-to-End" black,
   * "Instrumentation Strategy" purple). Kept as a single plain
   * string; the split point is a presentational decision made
   * inside Phase3.tsx, same as Phase2.
   */
  title: string;
  /** Intro copy beneath the heading. */
  description: string;
  /** The four instrumentation cards, rendered in a 2x2 grid, in order. */
  cards: Phase3Card[];
}
