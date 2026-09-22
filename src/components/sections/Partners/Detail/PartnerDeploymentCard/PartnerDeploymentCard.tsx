import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Section, type SectionHeight } from "@/components/ui/Section";
import type { PartnerDeploymentCardData } from "@/types/partnerDetail";
import styles from "./PartnerDeploymentCard.module.css";

export interface PartnerDeploymentCardProps {
  data: PartnerDeploymentCardData;
  height?: SectionHeight;
  className?: string;
  id?: string;
  imagePosition?: "left" | "right";
}

/**
 * Presentational helper to render heading with Agivant purple accent
 */
function renderHeading(heading: PartnerDeploymentCardData["heading"]) {
  if (heading.highlight) {
    return (
      <>
        <span className={styles.headingHighlight}>{heading.highlight}</span>
        {heading.text ? ` ${heading.text}` : ""}
      </>
    );
  }

  const raw = heading.raw || heading.text || "";
  const highlightTargets = [
    "Scale inside the Glean",
    "Keep teams in control",
  ];

  for (const target of highlightTargets) {
    if (raw.startsWith(target)) {
      return (
        <>
          <span className={styles.headingHighlight}>{target}</span>
          {raw.slice(target.length)}
        </>
      );
    }
  }

  return raw;
}

/**
 * PartnerDeploymentCard
 *
 * Reusable wide rounded card section for partner detail pages.
 * Displays decorative ribbon artwork and heading + body + optional closing statement.
 * Supports image on the left (Glean default) or right (ServiceNow).
 * Consumes design tokens exclusively from variables.css.
 * Server Component: pure presentation, zero client overhead.
 */
export function PartnerDeploymentCard({
  data,
  height = "auto",
  className,
  id = "scale-deployment",
  imagePosition: propImagePosition,
}: PartnerDeploymentCardProps) {
  if (!data) return null;

  const imagePosition = propImagePosition || data.imagePosition || "left";
  const isImageRight = imagePosition === "right";

  return (
    <Section
      height={height}
      className={clsx(styles.section, className)}
      id={id}
    >
      <Container size="xl" className={styles.container}>
        <div className={clsx(styles.card, isImageRight && styles.imageRight)}>
          <div className={styles.ribbonWrapper} aria-hidden="true">
            <Image
              src={data.image.src}
              alt={data.image.alt || ""}
              width={data.image.width || 2300}
              height={data.image.height || 1516}
              className={styles.ribbonImage}
              priority={false}
            />
          </div>
          <div className={styles.content}>
            <h2 className={styles.heading}>{renderHeading(data.heading)}</h2>
            <p className={styles.description}>{data.description}</p>
            {data.closingStatement && (
              <p className={styles.closingStatement}>{data.closingStatement}</p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
