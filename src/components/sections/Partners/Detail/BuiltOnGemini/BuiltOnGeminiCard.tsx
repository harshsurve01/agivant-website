import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import type { BuiltOnGeminiCardData } from "@/types/partnerDetail";
import styles from "./BuiltOnGemini.module.css";

interface BuiltOnGeminiCardProps {
  card: BuiltOnGeminiCardData;
}

/**
 * BuiltOnGeminiCard
 *
 * Single accelerator card for "Built on Gemini Enterprise" section:
 * - Top image with rounded top corners (400 x 237 aspect ratio)
 * - Top-left "Solution" pill badge
 * - Top-right circular arrow badge (points ↗ at rest, rotates smoothly to ↙ on hover)
 * - Translucent glass-style card body with inset shadow
 * - Purple 18px SemiBold title, 16px Regular description, purple metric, and "See the solution >>" CTA
 * - Links to corresponding solution in Section 04 (#quote-accelerator, #sourcex, #zeroqueue)
 * - No card enlargement or translation on hover
 */
export function BuiltOnGeminiCard({ card }: BuiltOnGeminiCardProps) {
  const {
    title,
    description,
    metric,
    ctaLabel = "See the solution >>",
    slug,
    image,
    badge = "Solution",
  } = card;

  return (
    <Link href={`/solutions/${slug}`} className={styles.cardLink}>
      <article className={styles.card}>
        {/* Top Image Frame */}
        <div className={styles.imageWrapper}>
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

        {/* Card Body */}
        <div className={styles.cardBody}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <p className={styles.metric}>{metric}</p>
          <span className={styles.cta}>{ctaLabel}</span>
        </div>
      </article>
    </Link>
  );
}
