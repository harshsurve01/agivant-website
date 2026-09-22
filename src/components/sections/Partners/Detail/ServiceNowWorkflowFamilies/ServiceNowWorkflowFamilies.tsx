import clsx from "clsx";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section, type SectionHeight } from "@/components/ui/Section";
import type { WorkflowFamiliesData } from "@/types/partnerDetail";
import styles from "./ServiceNowWorkflowFamilies.module.css";

export interface ServiceNowWorkflowFamiliesProps {
  data: WorkflowFamiliesData;
  height?: SectionHeight;
  className?: string;
  id?: string;
}

/**
 * Presentational helper to highlight "Show up across" in Agivant purple
 * while preserving single-field integrity in JSON per AGIVANT_JSON_DATA_RULEBOOK.md.
 */
function renderHeading(heading: string) {
  const target = "Show up across";
  if (heading.startsWith(target)) {
    return (
      <>
        <span className={styles.headingHighlight}>{target}</span>
        {heading.slice(target.length)}
      </>
    );
  }
  return heading;
}

/**
 * Presentational helper to highlight the workflow family prefix (before the colon)
 * in Agivant purple while keeping the card title as one string in JSON.
 */
function renderCardTitle(title: string) {
  const colonIdx = title.indexOf(":");
  if (colonIdx !== -1) {
    const prefix = title.slice(0, colonIdx + 1);
    const rest = title.slice(colonIdx + 1);
    return (
      <>
        <span className={styles.cardTitlePrefix}>{prefix}</span>
        {rest}
      </>
    );
  }
  return title;
}

/**
 * ServiceNowWorkflowFamilies
 *
 * Dedicated reusable section for ServiceNow Partner Detail page (/partners/servicenow)
 * showcasing the four ServiceNow workflow families:
 * 1. Technology
 * 2. Employee
 * 3. Creator
 * 4. Customer
 *
 * Visual features:
 * - Section header with purple highlight on "Show up across"
 * - 4 alternating cards (Image-Left, Image-Right)
 * - Full-bleed card images with zero padding/margins, clipped by card radius
 * - Family prefix in purple, rest in bold black
 * - Section closing statement centered in Agivant purple
 */
export function ServiceNowWorkflowFamilies({
  data,
  height = "auto",
  className,
  id = "workflow-families",
}: ServiceNowWorkflowFamiliesProps) {
  if (!data) return null;

  return (
    <Section
      height={height}
      className={clsx(styles.section, className)}
      id={id}
    >
      <Container size="xl" className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>{renderHeading(data.heading)}</h2>
          {data.description && (
            <p className={styles.description}>{data.description}</p>
          )}
        </div>

        <div className={styles.cardsGrid}>
          {data.cards.map((card, index) => {
            const isImageRight = card.imagePosition === "right";
            return (
              <div
                key={card.id || index}
                className={clsx(
                  styles.card,
                  isImageRight ? styles.cardImageRight : styles.cardImageLeft
                )}
              >
                <div className={styles.imageColumn}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={card.image.src}
                      alt={card.image.alt || card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className={styles.image}
                      priority
                    />
                  </div>
                </div>

                <div className={styles.contentColumn}>
                  <h3 className={styles.cardTitle}>
                    {renderCardTitle(card.title)}
                  </h3>
                  <p className={styles.cardBody}>{card.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        {data.closingStatement && (
          <p className={styles.closingStatement}>{data.closingStatement}</p>
        )}
      </Container>
    </Section>
  );
}
