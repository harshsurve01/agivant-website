"use client";

import { useState, useEffect, useRef } from "react";
import { LifecycleCard, type LifecycleCardStage } from "./LifecycleCard";
import { LifecycleIndicator } from "./LifecycleIndicator";
import { NumberedIndicator } from "./NumberedIndicator";
import { LifecycleModal } from "./LifecycleModal";
import styles from "./LifecycleCards.module.css";

const AUTO_ROTATE_INTERVAL_MS = 5000;

export interface LifecycleCardsProps {
  stages: LifecycleCardStage[];
  initialActiveIndex?: number;
  autoRotate?: boolean;
  autoRotateIntervalMs?: number;
  enableModal?: boolean;
  showLearnMore?: boolean;
  indicatorVariant?: "dots" | "numbered";
  renderIndicator?: (props: {
    totalStages: number;
    activeIndex: number;
    onSelectIndex: (index: number) => void;
  }) => React.ReactNode;
}

/**
 * LifecycleCards
 *
 * Renders all 5 Lifecycle stages side-by-side in a horizontal grid with:
 * - Viewport-aware automatic active-card rotation (runs only when in viewport)
 * - Hover priority override (pauses automatic rotation during user interaction)
 * - Seamless resume from current active index on mouse leave or re-entering viewport
 * - Customizable indicator renderer (e.g. NumberedIndicator)
 * - Stage details modal on "Learn more" click
 */
export function LifecycleCards({
  stages,
  initialActiveIndex = 0,
  autoRotate = true,
  autoRotateIntervalMs = AUTO_ROTATE_INTERVAL_MS,
  enableModal = true,
  showLearnMore,
  indicatorVariant = "dots",
  renderIndicator,
}: LifecycleCardsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [activeModalStage, setActiveModalStage] = useState<LifecycleCardStage | null>(null);
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
    if (!autoRotate || !isInView || isPaused || activeModalStage !== null || stages.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stages.length);
    }, autoRotateIntervalMs);

    return () => clearInterval(timer);
  }, [autoRotate, autoRotateIntervalMs, isInView, isPaused, activeModalStage, stages.length]);

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
            showLearnMore={showLearnMore ?? enableModal}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
            onLearnMore={() => {
              if (enableModal) {
                setActiveModalStage(stage);
              }
            }}
          />
        ))}
      </div>

      {renderIndicator ? (
        renderIndicator({
          totalStages: stages.length,
          activeIndex,
          onSelectIndex: (index) => setActiveIndex(index),
        })
      ) : indicatorVariant === "numbered" ? (
        <NumberedIndicator
          totalStages={stages.length}
          activeIndex={activeIndex}
          onSelectIndex={(index) => setActiveIndex(index)}
        />
      ) : (
        <LifecycleIndicator
          totalStages={stages.length}
          activeIndex={activeIndex}
        />
      )}

      {enableModal && (
        <LifecycleModal
          isOpen={activeModalStage !== null}
          onClose={() => setActiveModalStage(null)}
          title={activeModalStage?.title ?? ""}
          details={activeModalStage?.details ?? []}
        />
      )}
    </div>
  );
}

