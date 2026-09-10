import Image from "next/image";
import type { CaseStudy } from "./types";
import styles from "./CaseStudyCard.module.css";

export interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

/**
 * CaseStudyCard
 *
 * Renders one Phase 4 case-study card matching the Figma reference:
 * - Card title at the top
 * - Two-column body separated by a single vertical divider:
 *   - Left: "Instead of saying:" in red, quoted text, with decorative ribbon image at bottom-left
 *   - Right: "Say:" in green, continuous paragraphs of text
 * - Translucent frosted glass card surface with rounded corners
 *
 * Server Component: no "use client", no hooks, no state, no data imports.
 */
export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const {
    title,
    insteadLabel = "Instead of saying:",
    insteadText,
    sayLabel = "Say:",
    sayText,
    image,
  } = caseStudy;

  const sayParagraphs =
    typeof sayText === "string" ? sayText.split("\n\n") : [sayText];

  return (
    <div className={styles.cardWrapper}>
      {image && (
        <div className={styles.imageWrapper} aria-hidden="true">
          <Image
            src={image}
            alt=""
            width={600}
            height={166}
            className={styles.cardImage}
          />
        </div>
      )}

      <article className={styles.card}>
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.body}>
          <div className={styles.leftColumn}>
            <p className={styles.insteadLabel}>{insteadLabel}</p>
            <p className={styles.text}>{insteadText}</p>
          </div>

          <div className={styles.rightColumn}>
            <p className={styles.sayLabel}>{sayLabel}</p>
            <div className={styles.sayContent}>
              {sayParagraphs.map((para, index) => (
                <p key={index} className={styles.text}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
