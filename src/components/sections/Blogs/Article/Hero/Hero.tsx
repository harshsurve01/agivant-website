import { Fragment } from "react";
import clsx from "clsx";
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
  slug,
  ribbonPosition,
}: ArticleHeroProps) {
  const showRibbon =
    ribbonSrc !== null && slug !== "is-your-tech-sabotaging-business";
  const actualRibbonSrc = ribbonSrc ?? DEFAULT_BLOG_HERO_RIBBON;
  const actualHeight =
    ribbonHeight ?? (actualRibbonSrc.includes("page2") ? 520 : 395);

  const isRibbonTop =
    ribbonPosition === "top" ||
    slug === "what-makes-an-ai-agent-enterprise-grade" ||
    actualRibbonSrc.includes("what-makes-an-ai-agent");

  const renderTitle = () => {
    if (
      typeof title === "string" &&
      (title.includes("<br") || title.includes("\n"))
    ) {
      const parts = title.split(/<br\s*\/?>|\n/gi);
      return parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {part}
        </Fragment>
      ));
    }
    return title;
  };

  return (
    <section
      className={clsx(styles.hero, !showRibbon && styles.hero_noRibbon)}
      data-hero-interaction-root
    >
      {/* Decorative background only — identical usage to TechTalk/Blogs.
          `data-hero-interaction-root` is the pointer-tracking boundary
          HeroParticleField looks up via closest(), and must stay on an
          ancestor containing both HeroBackground and Content. */}
      <HeroBackground />

      {/* Decorative ribbon layer spanning across lower visual area */}
      {showRibbon && actualRibbonSrc && (
        <PageRibbon
          src={actualRibbonSrc}
          width={1440}
          height={actualHeight}
          className={clsx(
            styles.ribbonWrapper,
            isRibbonTop && styles.ribbonWrapper_top
          )}
          imageClassName={styles.ribbonImage}
          priority
        />
      )}

      {/* Content */}
      <Container className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>{renderTitle()}</h1>

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
