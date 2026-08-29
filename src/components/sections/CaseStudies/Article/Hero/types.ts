/**
 * Props for the Case Study Inner Page Hero.
 *
 * Deliberately just heading + description — Figma's "Case Study
 * Inside Page" hero frame shows no eyebrow, no divider, no meta row,
 * and no CTA/search inside the hero itself (unlike the Blogs Article
 * Hero's title/date/readTime/authors, or the Case Studies Hub Hero's
 * heading/description/search). Matches the two fields visible in the
 * reference screenshot and nothing else, so no field here is invented
 * ahead of what the design shows.
 */
export interface HeroMedia {
  kind?: string;
  src?: string | null;
  assetKey?: string | null;
  alt?: string | null;
  caption?: string | null;
}

export interface CaseStudyArticleHeroProps {
  /** Page or article headline, e.g. "AI for Scalable Tech Support" or with <br> breaks. */
  heading: string;
  /** Supporting paragraph beneath the heading. */
  description: string;
  /** Optional hero ribbon / decorative media asset. */
  media?: HeroMedia | null;
}
