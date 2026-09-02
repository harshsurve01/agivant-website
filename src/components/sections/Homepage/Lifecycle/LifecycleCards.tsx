"use client";

import { useState, useEffect } from "react";
import { LifecycleCard } from "./LifecycleCard";
import { LifecycleIndicator } from "./LifecycleIndicator";
import type { LifecycleStage } from "@/data/lifecycle";
import styles from "./LifecycleCards.module.css";

const AUTO_ROTATE_INTERVAL_MS = 5000;

interface LifecycleCardsProps {
  stages: LifecycleStage[];
}

/**
 * LifecycleCards
 *
 * Renders all 5 Lifecycle stages side-by-side in a horizontal grid with:
 * - Automatic 5-second active-card rotation
 * - Hover priority override (pauses automatic rotation during user interaction)
 * - Seamless resume from current active index on mouse leave
 * - Coordinated indicator tracking
 */
export function LifecycleCards({ stages }: LifecycleCardsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused || stages.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stages.length);
    }, AUTO_ROTATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPaused, stages.length]);

  return (
    <div
      className={styles.interactiveWrapper}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className={styles.grid}>
        {stages.map((stage, index) => (
          <LifecycleCard
            key={stage.id}
            stage={stage}
            isActive={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
          />
        ))}
      </div>

      <LifecycleIndicator
        totalStages={stages.length}
        activeIndex={activeIndex}
      />
    </div>
  );
}
