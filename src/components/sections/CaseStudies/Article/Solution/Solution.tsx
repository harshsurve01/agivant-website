import { Container } from "@/components/ui/Container";
import styles from "./Solution.module.css";
import type { SolutionProps } from "./types";

/**
 * Solution (Case Study Inner Page)
 *
 * Renders the section directly below Objectives: a centered "Solution"
 * heading over a grid of cards (3 on the first row, 2 on the second),
 * each card holding one block of body copy framed by a purple
 * decorative line above and below. Figma: "Case Study Inside Page" →
 * text node 2100:2168 ("Solution") + card frames 2100:2147, 2100:2155,
 * 2100:2151 (row one) and 2100:2164, 2100:2160 (row two) — read
 * directly via the Figma MCP connector this pass. See
 * Solution.module.css for exact measurements and the two open
 * questions (decorative-line asset, section bottom spacing).
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no data imports. All content arrives via props.
 */
export function Solution({ title, items }: SolutionProps) {
  return (
    <section className={styles.solution}>
      <Container className={styles.container}>
        <h2 className={styles.title}>{title}</h2>

        <ul className={styles.grid}>
          {items.map((item, index) => (
            <li key={index} className={styles.card}>
              <span className={styles.line} aria-hidden="true" />
              <p className={styles.text}>{item}</p>
              <span className={styles.line} aria-hidden="true" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
