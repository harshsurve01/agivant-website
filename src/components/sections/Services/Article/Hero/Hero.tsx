import clsx from "clsx";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import { PageRibbon } from "@/components/ui/PageRibbon";
import styles from "./Hero.module.css";
import type { ServiceHeroProps } from "./types";

/**
 * Hero (Service Single/Inner Page: /services/[slug])
 *
 * Dedicated section component for the Service Single Page Hero:
 * - Reuses the shared `HeroBackground` for ambient glowing gradients and
 *   interactive canvas particle field with pointer tracking.
 * - Parses intentional `<br>` tags in the JSON heading into semantic `.headingLine` spans:
 *   - Line 1: Agivant brand purple (#8500DF)
 *   - Line 2: Black (#000000)
 * - Renders the decorative liquid ribbon flowing across the lower visual area
 *   via the shared `PageRibbon` component with horizontal mirroring to match Figma.
 * - Conditionally renders the description paragraph only when content is provided.
 *
 * Server Component: all data arrives via props; no "use client", no local state.
 */
const DEFAULT_HERO_RIBBON =
  "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/hero-ribbon.png";

export function Hero({
  heading,
  description,
  media,
  className,
  ribbonClassName,
}: ServiceHeroProps) {
  const lines =
    typeof heading === "string" && (heading.includes("<br") || heading.includes("\n"))
      ? heading.split(/<br\s*\/?>|\n/gi).map((line) => line.trim()).filter(Boolean)
      : null;

  const ribbonSrc = media?.src || DEFAULT_HERO_RIBBON;

  return (
    <section
      className={clsx(styles.hero, className)}
      data-hero-interaction-root
    >
      {/* Shared decorative background with ambient glows and particle canvas */}
      <HeroBackground showEllipse={false} />

      {/* Decorative liquid ribbon flowing across the lower area */}
      <PageRibbon
        src={ribbonSrc}
        width={media?.width || 1440}
        height={media?.height || 502}
        className={clsx(styles.ribbonWrapper, ribbonClassName)}
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
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </Container>
    </section>
  );
}
