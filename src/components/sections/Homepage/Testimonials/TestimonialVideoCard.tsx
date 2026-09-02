import Image from "next/image";
import clsx from "clsx";
import type { TestimonialVideoCardData } from "@/data/testimonials";
import styles from "./TestimonialVideoCard.module.css";

interface TestimonialVideoCardProps {
  card: TestimonialVideoCardData;
  theme?: "black" | "light-purple";
}

/**
 * TestimonialVideoCard
 *
 * Renders a video testimonial card with high-resolution thumbnail,
 * client information, and interactive circular play button UI placeholder.
 */
export function TestimonialVideoCard({
  card,
  theme = "black",
}: TestimonialVideoCardProps) {
  const themeClass =
    theme === "light-purple" ? styles.themeLightPurple : styles.themeBlack;

  return (
    <div className={clsx(styles.card, themeClass)} data-testimonial-type="video">
      <div className={styles.mediaWrap}>
        <Image
          src={card.thumbnail.src}
          alt={card.thumbnail.alt}
          fill
          sizes="360px"
          className={styles.image}
          draggable={false}
        />
      </div>

      <div className={styles.infoWrap}>
        <div className={styles.authorInfo}>
          <span className={styles.authorName}>{card.author.name}</span>
          <span className={styles.authorDesignation}>
            {card.author.designation}
          </span>
        </div>

        <button
          type="button"
          className={styles.playButton}
          aria-label={`Play video testimonial from ${card.author.name}`}
          title="Play video testimonial"
        >
          <svg
            className={styles.playIcon}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
