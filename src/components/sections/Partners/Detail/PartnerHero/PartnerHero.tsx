import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { HeroBackground } from "@/components/ui/HeroBackground";
import type { PartnerHeroData } from "@/types/partnerDetail";
import styles from "./PartnerHero.module.css";

export interface PartnerHeroProps {
  hero: PartnerHeroData;
}

/**
 * PartnerHero
 *
 * Dedicated reusable Hero section for Partner Detail Pages (/partners/[slug]).
 *
 * Reuses:
 * - `HeroBackground`: ambient glowing mesh, particle field, and decorative ellipse
 * - `Container`: standard content wrapper
 * - `variables.css`: typography and color design tokens
 *
 * Renders the exact Figma visual hierarchy:
 * - Two-line centered purple headline ("Turn AI pilots into enterprise-wide / business value with")
 * - Partner lockup/logo image ("Gemini Enterprise")
 *
 * Server Component: pure presentation, no client overhead.
 */
export function PartnerHero({ hero }: PartnerHeroProps) {
  return (
    <section className={styles.hero} data-hero-interaction-root>
      <HeroBackground />

      <Container className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>
            <span className={styles.headingLine}>{hero.headingLine1}</span>
            <span className={styles.headingLine}>{hero.headingLine2}</span>
          </h1>

          {hero.partnerLogo && (
            <div className={styles.logoWrapper}>
              <Image
                src={hero.partnerLogo.src}
                alt={hero.partnerLogo.alt}
                width={hero.partnerLogo.width ?? 567}
                height={hero.partnerLogo.height ?? 67}
                className={styles.partnerLogo}
                priority
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
