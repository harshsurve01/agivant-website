import Link from "next/link";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icon/ArrowRight";
import styles from "./Hero.module.css";

/**
 * A CTA's shape, independent of any one section. `href` (not an
 * onClick) is what keeps this WordPress-ready: routing, analytics,
 * and link targets can all be driven by data alone, with no client
 * logic living inside Hero.
 */
export interface HeroCta {
  /** Visible label on the button. */
  label: string;
  /** Destination URL — internal path or absolute external link. */
  href: string;
}

export interface TechTalkHeroProps {
  /** Main hero heading. */
  heading: string;
  /** Supporting description copy beneath the heading. */
  description: string;
  /** Primary call-to-action. */
  cta: HeroCta;
}

/**
 * Hero (TechTalk)
 *
 * Renders the TechTalk page's hero content only: heading, description,
 * and a primary CTA. All ambient visuals (gradients, particle field,
 * decorative ellipse) live in the shared HeroBackground UI component
 * and are composed here exactly as the design system intends —
 * HeroBackground wraps this content, nothing about it is duplicated
 * or reimplemented in this file.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no business logic, no data imports. Every value — including the
 * CTA's destination — arrives via props, so this component is already
 * shaped for a future WordPress-sourced `hero` object with zero
 * changes required on this end.
 */
export function Hero({ heading, description, cta }: TechTalkHeroProps) {
  return (
    <section className={styles.hero} data-hero-interaction-root>
      {/* Decorative background only. `data-hero-interaction-root` above
          is the pointer-tracking boundary HeroParticleField looks up
          via closest() — it needs to be on an ancestor that contains
          BOTH HeroBackground and Content, since content now sits
          outside HeroBackground and no longer shares its DOM subtree.
          Plain data attribute (not a ref) on purpose: Hero stays a
          Server Component with zero hooks/client boundary of its own,
          exactly as before. */}
      <HeroBackground />

      {/* Content */}
      <Container className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>{heading}</h1>

          <p className={styles.description}>{description}</p>

          <Link href={cta.href} className={styles.cta}>
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight />}
            >
              {cta.label}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}