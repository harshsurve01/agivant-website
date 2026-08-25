import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import type { ProductionProofCardData } from "@/types/partnerDetail";
import styles from "./ProductionProof.module.css";

interface ProductionProofCardProps {
  card: ProductionProofCardData;
  isTall?: boolean;
}

/**
 * ProductionProofCard
 *
 * Dedicated proof card for the Gemini Enterprise partner page:
 * - Full background artwork with top-left "Client success" pill and top-right arrow badge
 * - Translucent elevated glass body overlaying lower portion of artwork
 * - Purple title, description, purple metric/outcome text, and "Read more >>" link
 * - Fully clickable via Next.js Link navigating to /case-studies/[slug]
 * - Static layout without hover enlargement
 */
export function ProductionProofCard({ card, isTall = false }: ProductionProofCardProps) {
  const { title, description, metric, ctaLabel = "Read more >>", caseStudySlug, image, badge } = card;

  return (
    <Link href={`/case-studies/${caseStudySlug}`} className={styles.cardLink}>
      <article className={`${styles.card} ${isTall ? styles.cardTall : styles.cardShort}`}>
        {/* Layer 1: Background artwork with badge and arrow */}
        <div className={styles.artwork}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className={styles.image}
          />
          {badge && <span className={styles.badge}>{badge}</span>}
          <span className={styles.corner} aria-hidden="true">
            <ArrowUpRight />
          </span>
        </div>

        {/* Layer 2: Translucent floating glass body */}
        <div className={`${styles.body} ${isTall ? styles.bodyTall : styles.bodyShort}`}>
          <div className={styles.bodyContent}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
            <p className={styles.metric}>{metric}</p>
            <span className={styles.cta}>{ctaLabel}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
