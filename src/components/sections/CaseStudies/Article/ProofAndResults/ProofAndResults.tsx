import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { PageRibbon } from "@/components/ui/PageRibbon";
import type { ProofAndResultsProps } from "./types";
import styles from "./ProofAndResults.module.css";

/**
 * ProofAndResults (Case Study Section 6)
 *
 * Renders Section 6 ("Proof in production / Measured results") for the Case Study detail page:
 * - Block 1: "Proof in production" heading & description
 * - Block 2: "Measured results" heading & description
 * - 6 transparent glass Bento Results cards (14px backdrop blur)
 * - PageRibbon background layer (bg-ribbon.png)
 *
 * Data-driven from JSON blocks. Server Component.
 */
export function ProofAndResults({
  title = "Proof in production",
  description,
  subheadingBlock,
  metrics,
}: ProofAndResultsProps) {
  // Split title 1: "Proof in" purple, rest black
  const titleParts = title.startsWith("Proof in ")
    ? { highlight: "Proof in", rest: title.slice(8) }
    : { highlight: null, rest: title };

  // Split title 2: "Measured" purple, rest black
  const subHeading = subheadingBlock?.heading ?? "Measured results";
  const subTitleParts = subHeading.startsWith("Measured ")
    ? { highlight: "Measured", rest: subHeading.slice(8) }
    : { highlight: null, rest: subHeading };

  return (
    <section className={styles.proofAndResults}>
      <PageRibbon
        src="/images/case-studies/bg-ribbon.png"
        width={1920}
        height={960}
        className={styles.ribbonWrapper}
        imageClassName={styles.ribbonImage}
        priority={false}
      />

      <Container className={styles.container}>
        {/* Block 1: Proof in production */}
        <div className={styles.block}>
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

          {description && <p className={styles.description}>{description}</p>}
        </div>

        {/* Block 2: Measured results */}
        <div className={clsx(styles.block, styles.resultsBlock)}>
          <h2 className={styles.title}>
            {subTitleParts.highlight ? (
              <>
                <span className={styles.titleHighlight}>{subTitleParts.highlight}</span>
                {subTitleParts.rest}
              </>
            ) : (
              subHeading
            )}
          </h2>

          {subheadingBlock?.description && (
            <p className={styles.description}>{subheadingBlock.description}</p>
          )}

          {metrics && metrics.length > 0 && (
            <div className={styles.bentoGrid}>
              {metrics.map((m) => (
                <div
                  key={m.id}
                  className={clsx(
                    styles.card,
                    m.variant === "wide" ? styles.cardWide : styles.cardSmall
                  )}
                >
                  <div className={styles.metricValue}>{m.value}</div>
                  <div className={styles.metricLabel}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
