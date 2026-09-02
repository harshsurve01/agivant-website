import Image from "next/image";
import type { LifecycleStage } from "@/data/lifecycle";
import styles from "./LifecycleCard.module.css";

interface LifecycleCardProps {
  stage: LifecycleStage;
  isActive?: boolean;
  onMouseEnter?: () => void;
}

/**
 * LifecycleCard
 *
 * Renders a single portrait lifecycle card with title, description,
 * and bottom-aligned illustration.
 *
 * Supports default (253x436, img 180px) and active (282x486, img 248px) states.
 */
export function LifecycleCard({
  stage,
  isActive = false,
  onMouseEnter,
}: LifecycleCardProps) {
  return (
    <article
      className={`${styles.card} ${isActive ? styles.cardActive : styles.cardDefault}`}
      data-lifecycle-stage={stage.id}
      data-active={isActive}
      onMouseEnter={onMouseEnter}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>{stage.title}</h3>
        <p className={styles.description}>{stage.description}</p>
      </div>

      <div
        className={`${styles.media} ${isActive ? styles.mediaActive : styles.mediaDefault}`}
      >
        <Image
          src={stage.media.src}
          alt={stage.media.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 282px"
          className={styles.image}
        />
      </div>
    </article>
  );
}
