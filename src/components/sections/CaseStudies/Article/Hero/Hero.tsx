import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import { PageRibbon } from "@/components/ui/PageRibbon";
import styles from "./Hero.module.css";
import type { CaseStudyArticleHeroProps } from "./types";

/**
 * Hero (Reusable Article / Inner Page Hero)
 *
 * Renders the article/inner page hero section:
 * - Shared HeroBackground (ambient visual gradients, interactive particle field, decorative ellipse)
 * - Heading (supports <br> for intentional line breaks) and description copy
 * - Optional bottom decorative ribbon (via PageRibbon)
 *
 * Server Component: all values arrive via props.
 * `data-hero-interaction-root` enables pointer tracking across the full Hero for HeroParticleField.
 */
export function Hero({ heading, description, media }: CaseStudyArticleHeroProps) {
  const lines =
    typeof heading === "string" && (heading.includes("<br") || heading.includes("\n"))
      ? heading.split(/<br\s*\/?>|\n/gi).map((line) => line.trim()).filter(Boolean)
      : null;

  return (
    <section className={styles.hero} data-hero-interaction-root>
      {/* Decorative background only */}
      <HeroBackground />

      {/* Decorative ribbon across bottom if provided */}
      {media?.src && (
        <PageRibbon
          src={media.src}
          width={1440}
          height={502}
          className={styles.ribbonWrapper}
          imageClassName={styles.ribbonImage}
          priority
        />
      )}

      {/* Content */}
      <Container className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>
            {lines
              ? lines.map((line, idx) => (
                  <span key={idx} className={styles.headingLine}>
                    {line}
                  </span>
                ))
              : heading}
          </h1>
          <p className={styles.description}>{description}</p>
        </div>
      </Container>
    </section>
  );
}
