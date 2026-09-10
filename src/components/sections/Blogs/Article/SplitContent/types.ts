export interface SplitContentMedia {
  src: string;
  alt?: string | null;
  width?: number;
  height?: number;
}

export interface SplitContentProps {
  /** Optional small label above the heading */
  eyebrow?: string | null;
  /** Complete section heading, e.g. "The Hidden Toll: The \"Coordination Cost\" of Building Digital Products" */
  title: string;
  /** Paragraph copy rendered inside the left side of the card */
  content: string | string[];
  /** Media asset rendered on the right side of the card */
  image?: SplitContentMedia | string | null;
  /** Which part of the heading receives the brand highlight: 'start', 'end', or 'colon'. Defaults to 'colon'. */
  highlightPosition?: "start" | "end" | "colon";
  /** Word count for the highlight if using 'start' or 'end'. Defaults to 3. */
  highlightCount?: number;
}
