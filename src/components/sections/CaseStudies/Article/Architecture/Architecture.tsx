import Image from "next/image";
import { Container } from "@/components/ui/Container";
import styles from "./Architecture.module.css";
import type { ArchitectureProps } from "./types";
import { Gradient } from "@/components/effects/Gradient";

/**
 * Architecture / Data Sources (Case Study Inner Page)
 *
 * Renders the final section of the Case Study Article, directly below
 * Outcome: the Data Sources -> Orchestration -> Analysis ->
 * Visualisation workflow diagram, presented as a single provided
 * image asset inside a large rounded card.
 *
 * Per the brief, the diagram is NEVER recreated with HTML/CSS/React
 * nodes/SVG/manually-drawn connectors — it is rendered exactly as
 * supplied, scaled proportionally, never stretched or cropped.
 *
 * This pass had no live Figma MCP connection (no file/node URL was
 * provided alongside the brief — only two reference screenshots, one
 * plain and one with Figma's own dev-mode selection overlay reporting
 * the container as 1250 x 715.45px). Container width, background,
 * radius, shadow, and internal image padding below are ESTIMATED by
 * pixel-measuring those two screenshots (edge-detecting the card's
 * ~247,247,247 fill against the page background to find its true
 * bounds, then a ~1.68x screenshot->real scale derived from the
 * confirmed 1250 x 715.45 label) rather than read live from Figma —
 * see Architecture.module.css for the full derivation and every
 * flagged assumption. The soft pink/peach corner tints visible in the
 * screenshots are this route's existing GradientLayerProvider page
 * background showing through, not a decoration owned by this card, so
 * nothing extra was added here to reproduce them.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no data imports. Image src/alt and intrinsic dimensions all arrive
 * via props from page.tsx, through Article.
 */
export function Architecture({
  image,
  imageWidth,
  imageHeight,
}: ArchitectureProps) {
  return (
    <section className={styles.architecture}>
         <Gradient
                   kind="linear"
                   angle="180deg"
                   top="60%"
                   left="-25%"
                   size="45rem"
                   stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
                   opacity={0.15}
                   blur="90px"
                 />
                  <Gradient
             top="70%"
             right="25%"
             size="32rem"
             stops={[
               "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
               "transparent 100%",
             ]}
             opacity={0.28}
             blur="60px"
           />
      <Container className={styles.container}>
        <div className={styles.card}>
          <Image
            src={image.src}
            alt={image.alt}
            width={imageWidth}
            height={imageHeight}
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1050px"
          />
        </div>
      </Container>
    </section>
  );
}
