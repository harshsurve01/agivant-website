import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import type { TestimonialTextCardData } from "@/data/testimonials";
import styles from "./TestimonialTextCard.module.css";

interface TestimonialTextCardProps {
  card: TestimonialTextCardData;
  theme?: "purple" | "black";
  quoteColor?: "gold" | "purple" | "black";
}

/**
 * TestimonialTextCard
 *
 * Renders a quote-driven testimonial card with a protruding quotation mark SVG asset,
 * 18px body copy, "Read more →" interaction, subtle divider, and client credentials.
 */
export function TestimonialTextCard({
  card,
  theme = "purple",
  quoteColor = "gold",
}: TestimonialTextCardProps) {
  const themeClass =
    theme === "black" ? styles.themeBlack : styles.themePurple;

  const quoteSrc =
    quoteColor === "purple"
      ? "/images/testimonials/purple-quote.svg"
      : quoteColor === "black"
      ? "/images/testimonials/black-quote.svg"
      : "/images/testimonials/quote.svg";

  return (
    <div className={clsx(styles.card, themeClass)} data-testimonial-type="text">
      {/* Protruding Quote Mark Graphic from existing SVG assets */}
      <Image
        src={quoteSrc}
        alt=""
        width={40}
        height={36}
        className={styles.quoteMark}
        aria-hidden="true"
        draggable={false}
      />

      <div className={styles.mainContent}>
        <p className={styles.testimonialText}>{card.testimonial}</p>

        {card.readMoreHref ? (
          <Link href={card.readMoreHref} className={styles.readMore}>
            {card.readMoreText}
          </Link>
        ) : (
          <span className={styles.readMore}>{card.readMoreText}</span>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.divider} aria-hidden="true" />
        <div className={styles.authorBlock}>
          <span className={styles.authorTitle}>{card.author.title}</span>
          <span className={styles.authorContext}>{card.author.context}</span>
        </div>
      </div>
    </div>
  );
}
