import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import styles from "./Logo.module.css";

export interface LogoProps {
  /** Optional extra class(es), merged after the internal logo class. */
  className?: string;
}

/**
 * Logo
 *
 * The Agivant brand mark, always linking to "/". Treated as a single
 * indivisible asset (icon + wordmark together) — it is not decomposed
 * into separate icon/wordmark components. Contains no business logic:
 * it doesn't know what page it's on or what else is in the header.
 *
 * Server Component: no "use client", no hooks, no state.
 *
 * ASSET NOTE: no logo file was supplied at implementation time. The
 * <Image> below points at "/images/agivant-logo.svg", which does not
 * yet exist in /public. Drop the real exported brand asset at that
 * path — no other part of this component needs to change. The
 * width/height below are placeholder intrinsic dimensions; update them
 * to match the real asset's actual pixel dimensions once supplied, to
 * avoid layout shift or distortion.
 */
export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={clsx(styles.logo, className)}>
    <Image
    src="/images/logo/agivant-logo.svg" // TODO: replace with the real supplied asset
        alt="Agivant"
        width={696} // TODO: replace with real asset's intrinsic width
        height={138} // TODO: replace with real asset's intrinsic height
        priority
        className={styles.image}
      />
    </Link>
  );
}
