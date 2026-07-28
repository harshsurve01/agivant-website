"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { EnvironmentTimeline } from "./EnvironmentTimeline";
import { EnvironmentCardDeck } from "./EnvironmentCardDeck";
import type { EnvironmentStage } from "@/data/environment";
import styles from "./EnvironmentExperience.module.css";

const AUTO_ADVANCE_MS = 5000;

interface EnvironmentExperienceProps {
  /** Pre-rendered by Environment (a Server Component) and passed in
   *  as a slot — see Environment.tsx's doc comment for why this can't
   *  just be an `import { EnvironmentHeader } from "./EnvironmentHeader"`
   *  inside this Client Component file. This component never inspects
   *  or re-renders it; it only decides where it sits in the layout. */
  header: ReactNode;
  stages: EnvironmentStage[];
  /** Same pre-rendered-slot reasoning as `header`, for the section's
   *  closing CTA (Link + Button). */
  cta: ReactNode;
}

/**
 * EnvironmentExperience
 *
 * Owns the section's storytelling experience — heading, Timeline, and
 * Card Deck — plus the CTA that follows it.
 *
 * `header` and `cta` arrive as already-rendered ReactNode props (see
 * the interface above) rather than being imported and rendered here.
 * `stages` remains plain serializable data, since the auto-advance
 * logic below needs to read `stages.length` and index into it.
 *
 * AUTO-ADVANCE + CLICK-TO-SELECT
 * There's no more scroll-driven pin here — `activeStageIndex` is now
 * just state, changed one of two ways:
 *   1. Automatically, every AUTO_ADVANCE_MS, advancing to the next
 *      stage (wrapping back to 0 after the last one).
 *   2. Immediately, when the person clicks a timeline item — see
 *      `handleSelectStage`, passed down to EnvironmentTimeline.
 * Both paths go through the same `setActiveStageIndex`, so the
 * auto-advance timer (a `setTimeout` re-armed on every change to
 * `activeStageIndex` — see the effect below) naturally restarts its
 * 30s countdown whenever the person manually picks a stage, instead
 * of firing mid-way through their choice.
 *
 * A `setTimeout` re-armed per change (rather than a single
 * `setInterval`) is what makes that restart-on-click behavior work
 * for free: the effect's cleanup clears the pending timeout whenever
 * `activeStageIndex` changes for *any* reason, and the next render
 * schedules a fresh 30s wait from that new point.
 *
 * `progress` (0–1) now reflects how far through the stage sequence
 * we are — `activeStageIndex / (stages.length - 1)` — so the
 * timeline's line-fill still tracks the active stage the same way it
 * used to track scroll, just stepped instead of continuous.
 */
export function EnvironmentExperience({ header, stages, cta }: EnvironmentExperienceProps) {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (stages.length <= 1) return;

    timeoutRef.current = setTimeout(() => {
      setActiveStageIndex((prev) => (prev + 1) % stages.length);
    }, AUTO_ADVANCE_MS);

    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, [activeStageIndex, stages.length]);

  const handleSelectStage = useCallback((index: number) => {
    setActiveStageIndex(index);
  }, []);

  const activeStage = stages[activeStageIndex];
  const progress = stages.length > 1 ? activeStageIndex / (stages.length - 1) : 1;

  return (
    <div className={styles.environmentExperience}>
      <div className={styles.stageInner}>
        {header}

        <div className={styles.experience}>
          <EnvironmentTimeline
            stages={stages}
            activeStageId={activeStage.id}
            activeStageIndex={activeStageIndex}
            progress={progress}
            onSelectStage={handleSelectStage}
          />
          <EnvironmentCardDeck stages={stages} activeIndex={activeStageIndex} />
        </div>
      </div>

      <div className={styles.ctaRow}>{cta}</div>
    </div>
  );
}