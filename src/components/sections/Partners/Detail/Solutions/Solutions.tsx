"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Container } from "@/components/ui/Container";
import type { PartnerSolutionsData } from "@/types/partnerDetail";
import { AcceleratorCard } from "./AcceleratorCard";
import { SolutionDisplayPanel } from "./SolutionDisplayPanel";
import { AcceleratorProof } from "./AcceleratorProof";
import styles from "./Solutions.module.css";

export interface SolutionsProps {
  data?: PartnerSolutionsData;
}

/**
 * Solutions
 *
 * Section 04: "Solutions / Accelerators" on the Partner Detail Page.
 * Interactive component:
 * - 4 accelerator cards in a row.
 * - Card 1 active by default.
 * - Hover / click changes the active accelerator without layout shift or resizing.
 * - Active card content & image at 100% opacity; inactive cards content & image at reduced opacity.
 * - Arrow badges on ALL cards remain 100% visible.
 * - Dynamic triangular pointer slides on the top edge of the display panel to point at the active card.
 * - Display panel updates its Challenge, Solution, and Agent Team content.
 *
 * All text and image paths are driven from the typed data layer.
 * Strictly consumes design tokens from variables.css.
 */
export function Solutions({ data }: SolutionsProps) {
  if (!data?.accelerators?.length) return null;

  const [activeId, setActiveId] = useState<string>(data.accelerators[0].id);
  const [pointerLeft, setPointerLeft] = useState<number | null>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const updatePointer = useCallback(() => {
    const activeIdx = data.accelerators.findIndex((a) => a.id === activeId);
    const activeCardEl = cardRefs.current[activeIdx];
    const panelEl = panelRef.current;

    if (activeCardEl && panelEl) {
      const cardRect = activeCardEl.getBoundingClientRect();
      const panelRect = panelEl.getBoundingClientRect();
      const pointerX = cardRect.left + cardRect.width / 2 - panelRect.left;

      // Keep pointer within panel bounds with safe margin
      const minX = 24;
      const maxX = panelRect.width - 24;
      const clampedX = Math.max(minX, Math.min(maxX, pointerX));

      setPointerLeft(clampedX);
    }
  }, [activeId, data.accelerators]);

  useEffect(() => {
    updatePointer();
    window.addEventListener("resize", updatePointer);
    return () => window.removeEventListener("resize", updatePointer);
  }, [updatePointer]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && data.accelerators.some((a) => a.id === hash)) {
        setActiveId(hash);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [data.accelerators]);

  const activeAccelerator =
    data.accelerators.find((a) => a.id === activeId) || data.accelerators[0];

  return (
    <section className={styles.section} id="solutions">
      <Container size="xl" className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <h2 className={styles.heading}>
            {data.heading.prefix && (
              <span className={styles.darkText}>{data.heading.prefix}</span>
            )}
            {data.heading.highlight && (
              <span className={styles.purpleText}>
                {data.heading.highlight}
              </span>
            )}
          </h2>
          {data.description && (
            <p className={styles.subtitle}>{data.description}</p>
          )}
        </div>

        {/* 4 Interactive Accelerator Cards */}
        <div className={styles.cardsGrid}>
          {data.accelerators.map((accelerator, index) => (
            <AcceleratorCard
              key={accelerator.id}
              accelerator={accelerator}
              isActive={accelerator.id === activeId}
              onClick={() => setActiveId(accelerator.id)}
              onMouseEnter={() => setActiveId(accelerator.id)}
              cardRef={(el) => {
                cardRefs.current[index] = el;
              }}
            />
          ))}
        </div>

        {/* Solution Display Panel with Dynamic Sliding Pointer */}
        <SolutionDisplayPanel
          accelerator={activeAccelerator}
          pointerLeft={pointerLeft}
          panelRef={(el) => {
            panelRef.current = el;
          }}
        />

        {/* Accelerator Proof — headline, metrics, and video for the
            SAME activeAccelerator driving SolutionDisplayPanel above.
            No independent state; switching cards updates both. */}
        <AcceleratorProof proof={activeAccelerator.proof} />
      </Container>
    </section>
  );
}
