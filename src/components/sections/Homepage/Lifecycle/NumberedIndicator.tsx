"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./NumberedIndicator.module.css";

export interface NumberedIndicatorProps {
  totalStages: number;
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

/**
 * NumberedIndicator
 *
 * Horizontal numbered pagination track (1 --- 2 --- ③ --- 4)
 * positioned below the Lifecycle cards in "How Agivant Works With You" & "The Amp'd Way".
 *
 * - Slots mirror the card layout (default max-width 15.8125rem / flex 0 1 15.8125rem,
 *   active max-width 17.625rem / flex 0 0 17.625rem) ensuring every counter circle
 *   aligns with the EXACT horizontal center of its corresponding card.
 * - Active number is enlarged (38px / 2.375rem), styled in vibrant Agivant purple with white text.
 * - Inactive numbers are 28px / 1.75rem in neutral gray.
 * - Connected by a 2px horizontal line spanning from circle 1 to circle N.
 * - Interactive: Clicking any number activates the corresponding card.
 */
export function NumberedIndicator({
  totalStages,
  activeIndex,
  onSelectIndex,
}: NumberedIndicatorProps) {
  const trackRef = useRef<HTMLElement>(null);
  const [lineCoords, setLineCoords] = useState<{ left?: string; right?: string }>({});

  useEffect(() => {
    const updateLine = () => {
      const track = trackRef.current;
      if (!track) return;
      const buttons = track.querySelectorAll<HTMLButtonElement>("button");
      if (buttons.length < 2) return;

      const trackRect = track.getBoundingClientRect();
      const firstBtn = buttons[0];
      const lastBtn = buttons[buttons.length - 1];

      const firstRect = firstBtn.getBoundingClientRect();
      const lastRect = lastBtn.getBoundingClientRect();

      const left = Math.round(firstRect.left + firstRect.width / 2 - trackRect.left);
      const right = Math.round(trackRect.right - (lastRect.left + lastRect.width / 2));

      setLineCoords({
        left: `${left}px`,
        right: `${right}px`,
      });
    };

    updateLine();
    window.addEventListener("resize", updateLine);
    return () => window.removeEventListener("resize", updateLine);
  }, [totalStages, activeIndex]);

  return (
    <nav
      ref={trackRef}
      className={styles.track}
      aria-label="Lifecycle pagination"
    >
      <div
        className={styles.line}
        aria-hidden="true"
        style={lineCoords.left !== undefined ? { left: lineCoords.left, right: lineCoords.right } : undefined}
      />

      {Array.from({ length: totalStages }).map((_, index) => {
        const isActive = index === activeIndex;
        const stageNumber = index + 1;

        return (
          <div
            key={index}
            className={clsx(styles.slot, isActive ? styles.slotActive : styles.slotDefault)}
          >
            <button
              type="button"
              className={clsx(
                styles.button,
                isActive ? styles.buttonActive : styles.buttonInactive
              )}
              onClick={() => onSelectIndex(index)}
              aria-label={`Go to stage ${stageNumber}`}
              aria-current={isActive ? "step" : undefined}
            >
              {stageNumber}
            </button>
          </div>
        );
      })}
    </nav>
  );
}

