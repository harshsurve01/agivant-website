"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { defaultPreloaderData } from "@/data/preloader";
import type { PreloaderProps } from "./types";
import styles from "./Preloader.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

/**
 * Preloader (Global Website Preloader)
 *
 * Renders the brand Lottie animation on initial page load:
 * - Plays the Lottie animation ONCE (loop: false).
 * - Smoothly exits using GSAP animation upon completion.
 * - Handles prefers-reduced-motion by performing an immediate fade-out.
 * - Includes a fallback timeout (default 4000ms) to ensure page accessibility
 *   even if network or LottieFiles CDN is slow/unavailable.
 * - Decouples data configuration (src URL) from presentation for seamless
 *   future WordPress/CMS API integration.
 */
export function Preloader({
  data = defaultPreloaderData,
  onComplete,
}: PreloaderProps) {
  const [isExited, setIsExited] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isExitingRef = useRef(false);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onCompleteRef updated to latest prop value
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const {
    enabled,
    animationUrl,
    speed = 1,
    loop = false,
    autoplay = true,
    timeoutMs = 4000,
  } = data;

  // Handles the smooth GSAP exit transition
  const handleExit = useCallback(() => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;

    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    if (mountTimeoutRef.current) {
      clearTimeout(mountTimeoutRef.current);
      mountTimeoutRef.current = null;
    }

    // Check for reduced-motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Restore body scroll immediately when exit starts
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }

    if (prefersReducedMotion || !containerRef.current) {
      setIsExited(true);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
      if (typeof window !== "undefined") {
        ScrollTrigger.refresh();
      }
      onCompleteRef.current?.();
      return;
    }

    // Smooth GSAP exit animation
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        setIsExited(true);
        if (typeof document !== "undefined") {
          document.body.style.overflow = "";
        }
        if (typeof window !== "undefined") {
          ScrollTrigger.refresh();
        }
        onCompleteRef.current?.();
      },
    });
  }, []);

  // Handle client-side mount & body scroll lock
  useEffect(() => {
    if (!enabled) {
      setIsExited(true);
      return;
    }

    // Prevent body scroll while preloader is active
    if (typeof document !== "undefined" && !isExitingRef.current) {
      document.body.style.overflow = "hidden";
    }

    // Absolute safety net: guarantees page accessibility even if player chunk/JS fails completely
    mountTimeoutRef.current = setTimeout(() => {
      handleExit();
    }, 8000);

    return () => {
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }
      if (mountTimeoutRef.current) {
        clearTimeout(mountTimeoutRef.current);
      }
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [enabled, handleExit]);

  // Start playback safety timer once the animation begins or becomes ready
  const handlePlaybackStarted = useCallback(() => {
    if (!playbackTimeoutRef.current && !isExitingRef.current) {
      playbackTimeoutRef.current = setTimeout(() => {
        handleExit();
      }, timeoutMs);
    }
  }, [handleExit, timeoutMs]);

  if (!enabled || isExited) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={styles.preloader}
      aria-label="Website loading"
      role="status"
    >
      <div className={styles.animationWrapper}>
        <Player
          autoplay={autoplay}
          loop={loop}
          speed={speed}
          src={animationUrl}
          className={styles.lottiePlayer}
          onEvent={(event) => {
            if (event === "play" || event === "ready" || event === "load" || event === "instanceSaved") {
              handlePlaybackStarted();
            } else if (event === "complete") {
              handleExit();
            } else if (event === "error") {
              // On player error, gracefully fallback to exit rather than abrupt cutoff
              handleExit();
            }
          }}
        />
      </div>
    </div>
  );
}
