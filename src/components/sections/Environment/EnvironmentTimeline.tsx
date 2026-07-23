import { EnvironmentTimelineItem } from "./EnvironmentTimelineItem";
import type { EnvironmentStage } from "@/data/environment";
import styles from "./EnvironmentTimeline.module.css";

interface EnvironmentTimelineProps {
  stages: EnvironmentStage[];
  activeStageId: string;
  activeStageIndex: number;
  /** Continuous 0–1 scroll progress through the pinned experience —
   *  see EnvironmentExperience's "SCROLL → STATE" comment. Drives the
   *  line's segment fill directly so the fill moves smoothly with
   *  scroll instead of visibly snapping between steps. */
  progress: number;
}

/**
 * EnvironmentTimeline
 *
 * Presentation only — renders the vertical dot-and-line stage list.
 * It does not decide which stage is active or how far scrolled the
 * user is; both arrive as props from EnvironmentExperience. Keeping
 * this component free of its own scroll/state logic means it stays
 * identical whether the sync source is a scroll listener (today) or
 * something else later.
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
 * Server-renderable: no "use client", no hooks, no state — the
 * `progress` NUMBER it receives is just a prop, not something this
 * component subscribes to.
 */
export function EnvironmentTimeline({
  stages,
  activeStageId,
  activeStageIndex,
  progress,
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
            />
          ))}
        </ol>
      </div>
    </div>
  );
}
