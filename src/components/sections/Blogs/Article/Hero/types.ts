/**
 * ArticleHeroAuthor
 *
 * One byline entry. Figma (node 2097:1273) shows exactly two side by
 * side for the current mock article, but modeled as an array rather
 * than fixed `author1`/`author2` props so a future WordPress article
 * with one author — or more than two — maps onto this shape with no
 * changes to ArticleHero itself.
 */
export interface ArticleHeroAuthor {
  /** Author's display name. */
  name: string;
  /** Author's role/title, rendered on its own line beneath the name. */
  role: string;
}

export interface ArticleHeroProps {
  /**
   * Full article title. A single string, wrapped by the browser —
   * Figma's three visual lines are just the 64px heading wrapping
   * within its own max-width, not authored line breaks (unlike the
   * Blogs page hero's `heading`, which does encode an intentional
   * `\n`). Keeping this as one field matches a WordPress post title
   * with zero shape changes.
   */
  title: string;
  /** Publish date, already formatted as display copy (e.g. "21st September 2025"). */
  date: string;
  /** Read time, already formatted as display copy (e.g. "4 mins"). */
  readTime: string;
  /** One or more bylines, rendered left-to-right in Figma's order. */
  authors: ArticleHeroAuthor[];
}
