import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icon/ArrowRight";
import { GlassCard } from "../GlassCard";
import type { RepeatablePatternProps } from "./types";
import styles from "./RepeatablePattern.module.css";

/**
 * RepeatablePattern (Case Study Section 7)
 *
 * Renders Section 7 ("The repeatable pattern") for the Case Study detail page:
 * - Section heading ("The repeatable" in Agivant purple, "pattern" in black)
 * - Two top cards (Reusable asset, Challenges overcome) via shared GlassCard
 * - Wide client quote card with "Client leadership" attribution
 * - Enterprise movement block (Foundational → Operational [active] → path to Autonomous)
 * - Transparent background allowing Section 6 ribbon to flow naturally across the top
 *
 * Data-driven from JSON blocks. Server Component.
 */
export function RepeatablePattern({
  title = "The repeatable pattern",
  cards,
  quote,
  movement,
}: RepeatablePatternProps) {
  // Split title: "The repeatable" purple, "pattern" black
  const titleParts = title.startsWith("The repeatable ")
    ? { highlight: "The repeatable", rest: title.slice(14) }
    : { highlight: null, rest: title };

  return (
    <section className={styles.repeatablePattern}>
      <Container className={styles.container}>
        <h2 className={styles.title}>
          {titleParts.highlight ? (
            <>
              <span className={styles.titleHighlight}>{titleParts.highlight}</span>
              {titleParts.rest}
            </>
          ) : (
            title
          )}
        </h2>

        {cards && cards.length > 0 && (
          <div className={styles.cardsGrid}>
            {cards.map((card) => (
              <GlassCard
                key={card.id}
                title={card.title}
                description={card.body}
              />
            ))}
          </div>
        )}

        {quote && (
          <div className={styles.quoteCard}>
            <p className={styles.quoteBody}>{quote.body}</p>
            <div className={styles.quoteAuthor}>{quote.author}</div>
          </div>
        )}

        {movement && (
          <div className={styles.movementBlock}>
            <h3 className={styles.movementHeading}>{movement.heading}</h3>

            <div className={styles.progressionRow}>
              {movement.stages.map((stage, idx) => (
                <div key={stage.id} style={{ display: "contents" }}>
                  <div
                    className={
                      stage.status === "active"
                        ? styles.stageActive
                        : styles.stageDefault
                    }
                  >
                    {stage.label}
                  </div>

                  {idx < movement.stages.length - 1 && (
                    <div className={styles.stageArrow} aria-hidden="true">
                      <ArrowRight />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
