/**
 * Phase1CardReference
 *
 * One "Case Reference" (or "Case Reference A" / "Case Reference B")
 * entry inside a metric card. Figma renders a specific run of words
 * inside `text` in a bold/dark weight (e.g. the tool or company name)
 * — that inline emphasis isn't captured here (see Phase1's own
 * component doc comment for why), so `text` renders as one plain
 * paragraph for now.
 */
export interface Phase1CardReference {
  /** e.g. "Case Reference", "Case Reference A", "Case Reference B". */
  label: string;
  /** The case study copy itself. */
  text: string;
}

/**
 * Phase1Card
 *
 * One metric card in the Phase 1 grid. Figma: "Time on Task", "Error
 * Rates", "Rework Required", "Quality-Adjusted Task Minutes" (nodes
 * 2097:1302, 2097:1306, 2097:1304, 2097:1308). Modeled as a flat
 * list — not fixed `cardA`/`cardB`/... fields — so the grid can grow
 * or shrink from a future WordPress query with no shape changes to
 * Phase1 itself.
 */
export interface Phase1Card {
  /** Card heading, e.g. "Time on Task". */
  title: string;
  /** Card body copy. */
  description: string;
  /**
   * Optional case references.
   */
  references?: Phase1CardReference[] | null;
}

export interface Phase1Props {
  /** Small label above the heading, e.g. "Phase 1". */
  eyebrow?: string | null;
  /** Section heading, e.g. "Establishing Baselines". */
  title: string;
  /** Optional intro copy beneath the heading. */
  description?: string | null;
  /** The metric cards, rendered in order. */
  cards: Phase1Card[];
}
