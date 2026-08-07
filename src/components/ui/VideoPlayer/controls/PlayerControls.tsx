import type { PlayerState } from "../VideoPlayer.types";
import { GlassIconButton } from "./GlassIconButton";
import { ProgressBar } from "./ProgressBar";
import { TimeDisplay } from "./TimeDisplay";
import { VolumeControl } from "./VolumeControl";
import {
  FullscreenEnterIcon,
  FullscreenExitIcon,
  PauseIcon,
  PlayIcon,
} from "./icons";
import styles from "./PlayerControls.module.css";

interface PlayerControlsProps {
  state: PlayerState;
  title: string;
  /** Whether the bar should be visually revealed (parent owns hover/focus/idle logic). */
  visible: boolean;
  onTogglePlay: () => void;
  onSeekStart: () => void;
  onSeekEnd: (ratio: number) => void;
  onToggleMute: () => void;
  onVolumeChange: (level: number) => void;
  onToggleFullscreen: () => void;
}

export function PlayerControls({
  state,
  title,
  visible,
  onTogglePlay,
  onSeekStart,
  onSeekEnd,
  onToggleMute,
  onVolumeChange,
  onToggleFullscreen,
}: PlayerControlsProps) {
  const isPlaying = state.status === "playing" || state.status === "buffering";

  return (
    <div className={[styles.bar, visible ? styles.visible : ""].join(" ")}>
      <GlassIconButton
        icon={isPlaying ? <PauseIcon /> : <PlayIcon />}
        label={isPlaying ? `Pause ${title}` : `Play ${title}`}
        onClick={onTogglePlay}
      />

      <ProgressBar
        currentTime={state.currentTime}
        duration={state.duration}
        onSeekStart={onSeekStart}
        onSeekEnd={onSeekEnd}
      />

      <TimeDisplay currentTime={state.currentTime} duration={state.duration} />

      <VolumeControl
        volume={state.volume}
        muted={state.muted}
        onToggleMute={onToggleMute}
        onVolumeChange={onVolumeChange}
      />

      <GlassIconButton
        icon={state.isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
        label={state.isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        onClick={onToggleFullscreen}
      />
    </div>
  );
}
