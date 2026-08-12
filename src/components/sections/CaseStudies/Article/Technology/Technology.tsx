import { Container } from "@/components/ui/Container";
import styles from "./Technology.module.css";
import type { TechnologyProps } from "./types";

/**
 * Technology (Case Study Inner Page)
 *
 * Renders the section directly below Solution: a centered "Technology"
 * heading, a centered two-line technology list, and a separate
 * "Anaplan for productivity modelling" line beneath it. Figma:
 * "Case Study Inside Page" (node 2100:2083) — this pass's Figma MCP
 * connector calls were rate-limited (Starter plan tool-call limit),
 * so layout/spacing below are estimated by pixel-measuring the
 * provided screenshot and cross-checking against this page's own
 * already-Figma-sourced sections (Solution/Objectives), not read live
 * from the file. See Technology.module.css for the exact derivation
 * and every flagged assumption.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no data imports. All content arrives via props.
 */
export function Technology({
  title,
  technologies,
  additionalText,
}: TechnologyProps) {
  return (
    <section className={styles.technology}>
      <Container className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.technologies}>{technologies}</p>
        <p className={styles.additionalText}>{additionalText}</p>
      </Container>
    </section>
  );
}
