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
 * Dedicated proof card for the partner "Proof from production." section:
 * - Full background artwork with top-left "Client success" pill and top-right arrow badge
 * - Translucent elevated glass body overlaying lower portion of artwork
 * - Purple title, description, purple metric/outcome text, and "Read more >>" label
 * - Links to `card.href` when one is set. With an empty/absent `href` the
 *   card renders as a plain (non-link) element: no navigation, no fake
 *   anchor. Supplying a real `href` later makes it navigable automatically.
 */
export function ProductionProofCard({ card, isTall = false }: ProductionProofCardProps) {
  const { title, description, metric, ctaLabel = "Read more >>", href, image, badge } = card;

  const content = (
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
  );

  if (href) {
    return (
      <Link href={href} className={styles.cardLink}>
        {content}
      </Link>
    );
  }

  return <div className={styles.cardLink}>{content}</div>;
}
