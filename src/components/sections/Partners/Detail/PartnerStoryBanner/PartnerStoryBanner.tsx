import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { PartnerStoryBannerData } from "@/types/partnerDetail";
import styles from "./PartnerStoryBanner.module.css";

export interface PartnerStoryBannerProps {
  data: PartnerStoryBannerData;
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
export function PartnerStoryBanner({ data }: PartnerStoryBannerProps) {
  const { image, heading, description } = data;

  return (
    <section className={styles.section} id="partner-story-banner">
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

        <div className={styles.textContent}>
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
    </section>
  );
}
