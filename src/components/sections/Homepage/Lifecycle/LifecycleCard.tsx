import Image from "next/image";
import Link from "next/link";
import type { LifecycleStage } from "@/data/lifecycle";
import styles from "./LifecycleCard.module.css";

export interface LifecycleCardStage {
  id: string;
  title: string;
  description: string;
  status?: string;
  media: {
    kind?: string;
    src: string;
    alt?: string | null;
  };
  details?: string[];
  callout?: string;
  cta?: {
    enabled?: boolean;
    label?: string;
    href?: string;
    external?: boolean;
  } | null;
}

export interface LifecycleCardProps {
  stage: LifecycleCardStage;
  isActive?: boolean;
  onMouseEnter?: () => void;
  onClick?: () => void;
  onLearnMore?: () => void;
  showLearnMore?: boolean;
}

/**
 * LifecycleCard
 *
 * Renders a single portrait lifecycle card with title, description,
 * callout or learn more button, and bottom-aligned illustration.
 *
 * Supports default (253x436, img 180px) and active (282x486, img 248px) states.
 */
export function LifecycleCard({
  stage,
  isActive = false,
  onMouseEnter,
  onClick,
  onLearnMore,
  showLearnMore = true,
}: LifecycleCardProps) {
  const hasCallout = Boolean(stage.callout);
  return (
    <article
      className={`${styles.card} ${isActive ? styles.cardActive : styles.cardDefault}`}
      data-lifecycle-stage={stage.id}
      data-active={isActive}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>{stage.title}</h3>
        <p className={styles.description}>{stage.description}</p>
        {hasCallout ? (
          <div
            className={`${styles.callout} ${
              isActive ? styles.calloutActive : ""
            }`}
          >
            {stage.cta?.href ? (
              <Link
                href={stage.cta.href}
                className={styles.calloutLink}
                onClick={(e) => e.stopPropagation()}
                aria-label={`${stage.callout} - ${stage.title}`}
              >
                {stage.callout}
              </Link>
            ) : (
              stage.callout
            )}
          </div>
        ) : showLearnMore ? (
          <button
            type="button"
            className={styles.learnMore}
            onClick={(e) => {
              e.stopPropagation();
              onLearnMore?.();
            }}
          >
            Learn more &gt;
          </button>
        ) : null}
      </div>

      <div
        className={`${styles.media} ${isActive ? styles.mediaActive : styles.mediaDefault}`}
      >
        <Image
          src={stage.media.src}
          alt={stage.media.alt || stage.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 282px"
          className={styles.image}
        />
      </div>
    </article>
  );
}

