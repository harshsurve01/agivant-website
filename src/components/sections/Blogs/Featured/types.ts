/**
 * Call-to-action rendered at the bottom-right of the featured card.
 */
export interface FeaturedArticleCta {
  label: string;
  href: string;
}

/**
 * The single article this section features. Field names line up
 * 1:1 with what a headless-WordPress "featured post" query will
 * eventually return, so swapping the mock data for a real fetch is
 * a source change only — not a shape change.
 */
export interface FeaturedArticle {
  slug: string;
  image: string;
  imageAlt: string;
  category: string;
  readTime: string;
  author: string;
  title: string;
  excerpt: string;
  publishedDate: string;
  cta: FeaturedArticleCta;
}

export interface FeaturedProps {
  /**
   * Plain section heading, e.g. "Top Picks for You". The two-tone
   * styling (first word in the brand highlight color) is a
   * presentational decision made inside Featured.tsx, not part of
   * the data — so a CMS can send this as an ordinary string field.
   */
  title: string;
  article: FeaturedArticle;
}