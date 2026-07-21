import Image from "next/image";
import type { CaseStudy } from "@/data/proof";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import styles from "./SpotlightCard.module.css";

interface SpotlightCardProps {
  caseStudy: CaseStudy;
}

/**
 * SpotlightCard
 *
 * Presentation only: badge, image, overlay, title, description,
 * metric, footer. No hover logic — it doesn't know or care whether
 * it's the hovered card, the container decides that in Phase 4 and
 * will pass this component whatever prop that requires then. `metric`
 * and `footer` render conditionally because not every case study has
 * them populated (see the field-level comments in data/proof.ts).
 *
 * Image support follows the same "content asset, not a UI icon"
 * treatment as AI Stack and Partners: `fill` + `sizes` rather than
 * fixed width/height, since this card's artwork is a background
 * treatment behind the badge/corner icon, not an inline logo.
 *
 * Semantic markup: <article> per card, heading level bumped to h3
 * since ProofContent already owns the section's h2. Image alt text
 * is required by the CaseStudy type, not optional.
 */
export function SpotlightCard({ caseStudy }: SpotlightCardProps) {
  const { industry, title, description, metric, metricLabel, footer, image } =
    caseStudy;

  return (
    <article className={styles.card}>
      <div className={styles.artwork}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="400px"
          className={styles.image}
        />

        <span className={styles.badge}>{industry}</span>

        {/* Corner affordance previewing the future "expand" interaction.
            Purely decorative today — no click/hover handler, the
            container owns all interaction per the architecture. */}
        <span className={styles.corner} aria-hidden="true">
          <ArrowUpRight />
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        {metric ? (
          <div className={styles.metric}>
            <p className={styles.metricValue}>{metric}</p>
            {metricLabel ? (
              <p className={styles.metricLabel}>{metricLabel}</p>
            ) : null}
          </div>
        ) : null}

        {footer ? <p className={styles.footer}>{footer}</p> : null}
      </div>
    </article>
  );
}
