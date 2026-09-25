export interface AmpdTimelineItem {
  id: string;
  number: string;
  title: string;
  description: string;
  /** Optional sub-heading shown first inside the expanded content. */
  subtitle?: string;
  /** Optional inline list shown after the description (e.g. tools used). */
  listItems?: string[];
}

export interface AmpdTimelineProps {
  heading?: string;
  items: AmpdTimelineItem[];
  className?: string;
  defaultActiveIndex?: number;
  /** Optional section id. */
  id?: string;
  /** Optional leading phrase of `heading` to highlight. Omitted = existing "The Amp'd" rule. */
  headingHighlight?: string;
  /** Optional intro paragraph below the heading. */
  description?: string;
  /** Optional label before each item's `listItems` (e.g. "Built with:"). */
  listLabel?: string;
}
