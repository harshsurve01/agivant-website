import Image from "next/image";
import type { PartnerLogo as PartnerLogoType } from "@/data/partners";
import styles from "./PartnerLogo.module.css";

interface PartnerLogoProps {
  logo: PartnerLogoType;
}

/**
 * PartnerLogo
 *
 * Presentation only: renders one logo image, sized and aligned
 * consistently regardless of each brand's natural logo proportions.
 * Owns none of the slot's layout (PartnerLogoStrip's .slot) and none
 * of the future swap animation (PartnerLogoShift) — just the image
 * itself, so swapping which logo is "current" later is a prop change
 * here, not a markup change.
 *
 * width/height are intrinsic-sizing hints for next/image's layout
 * calculation, not the rendered size — actual display size is capped
 * by .logo's max-width/max-height in CSS so every brand's logo (each
 * with its own natural aspect ratio) sits within the same visual
 * footprint inside the strip.
 */
export function PartnerLogo({ logo }: PartnerLogoProps) {
  return (
    <Image
      src={logo.image.src}
      alt={logo.image.alt}
      width={140}
      height={40}
      className={styles.logo}
    />
  );
}
