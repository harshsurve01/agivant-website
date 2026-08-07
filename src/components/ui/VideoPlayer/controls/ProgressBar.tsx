import { useState } from "react";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeekStart: () => void;
  onSeekEnd: (ratio: number) => void;
}

/**
 * ProgressBar
 *
 * A native <input type="range"> under the hood — gets arrow-key seeking,
 * Home/End, and aria-valuenow/min/max/text announcements for free, then
 * is fully restyled to the glass look via CSS.
 *
 * While dragging, the thumb follows local state (not engine state) so the
 * scrubber feels immediate; the actual seek only commits on release,
 * which is when onSeekEnd fires with the target ratio.
 */
export function ProgressBar({
  currentTime,
  duration,
  onSeekStart,
  onSeekEnd,
}: ProgressBarProps) {
  const [dragRatio, setDragRatio] = useState<number | null>(null);

  const safeDuration = duration > 0 ? duration : 0;
  const liveRatio = safeDuration > 0 ? currentTime / safeDuration : 0;
  const displayRatio = dragRatio ?? liveRatio;

  return (
    <input
      type="range"
      className={styles.range}
      style={{ "--progress": displayRatio } as React.CSSProperties}
      min={0}
      max={1}
      step={0.001}
      value={displayRatio}
      aria-label="Seek"
      aria-valuetext={`${Math.round(displayRatio * 100)}%`}
      onPointerDown={() => {
        onSeekStart();
        setDragRatio(liveRatio);
      }}
      onInput={(event) => {
        setDragRatio(Number((event.target as HTMLInputElement).value));
      }}
      onChange={(event) => {
        const ratio = Number(event.target.value);
        onSeekEnd(ratio);
        setDragRatio(null);
      }}
      onKeyDown={(event) => {
        // Arrow keys move the native range without a pointer drag —
        // treat any key-driven change the same as a committed seek.
        if (
          ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
        ) {
          onSeekStart();
        }
      }}
      onKeyUp={(event) => {
        if (
          ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
        ) {
          onSeekEnd(Number((event.target as HTMLInputElement).value));
        }
      }}
    />
  );
}
