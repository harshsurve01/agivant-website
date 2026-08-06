import Image from "next/image";
import type { AIStackLayoutProps } from "./types";
import styles from "./DataEngineeringLayout.module.css";

/**
 * DataEngineeringLayout
 *
 * Matches the "AI-Ready Data Engineering" card — bottom-middle of the
 * bento grid. Same top-text / bottom-ribbon composition family as
 * AgenticLayout and AIMLEngineeringLayout, sized for this card's own
 * slot in the grid (taller than AIMLEngineeringLayout's card, since
 * this one carries a longer description). Its own handcrafted file
 * per the Figma — not a shared "bottom ribbon" component — so its
 * spacing can diverge from its siblings independently.
 *
 * Purely presentational: no "use client", no hooks, no hover/pointer
 * logic.
 */
export function DataEngineeringLayout({
  title,
  description,
  backgroundImage,
  accentColor,
  ribbonPosition,
}: AIStackLayoutProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.text}>
        <h3 className={styles.title} style={{ color: accentColor }}>
          {title}
        </h3>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.ribbon} aria-hidden="true">
        <Image
          src={backgroundImage} // TODO: replace with the real supplied ribbon asset
          alt=""
          fill
          className={styles.ribbonImage}
          style={{ objectPosition: ribbonPosition ?? "bottom" }}
        />
      </div>
    </div>
  );
}
