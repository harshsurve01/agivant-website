import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icon/ArrowRight";
import type { FeaturedProps } from "./types";
import styles from "./Featured.module.css";
import {Gradient} from "@/components/effects/Gradient";

/**
 * Featured
 *
 * Renders the "Top Picks for You" section of the Blogs page: a
 * section title and one featured article card (image, meta row,
 * title, excerpt, published date, CTA). Nothing else — no list, no
 * pagination, no BlogHub content.
 *
 * All copy — including the section title and the CTA label/href —
 * arrives via props. The component holds no content of its own, so
 * it is WordPress-ready without modification: only data/blogs.ts
 * changes when the mock `featured` object is swapped for a real
 * query result.
 *
 * `title` arrives as a plain string; the first word is highlighted
 * in the brand color as a purely presentational choice made here,
 * not something the data has to encode.
 *
 * Server Component: no "use client", no hooks, no state, no data
 * imports.
 */
export function Featured({ title, article }: FeaturedProps) {
  const [firstWord, ...restWords] = title.split(" ");
  const rest = restWords.join(" ");

  return (
    <section className={styles.featured}>
       <Gradient
        top="18 %"
        right="25%"
        size="45rem"
        stops={["#8500df 50%", "#edbf79 55%", "transparent 75%"]}
        opacity={0.15}
        blur="80px"
      />
      <Container>
        <h2 className={styles.title}>
          <span className={styles.highlight}>{firstWord}</span>
          {rest ? ` ${rest}` : ""}
        </h2>

        <article className={styles.card}>
          <div className={styles.imageWrapper}>
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className={styles.image}
              priority
            />
          </div>

          <div className={styles.content}>
            <div className={styles.meta}>
              <span className={styles.category}>{article.category}</span>
              <span className={styles.readTime}>{article.readTime}</span>
              <span className={styles.author}>By {article.author}</span>
            </div>

            <h3 className={styles.articleTitle}>
              <a href={`/blogs/${article.slug}`}>{article.title}</a>
            </h3>

            <p className={styles.excerpt}>{article.excerpt}</p>

            <hr className={styles.divider} />

            <div className={styles.footer}>
              <span className={styles.publishedDate}>
                Published: {article.publishedDate}
              </span>
              <Link href={article.cta.href} className={styles.cta}>
                <Button variant="outline" size="lg" rightIcon={<ArrowRight />}>
                  {article.cta.label}
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </Container>
    </section>
  );
}