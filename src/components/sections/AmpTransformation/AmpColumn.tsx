import { AmpNode } from "./AmpNode";
import type { AmpColumnData } from "@/data/ampTransformation";
import styles from "./AmpColumn.module.css";

interface AmpColumnProps {
  column: AmpColumnData;
  /** Which side of the core this column renders on. Passed straight
   *  through to every AmpNode so AmpConnectorLayer can tell left
   *  nodes from right nodes via the DOM — see AmpNode.tsx. Also
   *  drives which way `column.label` rotates (see AmpColumn.module.css). */
  side: "left" | "right";
}

/**
 * AmpColumn
 *
 * Reusable column: an optional rotated side label, a title, and a
 * stack of nodes. The exact same component renders both the left
 * ("The Agivant Amp'd Way") and right ("What Global Enterprises
 * Gain") columns — only the `column` object (and `side` tag) passed
 * in differs.
 *
 * `column.label` renders in its own `<span data-amp-column-label>`,
 * separate from both `.title` and the `<ul>` of nodes — not just for
 * visual positioning (it sits in the outer margin, rotated, per the
 * reference screenshot) but so it's independently addressable for
 * animation later: it can be held static, faded in with the column,
 * or staggered separately from the node reveal without touching
 * anything else in this component.
 *
 * Renders `column.cards` with `.map`, not a fixed number of <AmpNode/>
 * elements, so the section keeps working if a future WordPress
 * response supplies three cards or six — see "Do NOT assume there are
 * always four cards." AmpConnectorLayer relies on this too: it discovers
 * however many cards actually rendered via the DOM, not a count from
 * data.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function AmpColumn({ column, side }: AmpColumnProps) {
  return (
    <div className={styles.column} data-amp-side={side}>
      {column.label ? (
        <span
          className={styles.label}
          data-amp-column-label={side}
        >
          {column.label}
        </span>
      ) : null}

      <div className={styles.stack}>
        <h3 className={styles.title}>{column.title}</h3>

        <ul className={styles.cards}>
          {column.cards.map((card) => (
            <li key={card.id}>
              <AmpNode card={card} side={side} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
