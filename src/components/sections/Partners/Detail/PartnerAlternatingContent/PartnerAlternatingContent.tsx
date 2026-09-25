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
  variant?: "default" | "tigergraph";
  id?: string;
}

/**
 * PartnerAlternatingContent
 *
 * Section 5 of the Shopify Partner page (/partners/shopify) and
 * reused for Salesforce and TigerGraph partner pages.
 * Renders alternating editorial content/image rows or single CTA card.
 *
 * Visual hierarchy:
 * - Line 1 of heading: Agivant purple
 * - Line 2 of heading: Dark / black
 * - TigerGraph variant: single inline heading with purple prefix and padded card
 *
 * Server Component: all content arrives via typed props from JSON.
 */
export function PartnerAlternatingContent({
  data,
  height = "viewport",
  className,
  variant = "default",
  id = "partner-alternating-content",
}: PartnerAlternatingContentProps) {
  if (!data?.rows?.length) return null;

  const isTigergraph = variant === "tigergraph";

  return (
    <Section
      height={height}
      className={clsx(
        styles.section,
        isTigergraph && styles.tigergraphSection,
        className
      )}
      id={id}
    >
      {/* Soft ambient background gradients positioned behind content (omitted for tigergraph) */}
      {!isTigergraph && (
        <>
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
        </>
      )}

      <Container size="xl" className={styles.container}>
        <div className={styles.rows}>
          {data.rows.map((row) => (
            <div
              key={row.id}
              className={clsx(
                styles.row,
                row.imagePosition === "left" && styles.imageLeft,
                row.isCard && styles.cardRow,
                isTigergraph && styles.tigergraphCard
              )}
            >
              <div className={styles.textContent}>
                <h3 className={styles.heading}>
                  <span className={styles.purpleText}>
                    {row.heading.highlight}
                  </span>
                  {isTigergraph && row.heading.highlight && row.heading.text ? " " : null}
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
