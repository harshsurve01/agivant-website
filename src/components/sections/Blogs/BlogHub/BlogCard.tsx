import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icon/ArrowRight";
import { Clock } from "@/components/ui/Icon/Clock";
import type { BlogHubArticle } from "./types";
import styles from "./BlogCard.module.css";

export interface BlogCardProps {
  article: BlogHubArticle;
}

/**
 * BlogCard
 *
 * Renders a single blog list row: read time, topic/audience tags,
 * title, excerpt, author/published-date footer, and a "Read Article"
 * CTA. Pure presentation — receives one article's data through props
 * and holds no filtering state of its own (BlogHub owns that).
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function BlogCard({ article }: BlogCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.readTime}>
          <Clock className={styles.readTimeIcon} />
          {article.readTimeLabel}
        </span>
        <span className={styles.tag}>{article.topicLabel}</span>
        <span className={styles.tag}>{article.audienceLabel}</span>
      </div>

      <div className={styles.contentRow}>
        <div className={styles.textBlock}>
          <h3 className={styles.title}>
            <a href={`/blogs/${article.slug}`}>{article.title}</a>
          </h3>
          <p className={styles.excerpt}>{article.excerpt}</p>
        </div>

        <Link href={article.cta.href} className={styles.cta}>
          <Button variant="primary" size="lg" rightIcon={<ArrowRight />}>
            {article.cta.label}
          </Button>
        </Link>
      </div>

      <hr className={styles.divider} />

      <div className={styles.footer}>
        <span>By {article.author}</span>
        <span>Published: {article.publishedDate}</span>
      </div>
    </article>
  );
}