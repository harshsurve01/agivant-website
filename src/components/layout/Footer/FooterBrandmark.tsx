import Image from "next/image";
import styles from "./FooterBrandmark.module.css";

/**
 * FooterBrandmark
 *
 * Owns the large decorative Agivant wordmark spanning the bottom of the
 * footer. This is NOT content — it conveys no information beyond what
 * FooterCopyright and the header Logo already provide — so it's rendered
 * as a purely decorative image: empty `alt` AND `aria-hidden="true"` on
 * its wrapper, removing it from the accessibility tree entirely rather
 * than relying on empty alt text alone.
 *
 * Treated as a single indivisible asset (not split into icon + wordmark
 * pieces), matching how Logo.tsx treats the header brandmark.
 *
 * Server Component: no "use client", no hooks, no state.
 *
 * ASSET NOTE: no logo file was supplied at implementation time. Points
 * at "/images/logo/agivant-wordmark.svg", which does not yet exist in
 * /public — drop the real exported decorative asset at that path once
 * supplied; no other part of this component needs to change.
 */
export function FooterBrandmark() {
  return (
    <div className={styles.brandmark} aria-hidden="true">
      <Image
        src="/images/logo/agivant-logo.svg" // TODO: replace with the real supplied asset
        alt=""
        width={1442} // TODO: replace with real asset's intrinsic width
        height={298} // TODO: replace with real asset's intrinsic height
        className={styles.image}
      />
    </div>
  );
}
