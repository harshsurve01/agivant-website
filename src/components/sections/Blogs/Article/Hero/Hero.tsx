import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import type { ArticleHeroProps } from "./types";
import styles from "./Hero.module.css";

/**
 * Hero (Blog Article)
 *
 * Renders the Blog Inner page's hero content only: article title, a
 * divider, and the date / read time / author(s) meta row. Figma:
 * "Blog header" (node 2097:1256) inside the "Blog Inside page" frame
 * (node 2097:1214).
 *
 * Reuses the exact same shared pieces as the TechTalk and Blogs Hero
 * — HeroBackground for every ambient visual (gradients, particle
 * field, decorative ellipse) and Container for width/centering.
 * Nothing about either is duplicated or reimplemented here, per the
 * "reuse the existing shared background" requirement — this file
 * only arranges its own content inside them, exactly like its two
 * siblings already do.
 *
 * The shared Header is NOT rendered here — same as TechTalk's and
 * Blogs' Hero, it's owned by the page/layout above this component,
 * not by the Hero itself.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no business logic, no data imports (see types.ts — `blogsPageData`
 * is never imported here). Every value arrives via props, so this
 * component is already shaped for a future WordPress-sourced article
 * object with zero changes required on this end.
 */
export function Hero({ title, date, readTime, authors }: ArticleHeroProps) {
  return (
    <section className={styles.hero} data-hero-interaction-root>
      {/* Decorative background only — identical usage to TechTalk/Blogs.
          `data-hero-interaction-root` is the pointer-tracking boundary
          HeroParticleField looks up via closest(), and must stay on an
          ancestor containing both HeroBackground and Content. */}
      <HeroBackground />

      {/* Content */}
      <Container className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>{title}</h1>

          {/* Figma node 2097:1271 — a plain divider line, not
              re-implemented as an image. Its own decorative ellipse
              stroke asset (node "Ellipse 2827" under the same "Bg"
              group) is the same artwork already rendered by the
              shared HeroBackground, so it isn't duplicated here. */}
          <hr className={styles.divider} aria-hidden="true" />

          <div className={styles.metaRow}>
            <div className={styles.metaPrimary}>
              <p className={styles.metaLine}>
                <span className={styles.metaLabel}>Date: </span>
                {date}
              </p>
              <p className={styles.metaLine}>
                <span className={styles.metaLabel}>Read Time: </span>
                {readTime}
              </p>
            </div>

            <div className={styles.metaAuthors}>
              <p className={styles.metaLabel}>Author:</p>
              <div className={styles.authorsList}>
                {authors.map((author) => (
                  <p key={author.name} className={styles.authorItem}>
                    {author.name},
                    <br />
                    {author.role}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
