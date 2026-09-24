import clsx from "clsx";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import { PageRibbon } from "@/components/ui/PageRibbon";
import styles from "./Hero.module.css";
import type { SolutionHeroProps } from "./types";

/**
 * Hero (Solution Hero: landing and inner page)
 *
 * Dedicated section component for the Solution Hero:
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

export function Hero({
  heading,
  description,
  media,
  className,
  ribbonClassName,
}: SolutionHeroProps) {
  let lines =
    typeof heading === "string" && (heading.includes("<br") || heading.includes("\n"))
      ? heading.split(/<br\s*\/?>|\n/gi).map((line) => line.trim()).filter(Boolean)
      : null;

  if (
    !lines &&
    typeof heading === "string" &&
    heading.toLowerCase().includes("agentic operating layer")
  ) {
    const match = heading.match(/agentic\s+operating\s+layer/i);
    if (match && match.index !== undefined) {
      const splitEnd = match.index + match[0].length;
      lines = [
        heading.slice(0, splitEnd).trim(),
        heading.slice(splitEnd).trim(),
      ].filter(Boolean);
    }
  }

  if (
    !lines &&
    typeof heading === "string" &&
    heading.toLowerCase().includes("ai solutions powering real")
  ) {
    const match = heading.match(/ai\s+solutions\s+powering\s+real/i);
    if (match && match.index !== undefined) {
      const splitEnd = match.index + match[0].length;
      lines = [
        heading.slice(0, splitEnd).trim(),
        heading.slice(splitEnd).trim(),
      ].filter(Boolean);
    }
  }

  const ribbonSrc = media?.src || SHARED_HERO_RIBBON;

  const isAgentLibrary =
    typeof heading === "string" &&
    heading.toLowerCase().includes("agentic operating layer");

  const isSolutionsLanding =
    typeof heading === "string" &&
    heading.toLowerCase().includes("ai solutions powering real");

  return (
    <section
      className={clsx(styles.hero, className)}
      data-hero-interaction-root
    >
      {/* Shared decorative background with ambient glows and particle canvas */}
      <HeroBackground showEllipse={false} />

      {/* Shared Solution decorative ribbon flowing across the lower area */}
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
              ? lines.map((line, idx) => {
                  let isPrimary = false;
                  let isAccent = true;

                  if (isAgentLibrary) {
                    isAccent = idx === 0;
                    isPrimary = idx === 1;
                  } else if (isSolutionsLanding) {
                    isPrimary = idx === 0;
                    isAccent = idx === 1;
                  }

                  return (
                    <span
                      key={idx}
                      className={clsx(
                        styles.headingLine,
                        isAccent && styles.headingLineAccent,
                        isPrimary && styles.headingLinePrimary
                      )}
                    >
                      {line}
                    </span>
                  );
                })
              : heading}
          </h1>
          <p className={styles.description}>{description}</p>
        </div>
      </Container>
    </section>
  );
}
