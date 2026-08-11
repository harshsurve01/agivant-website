import { BlogCard } from "./BlogCard";
import type { BlogHubArticle } from "./types";
import styles from "./BlogList.module.css";

export interface BlogListProps {
  articles: BlogHubArticle[];
}

/**
 * BlogList
 *
 * Renders the already-filtered articles inside a height-bounded,
 * internally-scrollable region — the section itself never grows as
 * more articles are added; the list scrolls instead. Pure
 * presentation: it receives `articles` (already filtered by BlogHub)
 * through props and holds no filtering state of its own.
 *
 * The scrollbar is rendered on the left, matching Figma, via the
 * standard CSS trick of setting `direction: rtl` on the scroll
 * container and `direction: ltr` on its content — this keeps the
 * native (and therefore fully accessible, keyboard- and
 * touch-scrollable) scrollbar, just relocated, rather than
 * reimplementing scrolling in JS.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function BlogList({ articles }: BlogListProps) {
  if (articles.length === 0) {
    return (
      <div className={styles.empty}>
        No articles match your filters. Try a different combination.
      </div>
    );
  }

  return (
    <div className={styles.scrollArea}>
      <div className={styles.cardsStack}>
        {articles.map((article) => (
          <BlogCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
