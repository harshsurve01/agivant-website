import Image from "next/image";
import type { AIStackLayoutProps } from "./types";
import styles from "./CloudPlatformLayout.module.css";

/**
 * CloudPlatformLayout
 *
 * Matches the "Cloud & Platform Engineering" card — top-right of the
 * bento grid. Inverted composition from AgenticLayout/
 * AIMLEngineeringLayout: the ribbon art sits ABOVE the text here,
 * bleeding to the card's top/left/right edges, with the title and
 * description below it. This is exactly the kind of per-card
 * difference the layout split exists for — DataEngineeringLayout puts
 * its ribbon on the same side as Agentic/AI-ML, while this one and
 * MLOpsLayout put it on top.
 *
 * Purely presentational: no "use client", no hooks, no hover/pointer
 * logic.
 */
export function CloudPlatformLayout({
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
