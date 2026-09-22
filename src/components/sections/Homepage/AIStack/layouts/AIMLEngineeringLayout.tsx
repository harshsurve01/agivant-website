import Image from "next/image";
import clsx from "clsx";
import { AIStackBullets } from "./AIStackBullets";
import type { AIStackLayoutProps } from "./types";
import styles from "./AIMLEngineeringLayout.module.css";

/**
 * AIMLEngineeringLayout
 *
 * Matches the "AI & ML Engineering" card — top-middle of the bento
 * grid. Same top-text / bottom-ribbon composition idea as
 * AgenticLayout, but this card is shorter (it doesn't row-span), so
 * its own module.css gives the ribbon a smaller minimum height rather
 * than sharing AgenticLayout's sizing. Handcrafted per the Figma, not
 * derived from a shared "ribbon layout" abstraction — see the AIStack
 * implementation prompt's explicit ban on generic layout names.
 *
 * Purely presentational: no "use client", no hooks, no hover/pointer
 * logic.
 */
export function AIMLEngineeringLayout({
  title,
  description,
  bullets,
  backgroundImage,
  accentColor,
  ribbonPosition,
  hasBadge,
}: AIStackLayoutProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.text}>
        <h3
          className={clsx(
            styles.title,
            hasBadge === false && styles.titleNoBadge
          )}
          style={{ color: accentColor }}
        >
          {title}
        </h3>
        {bullets && bullets.length > 0 ? (
          <AIStackBullets bullets={bullets} />
        ) : (
          description && <p className={styles.description}>{description}</p>
        )}
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
