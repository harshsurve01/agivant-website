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
export interface CaseStudyArticleHeroProps {
  /** Case study headline, e.g. "AI for Scalable Tech Support". */
  heading: string;
  /** Supporting paragraph beneath the heading. */
  description: string;
}
