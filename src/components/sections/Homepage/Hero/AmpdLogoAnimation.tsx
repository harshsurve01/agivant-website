"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import type { AmpdAnimationData } from "@/data/hero";
import styles from "./Hero.module.css";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export interface AmpdLogoAnimationProps {
  data: AmpdAnimationData;
}

/**
 * AmpdLogoAnimation
 *
 * Renders the Amp'd Lottie logo animation in the Hero announcement line:
 * - When `data.src` (Lottie JSON URL) is supplied by the data module / WordPress API,
 *   it plays the Lottie animation.
 * - When `data.src` is omitted or loading, it seamlessly falls back to the pixel-perfect
 *   Amp'd SVG wordmark asset (`/images/hero/ampd-wordmark.svg`).
 * - Client component leaf ("use client") for runtime Lottie execution, preserving Server Component
 *   architecture for Hero.tsx.
 */
export function AmpdLogoAnimation({ data }: AmpdLogoAnimationProps) {
  const { src, alt, fallbackImage = "/images/hero/ampd-wordmark.svg" } = data;

  if (src && src.trim().length > 0) {
    return (
      <span className={styles.ampdWrapper}>
        <Player
          autoplay
          loop
          src={src}
          className={styles.ampdLottie}
        />
      </span>
    );
  }

  return (
    <span className={styles.ampdWrapper}>
      <Image
        src={fallbackImage}
        alt={alt}
        width={120}
        height={40}
        priority
        className={styles.ampdImage}
      />
    </span>
  );
}
