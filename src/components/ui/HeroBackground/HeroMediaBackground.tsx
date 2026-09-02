import Image from "next/image";
import type { HeroBackgroundData } from "@/data/hero";
import styles from "./HeroBackground.module.css";

export interface HeroMediaBackgroundProps {
  data: HeroBackgroundData;
  className?: string;
}

/**
 * HeroMediaBackground
 *
 * Renders the Hero section's background layer.
 * Configured via data (`data.kind: "image" | "video"`):
 * - Current (Temporary): Renders high-quality placeholder image with object-cover fit.
 * - Production (Future): Automatically switches to an auto-playing muted loop <video>
 *   without requiring any code or component changes when the video asset arrives.
 */
export function HeroMediaBackground({ data, className }: HeroMediaBackgroundProps) {
  const { kind, src, poster, alt = "Hero background" } = data;

  if (kind === "video") {
    return (
      <div className={className || styles.mediaContainer}>
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={poster}
          className={styles.mediaVideo}
        >
          <source src={src} />
        </video>
      </div>
    );
  }

  return (
    <div className={className || styles.mediaContainer}>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className={styles.mediaImage}
      />
    </div>
  );
}
