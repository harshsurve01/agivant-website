/**
 * Types for Blog Detail Pages (/blogs/[slug]).
 *
 * Represents the JSON schema contract defined by the senior backend developer.
 * Content lives exclusively in JSON — this file defines schema types only without duplicated content.
 */

export interface BlogMediaObject {
  kind: "image" | "video" | "diagram" | "logo" | string;
  src: string | null;
  assetKey: string | null;
  alt: string | null;
  caption: string | null;
}

export interface BlogCTAObject {
  enabled: boolean;
  label: string | null;
  href: string | null;
  external: boolean;
}

export interface BlogSEO {
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogImage: string | null;
}

export interface BlogAuthor {
  name: string;
  role?: string | null;
}

export interface BlogHero {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  date?: string | null;
  readTime?: string | null;
  authors?: BlogAuthor[];
  partner?: unknown | null;
  media?: BlogMediaObject | null;
  primaryCta?: BlogCTAObject | null;
  secondaryCta?: BlogCTAObject | null;
}

export interface BlogSectionBlock {
  id: string;
  type: string;
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  description?: string | null;
  author?: string | null;
  role?: string | null;
  quote?: string | null;
  insteadLabel?: string | null;
  insteadText?: string | null;
  sayLabel?: string | null;
  sayText?: string | null;
  media?: BlogMediaObject | null;
  cta?: BlogCTAObject | null;
  items?: string[];
  columns?: string[];
  rows?: string[][];
  index?: string | number | null;
  number?: number | null;
  [key: string]: unknown;
}

export interface BlogSectionData {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  emphasis?: string | null;
  columns?: unknown[];
  media?: BlogMediaObject | null;
  cta?: BlogCTAObject | null;
  primaryCta?: BlogCTAObject | null;
  secondaryCta?: BlogCTAObject | null;
  quote?: string | null;
  [key: string]: unknown;
}

export interface BlogSection {
  id: string;
  type:
    | "rich_text"
    | "card_grid"
    | "numbered_list"
    | "split_content"
    | "comparison_table"
    | string;
  enabled: boolean;
  conditions?: Record<string, unknown> | null;
  data: BlogSectionData;
  blocks: BlogSectionBlock[];
}

export interface BlogFooterCTA {
  enabled: boolean;
  heading: string;
  subheading: string | null;
  partner?: unknown | null;
  primaryCta?: BlogCTAObject | null;
  secondaryCta?: BlogCTAObject | null;
}

export interface BlogThumbnail {
  media: BlogMediaObject;
}

export interface BlogDetailPage {
  schemaVersion: "1.0" | string;
  pageType: "blog";
  slug: string;
  title: string;
  seo: BlogSEO;
  hero: BlogHero;
  thumbnail?: BlogThumbnail | null;
  category?: string | null;
  topic?: string | null;
  topicLabel?: string | null;
  readTime?: string | null;
  readTimeId?: string | null;
  targetAudience?: string | null;
  audienceLabel?: string | null;
  sections: BlogSection[];
  footerCta?: BlogFooterCTA;
  showFooter?: boolean;
}
