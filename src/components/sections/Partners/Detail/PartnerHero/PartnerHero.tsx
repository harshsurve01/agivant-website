import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { Button } from "@/components/ui/Button";
import { Cube } from "@/components/ui/Icon/Cube";
import type { PartnerHeroData } from "@/types/partnerDetail";
import styles from "./PartnerHero.module.css";

export interface PartnerHeroProps {
  hero: PartnerHeroData;
  /**
   * Where the logo renders relative to the heading (standard layout only).
   * "below" (default) keeps the existing partner-page order; "above" places
   * the logo image first and lets it scale as one contained image
   * (e.g. a combined multi-logo strip on a press release).
   */
  logoPosition?: "above" | "below";
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
export function PartnerHero({ hero, logoPosition = "below" }: PartnerHeroProps) {
  const isLogoAbove = logoPosition === "above";

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

  const isSalesforce = hero.partnerLogo.assetKey === "salesforce-logo";

  const isAws = hero.partnerLogo.assetKey === "aws-logo";

  const isTigerGraph =
    hero.partnerLogo.assetKey === "tigergraph-logo" ||
    hero.partnerLogo.src.includes("tigergraph");

  const isAzure =
    hero.partnerLogo.assetKey === "azure-logo" ||
    hero.partnerLogo.assetKey === "partner-azure" ||
    hero.partnerLogo.src.includes("azure");

  return (
    <section
      className={clsx(
        styles.hero,
        isNvidia && styles.nvidiaHero,
        isTigerGraph && styles.tigergraphHero
      )}
      data-hero-interaction-root
    >
      <HeroBackground showEllipse={false} />

      <Container className={styles.container}>
        <div
          className={clsx(
            styles.content,
            isNvidia && styles.nvidiaContent,
            isAws && styles.awsContent
          )}
        >
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
              {isLogoAbove && hero.partnerLogo?.src && (
                <div className={clsx(styles.logoWrapper, styles.logoWrapperAbove)}>
                  <Image
                    src={hero.partnerLogo.src}
                    alt={hero.partnerLogo.alt}
                    width={hero.partnerLogo.width ?? 567}
                    height={hero.partnerLogo.height ?? 67}
                    className={styles.partnerLogoAbove}
                    priority
                  />
                </div>
              )}

              <h1 className={styles.heading}>
                {hero.headingLines && hero.headingLines.length > 0 ? (
                  hero.headingLines.map((line, idx) => (
                    <span
                      key={idx}
                      className={clsx(
                        styles.headingLine,
                        (isDatabricks || isSalesforce || isTigerGraph || isAws) &&
                          idx === 0 &&
                          styles.headingLineAccent,
                        (isDatabricks || isSalesforce || isTigerGraph || isAws) &&
                          idx > 0 &&
                          styles.headingLinePrimary
                      )}
                    >
                      {line}
                      {/* AWS: the logo supplies the "aws" wordmark inline
                          at the end of the first heading line. */}
                      {isAws && idx === 0 && (
                        <>
                          {" "}
                          <Image
                            src={hero.partnerLogo.src}
                            alt={hero.partnerLogo.alt}
                            width={hero.partnerLogo.width ?? 249}
                            height={hero.partnerLogo.height ?? 91}
                            className={styles.awsLogoInline}
                            priority
                          />
                        </>
                      )}
                      {/* Azure: the logo supplies the Azure logo inline
                          at the end of the first heading line. */}
                      {isAzure && idx === 0 && (
                        <>
                          {" "}
                          <Image
                            src={hero.partnerLogo.src}
                            alt={hero.partnerLogo.alt}
                            width={hero.partnerLogo.width ?? 249}
                            height={hero.partnerLogo.height ?? 91}
                            className={styles.azureLogoInline}
                            priority
                          />
                        </>
                      )}
                    </span>
                  ))
                ) : (
                  <>
                    <span
                      className={clsx(
                        styles.headingLine,
                        (isDatabricks || isSalesforce || isTigerGraph) &&
                          styles.headingLineAccent
                      )}
                    >
                      {hero.headingLine1}
                    </span>
                    <span
                      className={clsx(
                        styles.headingLine,
                        (isDatabricks || isSalesforce || isTigerGraph) &&
                          styles.headingLinePrimary
                      )}
                    >
                      {hero.headingLine2}
                    </span>
                  </>
                )}
              </h1>

              {hero.partnerLogo && !isLogoAbove && !isAws && !isAzure && (
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
                      hero.partnerLogo.assetKey === "glean-logo" && styles.gleanLogo,
                      isSalesforce && styles.salesforceLogo,
                      isTigerGraph && styles.tigergraphLogo
                    )}
                    priority
                  />
                </div>
              )}

              {hero.subtitle && (
                <p
                  className={clsx(
                    styles.subtitle,
                    isTigerGraph && styles.tigergraphSubtitle,
                    isAzure && styles.azureSubtitle
                  )}
                >
                  {hero.subtitle}
                </p>
              )}

              {hero.primaryCta?.enabled && hero.primaryCta.label && (
                <div className={styles.ctaWrapper}>
                  <Link href={hero.primaryCta.href ?? "/contact"}>
                    <Button
                      variant="primary"
                      size="lg"
                      rightIcon={
                        hero.primaryCta.icon === "cube" ? <Cube /> : undefined
                      }
                    >
                      {hero.primaryCta.label}
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
