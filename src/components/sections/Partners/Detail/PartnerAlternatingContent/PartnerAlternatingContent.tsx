import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Section, type SectionHeight } from "@/components/ui/Section";
import { Gradient } from "@/components/effects/Gradient";
import type { PartnerAlternatingContentData } from "@/types/partnerDetail";
import styles from "./PartnerAlternatingContent.module.css";

export interface PartnerAlternatingContentProps {
  data: PartnerAlternatingContentData;
  height?: SectionHeight;
  className?: string;
}

/**
 * PartnerAlternatingContent
 *
 * Section 5 of the Shopify Partner page (/partners/shopify).
 * Renders two alternating editorial content/image rows:
 * - Row 1: Text left, Image right (Scale securely on Google Cloud)
 * - Row 2: Image left, Text right (Keep merchants in control) on a frosted glass card surface
 *
 * Visual hierarchy:
 * - Line 1 of heading: Agivant purple
 * - Line 2 of heading: Dark / black
 * - Ambient gradient treatment placed behind content
 *
 * Server Component: all content arrives via typed props from JSON.
 */
export function PartnerAlternatingContent({
  data,
  height = "viewport",
  className,
}: PartnerAlternatingContentProps) {
  if (!data?.rows?.length) return null;

  return (
    <Section
      height={height}
      className={clsx(styles.section, className)}
      id="partner-alternating-content"
    >
      {/* Soft ambient background gradients positioned behind content */}
      <Gradient
        top="45%"
        right="-12%"
        size="36rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.25}
        blur="80px"
      />
      <Gradient
        kind="linear"
        angle="180deg"
        top="60%"
        left="-15%"
        size="35rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.12}
        blur="90px"
      />

      <Container size="xl" className={styles.container}>
        <div className={styles.rows}>
          {data.rows.map((row) => (
            <div
              key={row.id}
              className={clsx(
                styles.row,
                row.imagePosition === "left" && styles.imageLeft,
                row.isCard && styles.cardRow
              )}
            >
              <div className={styles.textContent}>
                <h3 className={styles.heading}>
                  <span className={styles.purpleText}>
                    {row.heading.highlight}
                  </span>
                  <span className={styles.darkText}>
                    {row.heading.text}
                  </span>
                </h3>
                <p className={styles.description}>{row.description}</p>
              </div>

              {row.image && (
                <div className={styles.imageWrapper}>
                  <Image
                    src={row.image.src}
                    alt={row.image.alt}
                    width={row.image.width ?? 437}
                    height={row.image.height ?? 279}
                    className={styles.image}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
