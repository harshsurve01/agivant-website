import { useCallback, useEffect, useRef, useState } from "react";
import type {
  PlayerController,
  PlayerState,
  ProviderAdapter,
  VideoSource,
} from "../VideoPlayer.types";
import { INITIAL_PLAYER_STATE } from "../VideoPlayer.types";

interface UsePlayerControllerArgs {
  adapter: ProviderAdapter;
  source: VideoSource;
  autoPlay: boolean;
  loop: boolean;
  startTime: number;
  muted: boolean;
  /** True once the user has pressed play — gates init() entirely. */
  shouldLoad: boolean;
  onStateChange?: (state: PlayerState) => void;
}

interface UsePlayerControllerResult {
  controller: PlayerController | null;
  state: PlayerState;
  /** Ref to hand the adapter as its mount target. */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * usePlayerController
 *
 * Bridges a ProviderAdapter into React. Does NOT call adapter.init() until
 * `shouldLoad` flips true — this is what makes the lazy-load contract
 * (poster -> glass play -> only then load the engine) enforceable in one
 * place rather than trusted to each provider.
 *
 * State updates are consumed as-is from the adapter (already throttled to
 * ~250ms by the YouTube adapter's polling). If a future provider pushes
 * updates at a higher frequency, that throttling belongs in the adapter,
 * not here — this hook stays a thin, provider-agnostic bridge.
 */
export function usePlayerController({
  adapter,
  source,
  autoPlay,
  loop,
  startTime,
  muted,
  shouldLoad,
  onStateChange,
}: UsePlayerControllerArgs): UsePlayerControllerResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<PlayerController | null>(null);
  const [state, setState] = useState<PlayerState>(INITIAL_PLAYER_STATE);
  const [controller, setController] = useState<PlayerController | null>(null);

  const handleStateChange = useCallback(
    (next: PlayerState) => {
      setState(next);
      onStateChange?.(next);
    },
    [onStateChange]
  );

  useEffect(() => {
    if (!shouldLoad) return;

    let cancelled = false;

    setState((prev) => ({ ...prev, status: "loading" }));

    adapter
      .init({
        containerRef,
        source,
        autoPlay,
        loop,
        startTime,
        muted,
        onStateChange: handleStateChange,
      })
      .then((nextController) => {
        if (cancelled) {
          nextController.destroy();
          return;
        }
        controllerRef.current = nextController;
        setController(nextController);
      })
      .catch((error) => {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          status: "error",
          error:
            error && typeof error === "object" && "code" in error
              ? (error as PlayerState["error"])
              : { code: "UNKNOWN", message: "Something went wrong.", raw: error },
        }));
      });

    return () => {
      cancelled = true;
      controllerRef.current?.destroy();
      controllerRef.current = null;
      setController(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- source/adapter identity intentionally gates re-init
  }, [shouldLoad, adapter, source]);

  return { controller, state, containerRef };
}
