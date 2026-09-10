import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import { PageRibbon } from "@/components/ui/PageRibbon";
import type { ArticleHeroProps } from "./types";
import styles from "./Hero.module.css";

const DEFAULT_BLOG_HERO_RIBBON = "/images/blogs/innerpages/hero-ribbon.png";

export function Hero({
  title,
  date,
  readTime,
  authors,
  ribbonSrc = DEFAULT_BLOG_HERO_RIBBON,
  ribbonHeight,
}: ArticleHeroProps) {
  const actualRibbonSrc = ribbonSrc || DEFAULT_BLOG_HERO_RIBBON;
  const actualHeight =
    ribbonHeight ?? (actualRibbonSrc.includes("page2") ? 520 : 395);

  return (
    <section className={styles.hero} data-hero-interaction-root>
      {/* Decorative background only — identical usage to TechTalk/Blogs.
          `data-hero-interaction-root` is the pointer-tracking boundary
          HeroParticleField looks up via closest(), and must stay on an
          ancestor containing both HeroBackground and Content. */}
      <HeroBackground />

      {/* Decorative ribbon layer spanning across lower visual area */}
      <PageRibbon
        src={actualRibbonSrc}
        width={1440}
        height={actualHeight}
        className={styles.ribbonWrapper}
        imageClassName={styles.ribbonImage}
        priority
      />

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
            <p className={styles.authorMeta}>
              <span className={styles.metaLabel}>Author: </span>
              {authors.map((author, index) => (
                <span key={author.name} className={styles.authorItem}>
                  {index > 0 && " | "}
                  {author.name}
                  {author.role ? `, ${author.role}` : ""}
                </span>
              ))}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
