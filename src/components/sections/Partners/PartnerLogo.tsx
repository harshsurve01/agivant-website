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
 * of the swap animation (LogoShift) — just the image itself, so
 * swapping which logo is "current" later is a prop change here, not
 * a markup change.
 *
 * Deliberately a plain <img>, not next/image: LogoShift preloads a
 * slot's whole sequence at mount via `new window.Image()` against
 * these same raw `src` URLs, so the browser cache entry LogoShift
 * warms is exactly the one this element reads from. next/image would
 * proxy through its own optimizer URL (with width/quality query
 * params), which is a different cache key — that mismatch is what
 * caused incoming logos to still be a live network fetch the moment
 * they were animated in.
 *
 * width/height are set as HTML attributes (not inline style) purely
 * to reserve layout space and avoid CLS; actual display size is
 * capped by .logo's max-width/max-height in CSS so every brand's
 * logo (each with its own natural aspect ratio) sits within the same
 * visual footprint inside the strip.
 */
export function PartnerLogo({ logo }: PartnerLogoProps) {
  return (
    <img
      src={logo.image.src}
      alt={logo.image.alt}
      width={140}
      height={40}
      className={styles.logo}
      draggable={false}
    />
  );
}