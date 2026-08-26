import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import type {
  AgenticEnterpriseData,
  AgenticEnterpriseBlockData,
} from "@/types/partnerDetail";
import styles from "./AgenticEnterprise.module.css";

export interface AgenticEnterpriseProps {
  data: AgenticEnterpriseData;
}

/**
 * AgenticEnterprise
 *
 * Section 03 of the Partner Detail Page (/partners/[slug]).
 * Reusable presentation component rendering editorial story blocks:
 * - 03A: Text + Image (AI Ambition -> Autonomous Workflows)
 * - 03B: Text + Metric Rows + Closing Statement (Coordinated Agent Teams)
 * - 03C: Image + Text + Closing Statement (Teams Stay in Control)
 * - 03D: Text + Image (Scale securely on Google Cloud)
 *
 * All editorial content is received via typed props from data/partners.ts.
 * Consumes design tokens exclusively from variables.css.
 *
 * Server Component: pure presentation, no client overhead.
 */
export function AgenticEnterprise({ data }: AgenticEnterpriseProps) {
  if (!data?.blocks?.length) return null;

  return (
    <section className={styles.section} id="agentic-enterprise">
      <Container size="xl" className={styles.container}>
        <div className={styles.blocks}>
          {data.blocks.map((block) => {
            if (block.layout === "text-metrics" || block.metrics) {
              return <MetricsBlock key={block.id} block={block} />;
            }
            return <ImageBlock key={block.id} block={block} />;
          })}
        </div>
      </Container>
    </section>
  );
}

/**
 * Standard Heading sub-element
 */
function BlockHeading({
  heading,
  className,
}: {
  heading: AgenticEnterpriseBlockData["heading"];
  className?: string;
}) {
  return (
    <h3 className={clsx(styles.heading, className)}>
      {heading.prefix && (
        <span className={styles.darkText}>
          {heading.prefix}
          {heading.prefix.endsWith("\n") ? "" : " "}
        </span>
      )}
      {heading.highlight && (
        <span className={styles.purpleText}>
          {heading.highlight}
          {heading.highlight.endsWith("\n") ? "" : " "}
        </span>
      )}
      {heading.suffix && (
        <span className={styles.darkText}>{heading.suffix}</span>
      )}
      {heading.text && <span className={styles.darkText}>{heading.text}</span>}
    </h3>
  );
}

/**
 * Image Block (e.g. 03A, 03C, 03D)
 */
function ImageBlock({ block }: { block: AgenticEnterpriseBlockData }) {
  return (
    <article
      data-block-id={block.id}
      className={clsx(
        styles.block,
        styles.imageBlock,
        block.layout === "image-text" && styles.imageFirst
      )}
    >
      <div className={styles.textContent}>
        <BlockHeading heading={block.heading} />
        {block.body && <p className={styles.body}>{block.body}</p>}
        {block.closingStatement && (
          <p className={styles.closingStatement}>{block.closingStatement}</p>
        )}
      </div>

      {block.image && (
        <div className={styles.imageWrapper}>
          <Image
            src={block.image.src}
            alt={block.image.alt}
            width={block.image.width}
            height={block.image.height}
            className={styles.image}
          />
        </div>
      )}
    </article>
  );
}

/**
 * Metrics Block (e.g. 03B)
 */
function MetricsBlock({ block }: { block: AgenticEnterpriseBlockData }) {
  const closingText =
    block.closingStatement || block.metrics?.closingStatement;

  return (
    <article
      data-block-id={block.id}
      className={clsx(styles.block, styles.metricsBlock)}
    >
      <BlockHeading heading={block.heading} className={styles.metricsHeading} />

      <div className={styles.metricsContentGrid}>
        <div className={styles.metricsDescriptionCol}>
          {block.body && <p className={styles.body}>{block.body}</p>}
        </div>

        {block.metrics && (
          <div className={styles.metricsCol}>
            <ul className={styles.metricsList}>
              {block.metrics.items.map((item, idx) => (
                <li key={idx} className={styles.metricItem}>
                  <span className={styles.metricDot} aria-hidden="true" />
                  <span className={styles.metricText}>{item}</span>
                </li>
              ))}
            </ul>

            {closingText && (
              <p className={styles.closingStatement}>{closingText}</p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
