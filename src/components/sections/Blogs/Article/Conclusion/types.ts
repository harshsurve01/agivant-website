/**
 * ConclusionProps
 *
 * SOURCE: connected Figma MCP could not be reached this task (same
 * rate-limit condition noted by Phase2/Phase3/Phase4) — no node IDs
 * to cite. Built from the screenshot shared directly in the
 * conversation, cross-checked against the plain-text Conclusion copy
 * also provided (they matched, so no discrepancy to report). All
 * spacing/sizing in Conclusion.module.css is an ESTIMATE, matched to
 * the closest existing token / the closest established Article
 * section convention, flagged inline.
 */
export interface ConclusionProps {
  /** Section heading, e.g. "Conclusion". No two-tone split in the
   * screenshot — the whole word renders in the default text color,
   * unlike ExecutiveBrief/Phase2/Phase3/Phase4's highlighted-word
   * headings. */
  title: string;
  /** Body copy, one entry per paragraph, rendered above the quote
   * callout. Same array-of-paragraphs shape ExecutiveBrief already
   * uses for its own two-paragraph body, for the same reason: a
   * future WordPress rich-text field split on paragraph breaks maps
   * onto this with no shape change. */
  paragraphs: string[];
  /** The highlighted quote/callout text rendered in the card below
   * the paragraphs. Single string, not an array — the screenshot
   * shows one continuous italic quote, not multiple. */
  quote: string;
}
