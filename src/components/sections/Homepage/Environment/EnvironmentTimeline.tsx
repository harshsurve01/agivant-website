import { EnvironmentTimelineItem } from "./EnvironmentTimelineItem";
import type { EnvironmentStage } from "@/data/environment";
import styles from "./EnvironmentTimeline.module.css";

interface EnvironmentTimelineProps {
  stages: EnvironmentStage[];
  activeStageId: string;
  activeStageIndex: number;
  /** Stepped 0–1 progress through the stage sequence — see
   *  EnvironmentExperience's doc comment. Drives the line's segment
   *  fill. */
  progress: number;
  /** Called with a stage's index when its timeline item is hovered or
   *  focused (see EnvironmentExperience's "AUTO-ADVANCE +
   *  HOVER-TO-SELECT" comment, and EnvironmentTimelineItem's onSelect
   *  doc comment). This component doesn't decide what selecting a
   *  stage does, it just reports the interaction upward. */
  onSelectStage: (index: number) => void;
}

/**
 * EnvironmentTimeline
 *
 * Presentation only — renders the vertical dot-and-line stage list.
 * It does not decide which stage is active, how far along the
 * sequence we are, or what a hover/focus does; all of that arrives as
 * props from EnvironmentExperience. Keeping this component free of
 * its own state means it stays identical whether the active stage is
 * driven by the auto-advance timer or a manual hover.
 *
 * `.line`/`.lineFill` are rendered here, once, as a background layer
 * behind the whole list — not per-item — because the fill is one
 * continuous progress bar spanning all steps, not five independent
 * segments; splitting it per-item would need each item to know its
 * own position within the total track, which is exactly the
 * information this parent already has and each item shouldn't need.
 *
 * An <ol> rather than <ul>/<div> list because the stages are an
 * intrinsically ordered sequence (01–05), not an unordered
 * collection — the numbering in the design is semantic, not just
 * decorative.
 *
 * Server-renderable on its own (no hooks/state of its own) — it's
 * only a Client Component in practice because it's always rendered
 * from EnvironmentExperience, which already has "use client".
 */
export function EnvironmentTimeline({
  stages,
  activeStageId,
  activeStageIndex,
  progress,
  onSelectStage,
}: EnvironmentTimelineProps) {
  return (
    <div className={styles.timeline}>
      <span className={styles.domainLabel}>Engineering Domain</span>

      <div className={styles.track}>
        <div className={styles.line} aria-hidden="true">
          <div className={styles.lineFill} style={{ height: `${progress * 100}%` }} />
        </div>

        <ol className={styles.list}>
          {stages.map((stage, index) => (
            <EnvironmentTimelineItem
              key={stage.id}
              step={stage.step}
              title={stage.title}
              stat={stage.stat}
              isActive={stage.id === activeStageId}
              isPast={index < activeStageIndex}
              onSelect={() => onSelectStage(index)}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}