import { AmpCard } from "./AmpCard";
import type { AmpColumnData } from "@/data/ampTransformation";
import styles from "./AmpColumn.module.css";

interface AmpColumnProps {
  column: AmpColumnData;
  /** Which side of the hub this column renders on. Passed straight
   *  through to every AmpCard so AmpConnectors can tell left cards
   *  from right cards via the DOM — see AmpCard.tsx. */
  side: "left" | "right";
}

/**
 * AmpColumn
 *
 * Reusable column: a title plus a stack of cards. The exact same
 * component renders both the left ("The Agivant Amp'd Way") and right
 * ("What Global Enterprises Gain") columns in the supplied
 * screenshot — only the `column` object (and `side` tag) passed in
 * differs — per the implementation brief's "the same component must
 * be used for both left and right columns."
 *
 * Renders `column.cards` with `.map`, not a fixed number of <AmpCard/>
 * elements, so the section keeps working if a future WordPress
 * response supplies three cards or six — see "Do NOT assume there are
 * always four cards." AmpConnectors relies on this too: it discovers
 * however many cards actually rendered via the DOM, not a count from
 * data.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function AmpColumn({ column, side }: AmpColumnProps) {
  return (
    <div className={styles.column}>
      <h3 className={styles.title}>{column.title}</h3>

      <ul className={styles.cards}>
        {column.cards.map((card) => (
          <li key={card.id}>
            <AmpCard card={card} side={side} />
          </li>
        ))}
      </ul>
    </div>
  );
}