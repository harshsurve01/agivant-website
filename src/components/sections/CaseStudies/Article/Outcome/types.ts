/**
 * One numbered Outcome result.
 *
 * Split into `emphasis` (the purple/bold run) and `text` (the
 * supporting black run that follows it) because Figma renders each
 * result as two visually distinct text runs sharing one sentence, not
 * one uniformly colored block — e.g. item 1 is purple "A 100%
 * automated," immediately followed by black " scalable engine to
 * deliver forecast on demand." `text` is the remainder AFTER the
 * emphasized run, rendered with a leading space by OutcomeItem so the
 * two runs read as one continuous sentence.
 */
export interface OutcomeItem {
  /** Display index, e.g. "01". */
  index: string;
  /** The purple/bold text run. */
  emphasis: string;
  /** The supporting black text run that follows `emphasis`. */
  text: string;
}

/**
 * Props for the Outcome section (heading + 7-item, 3-column result
 * grid — 3/3/1, the last item centered under the middle column).
 */
export interface OutcomeProps {
  /** Section heading, e.g. "Outcome". */
  title: string;
  /** The 7 result items, in display order (row 1, row 2, then row 3). */
  items: OutcomeItem[];
}
