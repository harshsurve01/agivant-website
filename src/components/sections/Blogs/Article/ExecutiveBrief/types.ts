/**
 * ExecutiveBriefProps
 *
 * Figma (node 2097:1282 "Executive Brief", 2097:1288 accent bar,
 * 2097:1290 body copy), inside "Blog Inside page" (node 2097:1214),
 * file 7pLktxswHgy5YvtLZXwsq0.
 */
export interface ExecutiveBriefProps {
  /** Optional HTML id for section anchor targeting. */
  id?: string;
  /**
   * Section heading, e.g. "Executive Brief". Figma renders the last
   * word in the brand highlight color — same two-tone treatment
   * Featured already applies to its own heading, just mirrored onto
   * the last word instead of the first (confirmed against the
   * Figma screenshot: "Executive" black, "Brief" purple). Kept as a
   * single plain string, not two fields, so a future WordPress
   * heading maps onto this prop with no shape changes; which word
   * gets highlighted is a presentational decision made inside
   * ExecutiveBrief.tsx.
   */
  title: string;
  /**
   * Body copy, one entry per paragraph. Figma's node 2097:1290 is a
   * single text layer containing two paragraphs (a blank line
   * between them) rather than two separate layers — modeled here as
   * an array so each paragraph renders as its own <p>, matching a
   * future WordPress rich-text field split on paragraph breaks.
   */
  paragraphs: string[];
  /** Whether to show the left vertical accent bar. Defaults to true. */
  showBar?: boolean;
  /** Section spacing variant: 'hero' (under-hero with large top padding) or 'standard' (standard section padding-block). Defaults to 'hero'. */
  spacing?: "hero" | "standard";
  /** Which part of the heading receives the brand highlight: 'start', 'end', 'colon', or 'period'. Defaults to 'end' (or 'colon' if title contains ':'). */
  highlightPosition?: "start" | "end" | "colon" | "period";
  /** Word count for the highlight if using 'start' or 'end'. */
  highlightCount?: number;
  /** Optional background decorative ribbon image URL. */
  ribbonSrc?: string | null;
  /** Optional scoped CSS class name for positioning the ribbon. */
  ribbonClassName?: string;
  /** Optional CTA button below body copy. */
  cta?: {
    label: string;
    href?: string | null;
    external?: boolean;
  } | null;
}

