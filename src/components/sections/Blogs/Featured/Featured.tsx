import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icon/ArrowRight";
import { Gradient } from "@/components/effects/Gradient";
import type { FeaturedProps } from "./types";
import styles from "./Featured.module.css";

/**
 * Featured
 *
 * Renders the "Top Picks for You" section of the Blogs page: a
 * section title and one featured article glass card:
 * - Content / Text on the LEFT (meta row, title, excerpt, published date, CTA)
 * - Featured image on the RIGHT
 *
 * Uses explicit backdropFilter inline style alongside styles.card to ensure
 * Next.js/Turbopack CSS minification does not strip standard backdrop-filter.
 */
export function Featured({ title, article }: FeaturedProps) {
  const [firstWord, ...restWords] = title.split(" ");
  const rest = restWords.join(" ");

  return (
    <section className={styles.featured}>
      <Gradient
        top="18%"
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

        <article
          className={styles.card}
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          {/* Content / Metadata (LEFT) */}
          <div className={styles.content}>
            <div className={styles.meta}>
              <span className={styles.category}>{article.category}</span>
              <span className={styles.readTime}>{article.readTime}</span>
              <span className={styles.author}>By {article.author}</span>
            </div>

            <h3 className={styles.articleTitle}>
              <Link href={`/blogs/${article.slug}`}>{article.title}</Link>
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

          {/* Featured Image (RIGHT) */}
          <div className={styles.imageWrapper}>
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className={styles.image}
              priority
            />
          </div>
        </article>
      </Container>
    </section>
  );
}