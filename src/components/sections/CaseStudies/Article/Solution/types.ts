export interface SolutionCardData {
  text: string;
  ribbon?: string;
}

export type SolutionItemInput = string | SolutionCardData;

/**
 * Props for the Solution section (heading + a grid of card items).
 */
export interface SolutionProps {
  /** Section heading, e.g. "Solution". */
  title: string;
  /** Card copy + optional ribbon image in display order. */
  items: SolutionItemInput[];
}
