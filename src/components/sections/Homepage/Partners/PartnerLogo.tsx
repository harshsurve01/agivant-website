import Link from "next/link";
import type { PartnerLogo as PartnerLogoType } from "@/data/partners";
import styles from "./PartnerLogo.module.css";

interface PartnerLogoProps {
  logo: PartnerLogoType;
  /**
   * Whether THIS rendered copy is the currently "at rest" (visible)
   * one inside its LogoShift slot, as opposed to the parked/invisible
   * one — LogoShift permanently mounts both a pair's logos and just
   * toggles which is which (see that file's doc comment), so without
   * this the parked copy would still be a real link sitting in the
   * DOM: reachable by Tab, announced by a screen reader, clickable by
   * anything that can target it directly — despite being invisible
   * and translated outside the slot's clipped bounds.
   *
   * Defaults to true so any caller outside LogoShift's two-layer
   * setup (there isn't one today) gets a normally-interactive logo
   * without needing to know this prop exists.
   */
  active?: boolean;
}

/**
 * TODO(data): `href` isn't on the PartnerLogo type in data/partners.ts
 * yet. Read defensively here — same optimistic-cast pattern as
 * SpotlightCard's `caseStudy.href` — so this starts resolving to each
 * partner's real destination the moment that field is added, with no
 * further changes needed in this component. Until then every logo
 * points at this placeholder.
 */
const PLACEHOLDER_HREF = "#";

/**
 * PartnerLogo
 *
 * Presentation only: renders one logo image as a link to that
 * partner's page, sized and aligned consistently regardless of each
 * brand's natural logo proportions. Owns none of the slot's layout
 * (PartnerLogoStrip's .slot) and none of the swap animation
 * (LogoShift) — just the image + its link, so swapping which logo is
 * "current" later is a prop change here, not a markup change.
 *
 * Deliberately a plain <img> inside the link, not next/image:
 * LogoShift preloads a slot's whole sequence at mount via `new
 * window.Image()` against these same raw `src` URLs, so the browser
 * cache entry LogoShift warms is exactly the one this element reads
 * from. next/image would proxy through its own optimizer URL (with
 * width/quality query params), which is a different cache key — that
 * mismatch is what caused incoming logos to still be a live network
 * fetch the moment they were animated in.
 *
 * width/height are set as HTML attributes (not inline style) purely
 * to reserve layout space and avoid CLS; actual display size is
 * capped by .logo's max-width/max-height in CSS so every brand's
 * logo (each with its own natural aspect ratio) sits within the same
 * visual footprint inside the strip. No separate aria-label on the
 * <Link> — its accessible name comes from the <img>'s required alt
 * text, so there's only one place that text needs to be correct.
 */
export function PartnerLogo({ logo, active = true }: PartnerLogoProps) {
  const href = (logo as PartnerLogoType & { href?: string }).href ?? PLACEHOLDER_HREF;

  return (
    <Link
      href={href}
      className={styles.link}
      tabIndex={active ? 0 : -1}
      aria-hidden={active ? undefined : true}
    >
      <img
        src={logo.image.src}
        alt={logo.image.alt}
        width={140}
        height={40}
        className={styles.logo}
        draggable={false}
      />
    </Link>
  );
}