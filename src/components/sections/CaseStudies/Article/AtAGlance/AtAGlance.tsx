import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import type { AtAGlanceProps } from "./types";
import styles from "./AtAGlance.module.css";

/**
 * AtAGlance (New Case Study Template)
 *
 * Renders the 5-item "At a glance" information panel:
 * - Section heading ("At a" in purple, "glance" in black)
 * - 2-column, 2-row grid for the first 4 items
 * - Full-width 5th item spanning the bottom of the panel
 *
 * Data-driven from JSON blocks. Server Component.
 */
export function AtAGlance({ title = "At a glance", blocks }: AtAGlanceProps) {
  // Split title: highlight "At a" in purple, rest in black
  const titleParts = title.startsWith("At a ")
    ? { highlight: "At a", rest: title.slice(4) }
    : { highlight: null, rest: title };

  return (
    <section className={styles.atAGlance}>
      <Container className={styles.container}>
        <h2 className={styles.title}>
          {titleParts.highlight ? (
            <>
              <span className={styles.titleHighlight}>{titleParts.highlight} </span>
              {titleParts.rest}
            </>
          ) : (
            title
          )}
        </h2>

        <div className={styles.panel}>
          {blocks.map((block, index) => {
            const isFullWidth = index === blocks.length - 1 && blocks.length % 2 !== 0;

            return (
              <div
                key={block.id || index}
                className={clsx(styles.cell, isFullWidth && styles.cellFullWidth)}
              >
                <h3 className={styles.cardTitle}>{block.title}</h3>
                <p className={styles.cardDescription}>{block.body}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
