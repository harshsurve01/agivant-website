import styles from "./TimeDisplay.module.css";

interface TimeDisplayProps {
  currentTime: number;
  duration: number;
}

function formatSeconds(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

export function TimeDisplay({ currentTime, duration }: TimeDisplayProps) {
  return (
    <span className={styles.time} aria-hidden="true">
      {formatSeconds(currentTime)} / {formatSeconds(duration)}
    </span>
  );
}
