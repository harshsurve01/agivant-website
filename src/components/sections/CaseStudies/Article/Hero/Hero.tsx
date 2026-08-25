import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import styles from "./Hero.module.css";
import type { CaseStudyArticleHeroProps } from "./types";

/**
 * Hero (Case Study Inner Page)
 *
 * Renders the Case Study article page's hero section:
 * - Shared HeroBackground (ambient visual gradients, interactive particle field, decorative ellipse)
 * - Heading and description copy
 *
 * Server Component: all values arrive via props.
 * `data-hero-interaction-root` enables pointer tracking across the full Hero for HeroParticleField.
 */
export function Hero({ heading, description }: CaseStudyArticleHeroProps) {
  return (
    <section className={styles.hero} data-hero-interaction-root>
      {/* Decorative background only */}
      <HeroBackground />

      {/* Content */}
      <Container className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>{heading}</h1>
          <p className={styles.description}>{description}</p>
        </div>
      </Container>
    </section>
  );
}
