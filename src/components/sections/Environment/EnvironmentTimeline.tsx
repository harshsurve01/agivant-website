import { EnvironmentTimelineItem } from "./EnvironmentTimelineItem";
import type { EnvironmentStage } from "@/data/environment";
import styles from "./EnvironmentTimeline.module.css";

interface EnvironmentTimelineProps {
  stages: EnvironmentStage[];
  activeStageId: string;
}

/**
 * EnvironmentTimeline
 *
 * Presentation only — renders the numbered stage list and which item
 * currently looks active. It does not decide which stage is active;
 * that decision belongs to EnvironmentExperience and arrives here as
 * `activeStageId`. Keeping this component free of state means the
 * future scroll-driven progression only has to change what
 * EnvironmentExperience passes down, not how this component is built.
 *
 * An <ol> rather than <ul>/<div> list because the stages are an
 * intrinsically ordered sequence (01–05), not an unordered
 * collection — the numbering in the design is semantic, not just
 * decorative.
 *
 * Server-renderable: no "use client", no hooks, no state.
 */
export function EnvironmentTimeline({ stages, activeStageId }: EnvironmentTimelineProps) {
  return (
    <div className={styles.timeline}>
      <span className={styles.domainLabel}>Engineering Domain</span>

      <ol className={styles.list}>
        {stages.map((stage) => (
          <EnvironmentTimelineItem
            key={stage.id}
            step={stage.step}
            title={stage.title}
            isActive={stage.id === activeStageId}
          />
        ))}
      </ol>
    </div>
  );
}
