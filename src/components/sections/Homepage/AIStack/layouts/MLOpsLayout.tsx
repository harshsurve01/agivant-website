import Image from "next/image";
import type { AIStackLayoutProps } from "./types";
import styles from "./MLOpsLayout.module.css";

/**
 * MLOpsLayout
 *
 * Matches the "MLOps & AI Operations" card — bottom-right of the bento
 * grid. Same ribbon-on-top composition family as CloudPlatformLayout,
 * sized for this card's own slot. Kept as its own handcrafted file per
 * the Figma rather than reusing CloudPlatformLayout, so this card's
 * spacing/ribbon height can diverge independently later without
 * touching a shared component.
 *
 * Purely presentational: no "use client", no hooks, no hover/pointer
 * logic.
 */
export function MLOpsLayout({
  title,
  description,
  backgroundImage,
  accentColor,
  ribbonPosition,
}: AIStackLayoutProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.ribbon} aria-hidden="true">
        <Image
          src={backgroundImage} // TODO: replace with the real supplied ribbon asset
          alt=""
          fill
          className={styles.ribbonImage}
          style={{ objectPosition: ribbonPosition ?? "top" }}
        />
      </div>

      <div className={styles.text}>
        <h3 className={styles.title} style={{ color: accentColor }}>
          {title}
        </h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
