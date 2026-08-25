"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePartnerCardHover } from "./usePartnerCardHover";
import styles from "./PartnerCard.module.css";
import type { PartnerCardData } from "./types";

export interface PartnerCardProps {
  partner: PartnerCardData;
}

/**
 * PartnerCard
 *
 * Client Component: Reuses the Purple Soil hover interaction logic:
 * - Dynamic entry origin calculation for `--x` and `--y`
 * - GSAP-driven `--scale` radial expansion on mouseenter (0.7s, power4.out)
 * - GSAP-driven `--scale` retraction on mouseleave (0.55s, power3.out)
 * - Data-driven partner-specific `--hover-color` and `--hover-accent`
 * - Accessible Next.js Link pointing to `partner.href`
 */
export function PartnerCard({ partner }: PartnerCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  usePartnerCardHover(cardRef, {
    maxScale: 45,
    enterDuration: 0.7,
    enterEase: "power4.out",
    leaveDuration: 0.55,
    leaveEase: "power3.out",
  });

  const customStyle: CSSProperties = {
    ...(partner.hoverColor ? { "--hover-color": partner.hoverColor } : {}),
    ...(partner.hoverAccent ? { "--hover-accent": partner.hoverAccent } : {}),
  } as CSSProperties;

  return (
    <Link
      ref={cardRef}
      href={partner.href}
      className={styles.card}
      style={customStyle}
    >
      <div className={styles.content}>
        <div className={styles.logoWrap}>
          <Image
            src={partner.logo.src}
            alt={partner.logo.alt}
            width={partner.logo.width ?? 140}
            height={partner.logo.height ?? 48}
            className={styles.logo}
          />
        </div>

        <p className={styles.description}>{partner.description}</p>

        <span className={styles.link}>
          Explore partnership
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </span>
      </div>
    </Link>
  );
}
