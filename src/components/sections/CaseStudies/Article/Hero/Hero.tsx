import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import styles from "./Hero.module.css";
import type { CaseStudyArticleHeroProps } from "./types";

/**
 * Hero (Case Study Inner Page)
 *
 * Renders the Case Study article page's hero content only: heading
 * and description. Figma: "Case Study Inside Page" hero frame — see
 * Hero.module.css for the exact node/measurement notes and the
 * ASSUMPTION this pass makes (no Figma access; values reused from
 * the Case Studies Hub Hero rather than read from the file directly).
 *
 * Reuses the exact same shared pieces as the Case Studies Hub Hero,
 * Blogs Article Hero, and TechTalk Hero — HeroBackground for every
 * ambient visual (gradients, particle field, decorative ellipse) and
 * Container for width/centering. Neither is duplicated or
 * reimplemented here.
 *
 * The next section (Objectives/Challenges) is shown overlapping the
 * bottom of this Hero in Figma. Per the brief, that overlap is
 * explicitly OUT of scope for this component — no extra height,
 * negative margin, absolute positioning, or z-index hack is added
 * here to accommodate it. This Hero is self-contained.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no business logic, no data imports (no caseStudies.ts here — see
 * the Article orchestrator and app/case-studies/[slug]/page.tsx for
 * the data flow). Every value arrives via props.
 */
export function Hero({ heading, description }: CaseStudyArticleHeroProps) {
  return (
    <section className={styles.hero} data-hero-interaction-root>
      {/* Decorative background only — identical usage to the Case
          Studies Hub Hero, Blogs Article Hero, and TechTalk Hero.
          `data-hero-interaction-root` is the pointer-tracking
          boundary HeroParticleField looks up via closest(), and must
          stay on an ancestor containing both HeroBackground and
          Content. */}
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
