import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import { PageRibbon } from "@/components/ui/PageRibbon";
import styles from "./Hero.module.css";
import type { SolutionHeroProps } from "./types";

/**
 * Hero (Solution Inner Page: /solutions/[slug])
 *
 * Dedicated section component for the Solution Inner Page Hero:
 * - Reuses the shared `HeroBackground` for ambient glowing gradients,
 *   decorative ellipse stroke, and interactive canvas particle field.
 * - `data-hero-interaction-root` enables pointer tracking across the full Hero.
 * - Parses intentional `<br>` tags in the JSON heading into semantic `.headingLine` spans.
 * - Renders the Solution-specific decorative ribbon across the lower visual area
 *   via the shared `PageRibbon` component without duplicating ribbon rendering logic.
 *
 * Server Component: all data arrives via props; no "use client", no local state.
 */
const SHARED_HERO_RIBBON =
  "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/hero-ribbon.png";

export function Hero({ heading, description, media }: SolutionHeroProps) {
  const lines =
    typeof heading === "string" && (heading.includes("<br") || heading.includes("\n"))
      ? heading.split(/<br\s*\/?>|\n/gi).map((line) => line.trim()).filter(Boolean)
      : null;

  const ribbonSrc = media?.src || SHARED_HERO_RIBBON;

  return (
    <section className={styles.hero} data-hero-interaction-root>
      {/* Shared decorative background with ambient glows and particle canvas */}
      <HeroBackground />

      {/* Shared Solution decorative ribbon flowing across the lower area */}
      <PageRibbon
        src={ribbonSrc}
        width={1440}
        height={502}
        className={styles.ribbonWrapper}
        imageClassName={styles.ribbonImage}
        priority
      />

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
