import { GlassIconButton } from "./GlassIconButton";
import { VolumeHighIcon, VolumeMutedIcon } from "./icons";
import styles from "./VolumeControl.module.css";

interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onToggleMute: () => void;
  onVolumeChange: (level: number) => void;
}

export function VolumeControl({
  volume,
  muted,
  onToggleMute,
  onVolumeChange,
}: VolumeControlProps) {
  return (
    <div className={styles.group}>
      <GlassIconButton
        icon={muted || volume === 0 ? <VolumeMutedIcon /> : <VolumeHighIcon />}
        label={muted ? "Unmute" : "Mute"}
        onClick={onToggleMute}
      />
      <input
        type="range"
        className={styles.range}
        style={{ "--progress": muted ? 0 : volume / 100 } as React.CSSProperties}
        min={0}
        max={100}
        step={1}
        value={muted ? 0 : volume}
        aria-label="Volume"
        onChange={(event) => onVolumeChange(Number(event.target.value))}
      />
    </div>
  );
}
