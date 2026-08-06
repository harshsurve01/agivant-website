import { EnvironmentCard } from "./EnvironmentCard";
import type { EnvironmentStage } from "@/data/environment";
import styles from "./EnvironmentCardDeck.module.css";

interface EnvironmentCardDeckProps {
  stages: EnvironmentStage[];
  activeIndex: number;
}

/**
 * EnvironmentCardDeck
 *
 * Renders every stage's card at once, absolutely stacked in one
 * shared box, and positions each one purely as a function of its
 * distance from `activeIndex` — this component holds no state of its
 * own and no scroll logic; EnvironmentExperience already computed
 * `activeIndex`, this just maps it onto the deck.
 *
 * Each card gets exactly one of three states, resolved once here
 * rather than left for CSS to infer from a signed number:
 *   - "active"   (offset === 0): the current top-of-deck card.
 *   - "upcoming" (offset > 0): still ahead in the stage order, stacked
 *     behind the active card with depth that increases with offset.
 *   - "exited"   (offset < 0): already scrolled past, peeling away.
 * `depth` (always ≥ 0) is the magnitude of that offset, exposed as a
 * CSS custom property so EnvironmentCardDeck.module.css can scale the
 * stagger/rotation per card with one formula instead of one rule per
 * stage index — this deck works the same way whether there are 5
 * stages or 8.
 *
 * Presentational: no "use client" of its own — it doesn't need one,
 * since it holds no hooks or state; it's only ever rendered from
 * inside EnvironmentExperience, which is already a Client Component,
 * so this still runs on the client without needing the directive
 * itself.
 */
export function EnvironmentCardDeck({ stages, activeIndex }: EnvironmentCardDeckProps) {
  return (
    <div className={styles.deck}>
      {stages.map((stage, index) => {
        const offset = index - activeIndex;
        const state = offset === 0 ? "active" : offset > 0 ? "upcoming" : "exited";
        const depth = Math.abs(offset);

        return (
          <div
            key={stage.id}
            className={styles.slot}
            data-state={state}
            style={{ ["--depth" as string]: depth }}
            aria-hidden={state !== "active"}
          >
            <EnvironmentCard stage={stage} />
          </div>
        );
      })}
    </div>
  );
}
