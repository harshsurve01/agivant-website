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
  /** Primary (black) heading, e.g. "Prompt/tool telemetry". */
  primaryTitle: string;
  /** Primary body copy. */
  primaryDescription: string;
  /** Secondary (brand-purple) heading, e.g. "Standard Framework". */
  secondaryTitle: string;
  /** Secondary body copy. */
  secondaryDescription: string;
  /**
   * True only for the "Prompt/tool telemetry" card. The screenshot
   * shows that one primary heading underlined while the other three
   * cards' primary headings are not — no other visual difference
   * explains it (not a link, not a different card variant). Flagged
   * here as data rather than baked into the component's CSS so it
   * doesn't silently apply to every card, but this is very likely an
   * unintentional artifact in the source design worth confirming
   * against Figma once available, not a deliberate emphasis pattern.
   */
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
  eyebrow: string;
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
