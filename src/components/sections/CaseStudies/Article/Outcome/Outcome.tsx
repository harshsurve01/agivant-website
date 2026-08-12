import { Container } from "@/components/ui/Container";
import { OutcomeItem } from "./OutcomeItem";
import styles from "./Outcome.module.css";
import type { OutcomeProps } from "./types";

/**
 * Outcome (Case Study Inner Page)
 *
 * Renders the section directly below Technology: a centered "Outcome"
 * heading over a 7-item, 3-column result grid (3 items on row one, 3
 * on row two, and the 7th centered under the middle column on row
 * three). Figma: "Case Study Inside Page" (node 2100:2083). This
 * pass's Figma MCP connector calls were rate-limited (Starter plan
 * tool-call limit), so layout/spacing are estimated by pixel-measuring
 * the reference screenshot instead of a live Figma read — see
 * Outcome.module.css and OutcomeItem.module.css for the full
 * derivation and every flagged assumption.
 *
 * Per-row divider lines (confirmed in the screenshot as two SEPARATE
 * segments — one per row, not one continuous line down the grid) are
 * implemented as a `border-inline-end` on every item except the last
 * item in each row and the final (7th, row-3) item, driven by
 * `position` in Outcome.module.css — not a decorative pseudo-element
 * asset, since a plain 1px rule reproduces it exactly at any height.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no data imports. All content arrives via props.
 */
export function Outcome({ title, items }: OutcomeProps) {
  return (
    <section className={styles.outcome}>
      <Container className={styles.container}>
        <h2 className={styles.title}>{title}</h2>

        <ul className={styles.grid}>
          {items.map((item, i) => (
            <OutcomeItem key={item.index} {...item} position={i + 1} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
