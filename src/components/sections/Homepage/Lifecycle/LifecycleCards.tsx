"use client";

import { useState, useEffect, useRef } from "react";
import { LifecycleCard } from "./LifecycleCard";
import { LifecycleIndicator } from "./LifecycleIndicator";
import { LifecycleModal } from "./LifecycleModal";
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
 * - Viewport-aware automatic 5-second active-card rotation (runs only when in viewport)
 * - Hover priority override (pauses automatic rotation during user interaction)
 * - Seamless resume from current active index on mouse leave or re-entering viewport
 * - Coordinated indicator tracking
 * - Stage details modal on "Learn more" click
 */
export function LifecycleCards({ stages }: LifecycleCardsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [activeModalStage, setActiveModalStage] = useState<LifecycleStage | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || isPaused || activeModalStage !== null || stages.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stages.length);
    }, AUTO_ROTATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isInView, isPaused, activeModalStage, stages.length]);

  return (
    <div
      ref={containerRef}
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
            onLearnMore={() => setActiveModalStage(stage)}
          />
        ))}
      </div>

      <LifecycleIndicator
        totalStages={stages.length}
        activeIndex={activeIndex}
      />

      <LifecycleModal
        isOpen={activeModalStage !== null}
        onClose={() => setActiveModalStage(null)}
        title={activeModalStage?.title ?? ""}
        details={activeModalStage?.details ?? []}
      />
    </div>
  );
}
