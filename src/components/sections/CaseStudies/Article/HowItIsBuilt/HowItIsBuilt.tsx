import { Container } from "@/components/ui/Container";
import { PageRibbon } from "@/components/ui/PageRibbon";
import { ArrowRight } from "@/components/ui/Icon/ArrowRight";
import type { HowItIsBuiltProps } from "./types";
import styles from "./HowItIsBuilt.module.css";
import { Gradient } from "@/components/effects/Gradient";

/**
 * HowItIsBuilt (Case Study Section 5)
 *
 * Renders Section 5 ("How it is built") for the Case Study detail page:
 * - PageRibbon background layer (bg-ribbon.png)
 * - Section heading ("How" in Agivant purple, "it is built" in black)
 * - 6-row Architecture Table (solid purple left column, transparent glass right column)
 * - Two Before / After glass cards
 *
 * Data-driven from JSON blocks. Server Component.
 */
export function HowItIsBuilt({
  title = "How it is built",
  rows,
  beforeCard,
  afterCard,
}: HowItIsBuiltProps) {
  // Split title: highlight "How" in purple, rest in black
  const titleParts = title.startsWith("How ")
    ? { highlight: "How", rest: title.slice(3) }
    : { highlight: null, rest: title };

  return (
    <section className={styles.howItIsBuilt}>
       <Gradient
              kind="linear"
              angle="180deg"
              top="72%"
              right="25%"
              size="40rem"
              stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
              opacity={0.15}
              blur="90px"
            />
        <Gradient
         kind="linear"
              angle="180deg"
              top="10%"
              left="-20%"
              size="49rem"
              stops={[
                "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
                "transparent 100%",
              ]}
              opacity={0.49}
              blur="60px"
            />
      <PageRibbon
        src="/images/case-studies/section-ribbon.png"
        width={1920}
        height={960}
        className={styles.ribbonWrapper}
        imageClassName={styles.ribbonImage}
        priority={false}
      />

      <Container className={styles.container}>
        <div className={styles.contentWrapper}>
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

          {rows && rows.length > 0 && (
            <div className={styles.tableContainer}>
              <div className={styles.table}>
                <div className={styles.leftColumn}>
                  {rows.map((row) => (
                    <div key={`left-${row.id}`} className={styles.leftRow}>
                      {row.label}
                    </div>
                  ))}
                </div>

                <div className={styles.rightColumn}>
                  {rows.map((row) => (
                    <div key={`right-${row.id}`} className={styles.rightRow}>
                      {row.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(beforeCard || afterCard) && (
            <div className={styles.cardsGrid}>
              {beforeCard && (
                <div className={styles.card}>
                  <div className={styles.iconBadge} aria-hidden="true">
                    <ArrowRight style={{ transform: "rotate(180deg)" }} />
                  </div>
                  <h3 className={styles.cardTitle}>{beforeCard.title}</h3>
                  <p className={styles.cardDescription}>{beforeCard.body}</p>
                </div>
              )}

              {afterCard && (
                <div className={styles.card}>
                  <div className={styles.iconBadge} aria-hidden="true">
                    <ArrowRight />
                  </div>
                  <h3 className={styles.cardTitle}>{afterCard.title}</h3>
                  <p className={styles.cardDescription}>{afterCard.body}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
