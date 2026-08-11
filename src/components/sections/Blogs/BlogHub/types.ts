/**
 * BlogHub type contracts.
 *
 * `id` fields are the stable values filtering/state logic compares
 * against; `label` fields are the display strings shown in the UI.
 * Keeping them separate lets a card's display tag ("MLOps &
 * Platforms") differ from its filterable topic name ("MLOps & AI
 * Operations") without any string-matching logic, and lets a future
 * headless-WordPress taxonomy slug drop straight into `id` without
 * a rename.
 */

/** A single selectable option in one of the three filter groups. */
export interface BlogFilterOption {
  id: string;
  label: string;
}

/**
 * One article row in the Blog List. Field names/shapes are chosen so
 * a headless-WordPress post query (title, excerpt, author, taxonomy
 * terms, ACF fields for read time/audience) maps onto this directly.
 */
export interface BlogHubArticle {
  slug: string;
  /** Must match one of `topics[].id` (excluding the "all" option). */
  topicId: string;
  /** Short badge label shown on the card, e.g. "MLOps & Platforms". */
  topicLabel: string;
  /** Must match one of `readTimeOptions[].id` (excluding "all"). */
  readTimeId: string;
  /** Full read-time string shown next to the clock icon, e.g. "4 min read". */
  readTimeLabel: string;
  /** Must match one of `audienceOptions[].id` (excluding "all"). */
  audienceId: string;
  /** Badge label shown on the card, e.g. "Technical Focus". */
  audienceLabel: string;
  title: string;
  excerpt: string;
  author: string;
  publishedDate: string;
  cta: {
    label: string;
    href: string;
  };
}

/**
 * Full data contract for the BlogHub section. BlogHub.tsx (the
 * client/state owner) receives this as props and derives filtered
 * results from `articles`; BlogFilters and BlogList each receive
 * only the slice they need.
 */
export interface BlogHubProps {
  /** Section heading, e.g. "Blog Hub". Two-tone styling (first word
   * highlighted) is a presentational decision made inside BlogHub.tsx,
   * same pattern as Featured's `title`. */
  heading: string;
  topics: BlogFilterOption[];
  readTimeOptions: BlogFilterOption[];
  audienceOptions: BlogFilterOption[];
  articles: BlogHubArticle[];
}

/** The "match everything" sentinel used by all three filter groups. */
export const ALL_FILTER_ID = "all";
