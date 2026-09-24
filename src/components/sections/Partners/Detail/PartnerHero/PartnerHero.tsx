import Image from "next/image";
import clsx from "clsx";
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
  const isNvidia =
    hero.partnerLogo.assetKey === "nvidia-logo" ||
    hero.partnerLogo.src.includes("nvidia");

  const isDatabricks =
    hero.partnerLogo.assetKey === "databricks-logo" ||
    hero.partnerLogo.src.includes("databricks") ||
    Boolean(
      hero.headingLines?.some((l) =>
        l.toLowerCase().includes("turn your enterprise data")
      )
    );

  return (
    <section
      className={clsx(styles.hero, isNvidia && styles.nvidiaHero)}
      data-hero-interaction-root
    >
      <HeroBackground showDecorativeLayers={!isNvidia} />

      <Container className={styles.container}>
        <div className={clsx(styles.content, isNvidia && styles.nvidiaContent)}>
          {isNvidia ? (
            <>
              {/* Heading hierarchy:
                  Line 1: "Agivant" as normal text in heading typography/purple + NVIDIA logo image
                  Line 2: "HyperCore" as normal text centered below Line 1
              */}
              <h1 className={clsx(styles.heading, styles.nvidiaHeading)}>
                <span className={styles.nvidiaLine1}>
                  <span className={styles.nvidiaBrandText}>
                    {hero.headingLines?.[0] ?? "Agivant"}
                  </span>
                  <Image
                    src={hero.partnerLogo.src}
                    alt={hero.partnerLogo.alt}
                    width={hero.partnerLogo.width ?? 249}
                    height={hero.partnerLogo.height ?? 91}
                    className={styles.nvidiaLogoInline}
                    priority
                  />
                </span>
                <span className={styles.nvidiaLine2}>
                  {hero.headingLines?.[1] ?? "HyperCore"}
                </span>
              </h1>

              {/* Line 3: Subtitle - centered below HyperCore */}
              {hero.subtitle && (
                <p className={styles.nvidiaSubtitle}>{hero.subtitle}</p>
              )}
            </>
          ) : (
            <>
              <h1 className={styles.heading}>
                {hero.headingLines && hero.headingLines.length > 0 ? (
                  hero.headingLines.map((line, idx) => (
                    <span
                      key={idx}
                      className={clsx(
                        styles.headingLine,
                        isDatabricks && idx === 0 && styles.headingLineAccent,
                        isDatabricks && idx > 0 && styles.headingLinePrimary
                      )}
                    >
                      {line}
                    </span>
                  ))
                ) : (
                  <>
                    <span
                      className={clsx(
                        styles.headingLine,
                        isDatabricks && styles.headingLineAccent
                      )}
                    >
                      {hero.headingLine1}
                    </span>
                    <span
                      className={clsx(
                        styles.headingLine,
                        isDatabricks && styles.headingLinePrimary
                      )}
                    >
                      {hero.headingLine2}
                    </span>
                  </>
                )}
              </h1>

              {hero.partnerLogo && (
                <div className={styles.logoWrapper}>
                  <Image
                    src={hero.partnerLogo.src}
                    alt={hero.partnerLogo.alt}
                    width={hero.partnerLogo.width ?? 567}
                    height={hero.partnerLogo.height ?? 67}
                    className={clsx(
                      styles.partnerLogo,
                      hero.partnerLogo.assetKey === "databricks-logo" && styles.databricksLogo,
                      hero.partnerLogo.assetKey === "shopify-logo" && styles.shopifyLogo,
                      hero.partnerLogo.assetKey === "servicenow-logo" && styles.servicenowLogo,
                      hero.partnerLogo.assetKey === "glean-logo" && styles.gleanLogo
                    )}
                    priority
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
