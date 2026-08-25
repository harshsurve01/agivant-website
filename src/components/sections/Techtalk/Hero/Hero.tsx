import Link from "next/link";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icon/ArrowRight";
import styles from "./Hero.module.css";

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
 * Renders the TechTalk page's hero section:
 * - Shared HeroBackground (ambient glowing mesh, particle canvas, ellipse stroke)
 * - Heading, description copy, and primary CTA button
 *
 * Server Component: no "use client", no hooks, no state. All values arrive via props.
 * `data-hero-interaction-root` enables pointer tracking across the full Hero for HeroParticleField.
 */
export function Hero({ heading, description, cta }: TechTalkHeroProps) {
  return (
    <section className={styles.hero} data-hero-interaction-root>
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