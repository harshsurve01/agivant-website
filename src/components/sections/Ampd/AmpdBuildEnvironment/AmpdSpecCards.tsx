import type { AmpdSpecCardsProps } from "./types";
import styles from "./AmpdBuildEnvironment.module.css";

/**
 * AmpdSpecCards — light cards with a purple triangle marker, purple title and
 * body, in a two-column grid. An odd last card spans the full width.
 */
export function AmpdSpecCards({ cards }: AmpdSpecCardsProps) {
  if (!cards.length) return null;
  return (
    <ul className={styles.specCards}>
      {cards.map((card) => (
        <li key={card.id} className={styles.specCard}>
          <span className={styles.specMarker} aria-hidden="true" />
          <div>
            <h4 className={styles.specTitle}>{card.title}</h4>
            <p className={styles.specBody}>{card.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
