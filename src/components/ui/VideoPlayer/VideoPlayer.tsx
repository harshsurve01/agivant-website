"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerController } from "./hooks/usePlayerController";
import { youtubeAdapter } from "./providers/youtube/YouTubeAdapter";
import { ErrorState } from "./controls/ErrorState";
import { PlayerControls } from "./controls/PlayerControls";
import { PosterLayer } from "./controls/PosterLayer";
import type { ProviderAdapter, VideoPlayerProps } from "./VideoPlayer.types";
import styles from "./VideoPlayer.module.css";

/**
 * Resolves a VideoSource to its ProviderAdapter. This is the ONLY place
 * that switches on `source.provider` — adding a new provider later means
 * adding one case here (and its adapter module), nothing else in this
 * file or any consumer changes.
 */
function getAdapter(provider: VideoPlayerProps["source"]["provider"]): ProviderAdapter {
  switch (provider) {
    case "youtube":
      return youtubeAdapter;
    default: {
      // Exhaustiveness guard — TypeScript will flag this if a new member
      // is added to VideoSource without a corresponding case above.
      const _exhaustive: never = provider;
      throw new Error(`No provider adapter registered for "${_exhaustive}".`);
    }
  }
}

const CONTROLS_IDLE_DELAY_MS = 2200;

export function VideoPlayer({
  source,
  poster,
  title,
  autoPlay = false,
  loop = false,
  startTime = 0,
  muted = false,
  className,
  onStateChange,
}: VideoPlayerProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [controlsRevealed, setControlsRevealed] = useState(true);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  const adapter = getAdapter(source.provider);

  const { controller, state, containerRef } = usePlayerController({
    adapter,
    source,
    autoPlay,
    loop,
    startTime,
    muted,
    shouldLoad,
    onStateChange,
  });

  const effectiveStatus = isSeeking ? "seeking" : state.status;
  const showPoster =
    effectiveStatus === "idle" ||
    effectiveStatus === "loading" ||
    effectiveStatus === "ended";
  const showError = effectiveStatus === "error" && state.error;
  const showControls = !showPoster && !showError;

  // Reveal the bar on hover/focus, then auto-hide after idle while playing.
  const wake = () => {
    setControlsRevealed(true);
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    if (effectiveStatus === "playing") {
      idleTimerRef.current = window.setTimeout(
        () => setControlsRevealed(false),
        CONTROLS_IDLE_DELAY_MS
      );
    }
  };

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Fullscreen targets the outer stage (iframe + custom controls overlay)
  // so our glass chrome stays rendered on top in fullscreen too — never
  // call the Fullscreen API on the iframe itself.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    if (state.isFullscreen && document.fullscreenElement !== stage) {
      stage.requestFullscreen?.().catch(() => {
        // Fullscreen can be denied by the browser/user gesture policy;
        // state already reflects intent, so just let the request fail
        // silently rather than throwing in the render path.
      });
    } else if (!state.isFullscreen && document.fullscreenElement === stage) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [state.isFullscreen]);

  // Keep state in sync if the user exits fullscreen via Escape/browser UI
  // rather than our own button.
  useEffect(() => {
    const handleChange = () => {
      const isNowFullscreen = document.fullscreenElement === stageRef.current;
      if (!isNowFullscreen && state.isFullscreen) {
        controller?.exitFullscreen();
      }
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, [controller, state.isFullscreen]);

  return (
    <div
      ref={stageRef}
      className={[styles.stage, className].filter(Boolean).join(" ")}
      role="region"
      aria-label={title}
      onMouseMove={wake}
      onFocus={wake}
    >
      {/* Engine mount point — always in the DOM once shouldLoad flips, so
          the adapter has a stable container to attach to. Visually hidden
          under the poster until playback actually starts. */}
      {shouldLoad && <div ref={containerRef} className={styles.engineMount} />}

      {showPoster && (
        <PosterLayer
          poster={poster}
          title={title}
          isLoading={effectiveStatus === "loading"}
          onPlay={() => setShouldLoad(true)}
        />
      )}

      {showError && <ErrorState error={state.error!} />}

      {showControls && controller && (
        <PlayerControls
          state={state}
          title={title}
          visible={controlsRevealed}
          onTogglePlay={controller.togglePlay}
          onSeekStart={() => {
            setIsSeeking(true);
            wake();
          }}
          onSeekEnd={(ratio) => {
            controller.seekByRatio(ratio);
            setIsSeeking(false);
          }}
          onToggleMute={controller.toggleMute}
          onVolumeChange={controller.setVolume}
          onToggleFullscreen={controller.toggleFullscreen}
        />
      )}
    </div>
  );
}
