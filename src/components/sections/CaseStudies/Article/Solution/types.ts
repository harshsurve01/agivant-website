/**
 * Props for the Solution section (heading + a grid of card items).
 *
 * Matches the brief's suggested shape exactly — Figma's five card
 * frames (nodes 2100:2147, 2100:2155, 2100:2151, 2100:2164, 2100:2160)
 * each contain nothing but one block of body copy between two
 * decorative lines, so `items: string[]` alone covers them; no card
 * has its own heading, icon, or secondary field.
 */
export interface SolutionProps {
  /** Section heading, e.g. "Solution". */
  title: string;
  /** Card copy, in display order (3 on row one, 2 on row two). */
  items: string[];
}
