import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import type { SolutionOfferingsProps, OfferingCardProps } from "./types";
import styles from "./SolutionOfferings.module.css";

const HIGHLIGHT_PHRASE = "Build on an agent stack";

/**
 * Maps assetKey or block ID to local image path in public directory.
 */
const OFFERING_ASSETS: Record<string, string> = {
  "solution-strategy":
    "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/solution-strategy.png",
  "solution-lifecycle":
    "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/solution-lifecycle.png",
  "solution-embedded-ai":
    "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/solution-embedded-ai.png",
  "solution-vertical-packs":
    "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/solution-vertical-packs.png",
  "solution-policy":
    "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/solution-policy.png",
  "solution-mesh":
    "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/solution-mesh.png",
  strategy:
    "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/solution-strategy.png",
  lifecycle:
    "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/solution-lifecycle.png",
  "embedded-ai":
    "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/solution-embedded-ai.png",
  "vertical-packs":
    "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/solution-vertical-packs.png",
  policy:
    "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/solution-policy.png",
  mesh:
    "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/solution-mesh.png",
};

/**
 * Resolves the image source for a solution offering block.
 */
function resolveImageSrc(block: OfferingCardProps["block"]): string {
  if (block.media?.src) return block.media.src;
  if (block.media?.assetKey && OFFERING_ASSETS[block.media.assetKey]) {
    return OFFERING_ASSETS[block.media.assetKey];
  }
  if (OFFERING_ASSETS[block.id]) {
    return OFFERING_ASSETS[block.id];
  }
  return `/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/${block.media?.assetKey || block.id}.png`;
}

/**
 * Renders the section heading with the designated phrase highlighted in brand purple.
 */
function renderHeading(heading: string) {
  if (heading.includes(HIGHLIGHT_PHRASE)) {
    const parts = heading.split(HIGHLIGHT_PHRASE);
    return (
      <>
        {parts[0]}
        <span className={styles.highlight}>{HIGHLIGHT_PHRASE}</span>
        {parts[1] || ""}
      </>
    );
  }
  return heading;
}

/**
 * Single Offering Card with alternating image/content orientation:
 * - Even index (0, 2, 4): Image TOP, Content BOTTOM
 * - Odd index (1, 3, 5): Content TOP, Image BOTTOM
 */
function OfferingCard({ block, index }: OfferingCardProps) {
  const isContentTop = index % 2 === 1;
  const imageSrc = resolveImageSrc(block);
  const altText = block.media?.alt || block.title || "Solution offering visual";

  return (
    <li
      className={clsx(
        styles.card,
        isContentTop && styles.cardContentTop
      )}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt={altText}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 387px"
          className={styles.cardImage}
        />
      </div>

      <div className={styles.content}>
        {block.title && <h3 className={styles.cardTitle}>{block.title}</h3>}
        {block.body && <p className={styles.cardBody}>{block.body}</p>}
      </div>
    </li>
  );
}

/**
 * SolutionOfferings (Solution Inner Page: /solutions/[slug])
 *
 * Section: "solution-offerings"
 * - Main heading: "Build on an agent stack that already runs in production"
 *   with "Build on an agent stack" highlighted in brand purple.
 * - Intro description: "Agivant covers the full path from choosing the first use case to operating a fleet of agents."
 * - Centered purple eyebrow: "SOLUTION OFFERINGS".
 * - 3-column × 2-row grid of 6 alternating cards (387px × 403px).
 * - Centered purple closing statement: "Each deployment leaves patterns the next one starts from."
 *
 * Server Component: all data arrives via typed props.
 */
export function SolutionOfferings({ data, blocks }: SolutionOfferingsProps) {
  if (!data || !blocks?.length) return null;

  const { heading, description, eyebrow, closingStatement } = data;
  const resolvedEyebrow = eyebrow ?? "SOLUTION OFFERINGS";
  const resolvedClosing =
    closingStatement ?? "Each deployment leaves patterns the next one starts from.";

  return (
    <section className={styles.section} id="solution-offerings">
      <Container className={styles.container}>
        <header className={styles.header}>
          {heading && (
            <h2 className={styles.heading}>{renderHeading(heading)}</h2>
          )}

          {description && (
            <p className={styles.description}>{description}</p>
          )}

          {resolvedEyebrow && (
            <p className={styles.eyebrow}>{resolvedEyebrow}</p>
          )}
        </header>

        <ul className={styles.grid}>
          {blocks.map((block, index) => (
            <OfferingCard key={block.id || index} block={block} index={index} />
          ))}
        </ul>

        {resolvedClosing && (
          <p className={styles.closingStatement}>{resolvedClosing}</p>
        )}
      </Container>
    </section>
  );
}
