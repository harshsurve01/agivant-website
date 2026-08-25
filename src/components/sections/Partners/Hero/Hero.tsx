import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import styles from "./Hero.module.css";
import type { PartnersHeroProps } from "./types";

/**
 * Hero (Partners / Our Partners Page)
 *
 * Renders the Partners page Hero section:
 * - Shared HeroBackground (ambient glowing mesh, particle canvas, ellipse stroke)
 * - Centered 64px purple heading: "Ecosystem partnerships"
 * - Centered 20px subtitle: "Built around the platforms enterprises already run"
 *
 * Server Component: no "use client", no hooks, no state. All values arrive via props.
 * `data-hero-interaction-root` enables pointer tracking across the full Hero for HeroParticleField.
 */
export function Hero({ heading, description }: PartnersHeroProps) {
  return (
    <section className={styles.hero} data-hero-interaction-root>
      <HeroBackground />

      <Container className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>{heading}</h1>
          <p className={styles.description}>{description}</p>
        </div>
      </Container>
    </section>
  );
}
