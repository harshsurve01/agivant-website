import Image from "next/image";
import type { AIStackLayoutProps } from "./types";
import styles from "./AgenticLayout.module.css";

/**
 * AgenticLayout
 *
 * Matches the "Agentic AI & AgentOps" card — the tall, row-spanning
 * card on the left of the bento grid. Text sits at the top, and the
 * ribbon artwork fills the remaining height below it, bleeding to the
 * card's own left/right/bottom edges (the shell's border-radius clips
 * it, so the bleed never escapes the rounded corners).
 *
 * Purely presentational: no "use client", no hooks, no effects, no
 * hover/pointer logic. AIStackCardShell renders this as `children`
 * inside its own rotating, preserve-3d container — this component has
 * no idea that tilt exists.
 */
export function AgenticLayout({
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
