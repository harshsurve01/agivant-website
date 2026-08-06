import type { EnvironmentStage } from "@/data/environment";
import styles from "./EnvironmentCardFace.module.css";

interface EnvironmentCardFaceProps {
  stage: EnvironmentStage;
  variant: "front" | "back";
  className?: string;
}

/**
 * EnvironmentCardFace
 *
 * Owns a single face's content layout — currently just section groups
 * — with no animation and no flip logic of its own; positioning which
 * face is visible is EnvironmentCard's job (see .faceFront/.faceBack).
 *
 * No badge is rendered here: the supplied screenshots don't show one
 * on the Environment card, so neither the data model nor this
 * component models one. If a badge is added to the design later, it
 * belongs here alongside the section groups, not before.
 *
 * `variant="back"` renders an empty, inert placeholder rather than
 * omitting the node: no back-face content has been supplied by design
 * yet (see data/environment.ts), and this component's own job is only
 * to lay out whatever content a face has — inventing placeholder
 * copy here would blur that line. The node still needs to exist for
 * EnvironmentCard's flip-ready stacking to have something to flip to;
 * filling it in later is a content change, not a markup change.
 *
 * Section groups render from `stage.sections` — see
 * data/environment.ts's CONTENT MODELING NOTE for why that's an array
 * of {heading, body} groups instead of one paragraph.
 */
export function EnvironmentCardFace({ stage, variant, className }: EnvironmentCardFaceProps) {
  if (variant === "back") {
    return <div className={`${styles.face} ${className ?? ""}`} aria-hidden="true" />;
  }

  return (
    <div className={`${styles.face} ${className ?? ""}`}>
      <div className={styles.content}>
        {stage.sections.map((section) => (
          <div key={section.heading} className={styles.sectionGroup}>
            <h3 className={styles.sectionHeading}>{section.heading}</h3>
            <p className={styles.sectionBody}>{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}