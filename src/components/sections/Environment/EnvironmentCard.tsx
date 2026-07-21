import { EnvironmentCardFace } from "./EnvironmentCardFace";
import type { EnvironmentStage } from "@/data/environment";
import styles from "./EnvironmentCard.module.css";

interface EnvironmentCardProps {
  stage: EnvironmentStage;
}

/**
 * EnvironmentCard
 *
 * The card shell and its visual layers. Both faces — Front and Back —
 * are rendered into the DOM now, stacked absolutely on top of each
 * other inside .faceStack, even though only the front is visible
 * today (.faceBack is hidden via visibility/opacity, not display:none
 * — see that class's comment for why the distinction matters).
 *
 * This mirrors AIStackCard's reasoning for pre-splitting its layers
 * before the tilt effect needed them split: the future 3D flip
 * animates between two faces that both already have to exist as
 * independent, positioned DOM nodes for a flip transform to work at
 * all. Building that structure in now — instead of only rendering
 * FrontFace and adding BackFace when the flip is implemented — means
 * the flip work only has to add a transform and toggle two class
 * names, not restructure this component's markup.
 *
 * Presentation only: no "use client", no hooks, no state, no
 * animation, no flip logic.
 */
export function EnvironmentCard({ stage }: EnvironmentCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.faceStack}>
        <EnvironmentCardFace stage={stage} variant="front" className={styles.faceFront} />
        <EnvironmentCardFace stage={stage} variant="back" className={styles.faceBack} />
      </div>
    </div>
  );
}
