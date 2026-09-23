"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { ServiceCapabilityCardBlock } from "./types";
import styles from "./ServiceCapabilityCards.module.css";

interface ServiceCapabilityCardItemProps {
  card: ServiceCapabilityCardBlock;
}

export function ServiceCapabilityCardItem({ card }: ServiceCapabilityCardItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsId = `capability-details-${card.id}`;

  const toggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <article
      className={clsx(styles.card, isExpanded && styles.cardExpanded)}
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
      <div
        className={styles.glassPanel}
        onClick={(e) => {
          // Allow clicking within the glass panel to toggle without conflict
        }}
      >
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{card.title}</h3>

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
            <span>{isExpanded ? "Less Details" : "More Details"}</span>
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

        {/* Expandable Details Drawer */}
        <div
          id={detailsId}
          className={clsx(styles.detailsDrawer, isExpanded && styles.drawerExpanded)}
        >
          <div className={styles.detailsInner}>
            {card.bullets && card.bullets.length > 0 && (
              <ul className={styles.bulletList}>
                {card.bullets.map((bullet, idx) => (
                  <li key={idx} className={styles.bulletItem}>
                    <span className={styles.bulletDot} aria-hidden="true">•</span>
                    <span className={styles.bulletText}>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
