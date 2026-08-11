/**
 * CaseStudy
 *
 * One case-study card in Phase 4. Figma/screenshot shows a fixed
 * "before/after" framing per card — a title + metric label header
 * row, then a two-column body ("Instead of saying:" vs "Say:"),
 * then a divider and closing explanation sentence inside the right
 * column only. Modeled as one flat shape (not nested left/right
 * objects) since every field maps 1:1 to a single visible text node
 * in the screenshot — nesting wouldn't add clarity here.
 */
export interface CaseStudy {
  /** Card header, e.g. "CASE STUDY: KPMG AUDITING". */
  title: string;
  /** Small muted label at the top-right of the header row, e.g. "Annualized Hours". */
  metricLabel: string;
  /** Left-column label, e.g. "Instead of saying:". */
  insteadLabel: string;
  /** Left-column quoted body text. */
  insteadText: string;
  /** Right-column label, e.g. "Say:". */
  sayLabel: string;
  /** Right-column quoted body text. */
  sayText: string;
  /**
   * Closing sentence beneath the divider inside the right column
   * only — the left column has no equivalent, confirmed against the
   * screenshot (the divider + explanation sit under "Say:", not
   * spanning the full card width).
   */
  explanation: string;
}

/**
 * Phase4Props
 *
 * SOURCE: one PNG screenshot the user exported directly (Figma MCP
 * access was rate-limited for this whole task, same as Phase2/3 — no
 * node IDs to cite).
 */
export interface Phase4Props {
  /** Small label above the heading, e.g. "Phase 4". */
  eyebrow: string;
  /**
   * Section heading, e.g. "Reporting in CFO Language". Highlight
   * split point here is NOT the same rule as Phase2/Phase3 (first
   * word plain, rest purple) — the screenshot shows the first TWO
   * words ("Reporting in") plain and the remaining two ("CFO
   * Language") purple. The whole heading is also underlined in the
   * screenshot, unlike every prior section's heading — both
   * decisions are made presentationally inside Phase4.tsx, not
   * encoded here, consistent with how every other section's title
   * split is handled.
   */
  title: string;
  /** Regular-weight intro paragraph beneath the heading. */
  description: string;
  /**
   * Second, bold-weight paragraph beneath `description`. Screenshot
   * shows this as a visually distinct (bold) block, not a second
   * item in a `paragraphs` array the way ExecutiveBrief models
   * multi-paragraph body copy — kept as its own field since it has
   * its own weight treatment.
   */
  emphasis: string;
  /** The three case-study cards, rendered in order. */
  caseStudies: CaseStudy[];
}
