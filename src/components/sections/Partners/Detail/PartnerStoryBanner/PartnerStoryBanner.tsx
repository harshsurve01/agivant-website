import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Section, type SectionHeight } from "@/components/ui/Section";
import type { PartnerStoryBannerData } from "@/types/partnerDetail";
import styles from "./PartnerStoryBanner.module.css";

export interface PartnerStoryBannerProps {
  data: PartnerStoryBannerData;
  height?: SectionHeight;
  className?: string;
  /** Text alignment for heading + description. Default "left" (Shopify). */
  align?: "left" | "center";
  /**
   * When the data has no separate highlight, render the first N words of the
   * heading in the accent colour and the rest in the primary text colour.
   * Unset keeps the existing heading treatment.
   */
  headingHighlightWords?: number;
}

/**
 * PartnerStoryBanner
 *
 * Dedicated presentation component for the Shopify Partner narrative banner section:
 * 1. Large visual image at the top (full-width banner contained within Container)
 * 2. Heading below the image with purple accent
 * 3. Supporting paragraph below the heading
 *
 * Server Component: pure presentation, zero client overhead.
 */
export function PartnerStoryBanner({
  data,
  height = "viewport",
  className,
  align = "left",
  headingHighlightWords,
}: PartnerStoryBannerProps) {
  const { image, description } = data;
  let heading = data.heading;
  if (headingHighlightWords && !heading.highlight && heading.text) {
    const words = heading.text.split(" ");
    heading = {
      highlight: words.slice(0, headingHighlightWords).join(" "),
      text: words.slice(headingHighlightWords).join(" "),
    };
  }

  return (
    <Section
      height={height}
      className={clsx(styles.section, className)}
      id="partner-story-banner"
    >
      <Container size="xl" className={styles.container}>
        {image && (
          <div className={styles.imageWrapper}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className={styles.image}
              priority
            />
          </div>
        )}

        <div
          className={clsx(
            styles.textContent,
            align === "center" && styles.textContentCenter
          )}
        >
          <h2 className={styles.heading}>
            {heading.highlight && (
              <span className={styles.purpleText}>
                {heading.highlight}
                {heading.highlight.endsWith("\n") ? "" : " "}
              </span>
            )}
            <span className={styles.darkText}>{heading.text}</span>
          </h2>

          {description && <p className={styles.description}>{description}</p>}
        </div>
      </Container>
    </Section>
  );
}
