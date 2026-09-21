import clsx from "clsx";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import { PageRibbon } from "@/components/ui/PageRibbon";
import { HeroBackground } from "@/components/ui/HeroBackground";
import type { ServicesHeroProps } from "./types";
import styles from "./Hero.module.css";

const DEFAULT_RIBBON_SRC = "/images/services/hero-ribbon.png";

/**
 * Hero (Services Landing Page Hero: /services)
 *
 * Visual hierarchy and interaction integration:
 * 1. Existing Agivant HeroBackground:
 *    - Shared ambient glowing gradients (via GradientLayer)
 *    - Shared interactive particle field with mouse tracking (via HeroParticleField)
 *    - Figma ellipse stroke suppressed (showEllipse={false})
 * 2. Services Hero ribbon artwork (/images/services/hero-ribbon.png) via PageRibbon (z-index: 4)
 * 3. Hero Content via Container (z-index: 10):
 *    - Large centered heading in Agivant purple (#8500DF) with semantic line breaks
 *    - Supporting description with balanced line wrap
 *    - Primary CTA button ("Talk to an Amp'd specialist ↗") with Agivant ButtonMotion
 *
 * Server Component: all content arrives via typed props; no client state.
 */
export function Hero({
  title,
  summary,
  primaryCta,
  media,
  className,
  ribbonClassName,
}: ServicesHeroProps) {
  const lines =
    typeof title === "string" && (title.includes("<br") || title.includes("\n"))
      ? title.split(/<br\s*\/?>|\n/gi).map((line) => line.trim()).filter(Boolean)
      : null;

  const ribbonSrc = media?.src || DEFAULT_RIBBON_SRC;
  const ribbonWidth = media?.width || 1920;
  const ribbonHeight = media?.height || 1080;

  return (
    <section
      className={clsx(styles.hero, className)}
      data-hero-interaction-root
    >
      {/* Existing Agivant Hero Background with ambient glows and particle interaction */}
      <HeroBackground showEllipse={false} />

      {/* Services Hero ribbon artwork */}
      <PageRibbon
        src={ribbonSrc}
        width={ribbonWidth}
        height={ribbonHeight}
        className={clsx(styles.ribbonWrapper, ribbonClassName)}
        imageClassName={styles.ribbonImage}
        priority
      />

      {/* Hero Content */}
      <Container size="xl" className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>
            {lines
              ? lines.map((line, idx) => (
                  <span key={idx} className={styles.headingLine}>
                    {line}
                  </span>
                ))
              : title}
          </h1>

          {summary && <p className={styles.description}>{summary}</p>}

          {primaryCta?.enabled && (
            <div className={styles.actions}>
              <Link href={primaryCta.href}>
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowUpRight />}
                >
                  {primaryCta.label}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
