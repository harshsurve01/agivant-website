"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { ServiceCapabilityCardBlock } from "./types";
import styles from "./ServiceCapabilityCards.module.css";

interface ServiceCapabilityCardItemProps {
  card: ServiceCapabilityCardBlock;
  variant?: "default" | "nvidia";
  nvidiaTypography?: boolean;
}

export function ServiceCapabilityCardItem({
  card,
  variant = "default",
  nvidiaTypography = false,
}: ServiceCapabilityCardItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsId = `capability-details-${card.id}`;

  const toggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const isNvidia = variant === "nvidia";
  const label = card.eyebrow ?? card.label;
  const desc = card.description ?? card.summary;
  const moreText = card.cta?.label || (isNvidia ? "See more" : "More Details");
  const lessText = isNvidia ? "See less" : "Less Details";

  return (
    <article
      className={clsx(
        styles.card,
        isExpanded && styles.cardExpanded,
        isNvidia && styles.cardNvidia,
        nvidiaTypography && styles.nvidiaTypography
      )}
      onClick={toggle}
    >
      {/* ── 1. Image Area (Shrinks dynamically when text expands) ── */}
      <div className={styles.imageArea}>
        <Image
          src={card.media.src}
          alt={card.media.alt || card.title}
          fill
          sizes="(max-width: 768px) 100vw, 36rem"
          className={styles.cardImage}
          unoptimized
        />
      </div>

      {/* ── 2. Glass / Text Area (Natural content-driven height) ── */}
      <div className={styles.glassPanel}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{card.title}</h3>

          {label && <p className={styles.cardLabel}>{label}</p>}

          {desc && <p className={styles.cardDescription}>{desc}</p>}

          {!isNvidia && (
            <button
              type="button"
              className={styles.toggleButton}
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              aria-expanded={isExpanded}
              aria-controls={detailsId}
            >
              <span>{isExpanded ? lessText : moreText}</span>
              <span className={styles.iconCircle} aria-hidden="true">
                {isExpanded ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="3.5" y1="6" x2="8.5" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="3.5" y1="6" x2="8.5" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="6" y1="3.5" x2="6" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                )}
              </span>
            </button>
          )}
        </div>

        {/* Expandable Details Drawer */}
        <div
          id={detailsId}
          className={clsx(styles.detailsDrawer, isExpanded && styles.drawerExpanded)}
        >
          <div className={styles.detailsInner}>
            {card.bullets && card.bullets.length > 0 && (
              <ul className={styles.bulletList}>
                {card.bullets.map((bullet, idx) => {
                  const colonIdx = bullet.indexOf(":");
                  const hasPrefix = isNvidia && colonIdx !== -1;
                  const prefix = hasPrefix ? bullet.slice(0, colonIdx + 1) : null;
                  const rest = hasPrefix ? bullet.slice(colonIdx + 1) : bullet;

                  return (
                    <li key={idx} className={styles.bulletItem}>
                      <span className={styles.bulletDot} aria-hidden="true">•</span>
                      <span className={styles.bulletText}>
                        {hasPrefix ? (
                          <>
                            <strong className={styles.bulletPrefix}>{prefix}</strong>
                            {rest}
                          </>
                        ) : (
                          bullet
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* In NVIDIA variant: Toggle button sits at bottom of card content */}
        {isNvidia && (
          <div className={styles.cardFooter}>
            <button
              type="button"
              className={styles.toggleButton}
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              aria-expanded={isExpanded}
              aria-controls={detailsId}
            >
              <span>{isExpanded ? lessText : moreText}</span>
              <span className={styles.iconCircle} aria-hidden="true">
                {isExpanded ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="3.5" y1="6" x2="8.5" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="3.5" y1="6" x2="8.5" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="6" y1="3.5" x2="6" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
