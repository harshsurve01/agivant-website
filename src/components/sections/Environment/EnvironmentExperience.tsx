"use client";

import { useState } from "react";
import { EnvironmentTimeline } from "./EnvironmentTimeline";
import { EnvironmentCard } from "./EnvironmentCard";
import type { EnvironmentStage } from "@/data/environment";
import styles from "./EnvironmentExperience.module.css";

interface EnvironmentExperienceProps {
  stages: EnvironmentStage[];
}

/**
 * EnvironmentExperience
 *
 * The only Client Component in this section. Timeline and Card are
 * not two independent pieces that happen to sit next to each other —
 * they're one synchronized experience, and neither owns the
 * synchronization itself. That ownership has to live one level up,
 * in whichever component renders both: hence this component, not
 * EnvironmentTimeline or EnvironmentCard, holds `activeStageIndex`.
 *
 * It's a Client Component today — before any scroll listener exists —
 * for the same reason AIStackCard is a Client Component before its
 * tilt effect exists: the interaction this will eventually own
 * (mapping scroll progress to an active stage index, driving both the
 * timeline's progress state and the card's flip) is inherently
 * client-side, and drawing that boundary here now means adding the
 * scroll listener later is additive — wire up an effect that calls
 * `setActiveStageIndex`, no restructuring of what's already rendered.
 *
 * `setActiveStageIndex` is intentionally unused today. Nothing calls
 * it — there's no scroll listener, no click handler, no timer. It
 * exists now purely so that when the future scroll-driven progression
 * is implemented, it's calling into state that's already threaded
 * through Timeline and Card, rather than requiring this component's
 * body to change shape at the same time as the scroll logic is added.
 */
export function EnvironmentExperience({ stages }: EnvironmentExperienceProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- setter is wired up by the future scroll-sync implementation, not this pass
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = stages[activeStageIndex];

  return (
    <div className={styles.experience}>
      <EnvironmentTimeline stages={stages} activeStageId={activeStage.id} />
      <EnvironmentCard stage={activeStage} />
    </div>
  );
}
