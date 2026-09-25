"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { Container } from "@/components/ui/Container";
import { Section, type SectionHeight } from "@/components/ui/Section";
import {
  REST,
  ANIMATION_DURATION,
  ANIMATION_EASE,
  getGridTarget,
  type GridState,
} from "@/components/sections/Homepage/Proof/SpotlightExperience";
import type { SpotlightSlot } from "@/components/sections/Homepage/Proof/SpotlightContainer";
import type { PartnerProductionProofData } from "@/types/partnerDetail";
import { ProductionProofCard } from "./ProductionProofCard";
import styles from "./ProductionProof.module.css";

export interface ProductionProofProps {
  data?: PartnerProductionProofData;
  height?: SectionHeight;
  className?: string;
  id?: string;
}

/**
 * ProductionProof
 *
 * "Proof from production." section on Partner Detail pages.
 *
 * Features:
 * - Left editorial column with purple highlight heading and description
 * - Right asymmetric 2+1 case-study grid (2 stacked short cards on the
 *   left, 1 tall card on the right)
 * - Homepage Proof spotlight interaction: the same grid-track
 *   redistribution as Homepage/Proof/SpotlightExperience (its exported
 *   REST / getGridTarget / ANIMATION_DURATION / ANIMATION_EASE are reused
 *   directly, with the Homepage's "large-right" arrangement, which is this
 *   same 2+1 layout), plus the Homepage's sibling blur/dim and card lift
 *   (see ProductionProof.module.css).
 * - Desktop only (>= 1025px), matching the Homepage breakpoint gate.
 */
export function ProductionProof({
  data,
  height = "viewport",
  className,
  id = "proof-from-production",
}: ProductionProofProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridStateRef = useRef<GridState>({ ...REST });
  const [hoveredSlot, setHoveredSlot] = useState<SpotlightSlot | null>(null);

  // Tween the grid split whenever the hovered slot changes (Homepage logic).
  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;
    if (!window.matchMedia("(min-width: 1025px)").matches) return;

    const target = getGridTarget(hoveredSlot, "large-right");
    const tween = gsap.to(gridStateRef.current, {
      ...target,
      duration: ANIMATION_DURATION,
      ease: ANIMATION_EASE,
      onUpdate: () => {
        const state = gridStateRef.current;
        gridEl.style.gridTemplateColumns = `${state.col1}fr ${state.col2}fr`;
        gridEl.style.gridTemplateRows = `${state.row1}fr ${state.row2}fr`;
      },
    });

    return () => {
      tween.kill();
    };
  }, [hoveredSlot]);

  // Crossing below the breakpoint clears any inline grid split so the
  // CSS-authored tablet/mobile layout always wins (Homepage logic).
  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;

    const mql = window.matchMedia("(max-width: 1024px)");
    const handleChange = (event: MediaQueryList | MediaQueryListEvent) => {
      if (!event.matches) return;
      gridEl.style.gridTemplateColumns = "";
      gridEl.style.gridTemplateRows = "";
      gridStateRef.current = { ...REST };
      setHoveredSlot(null);
    };

    handleChange(mql);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  if (!data || !data.cards?.length) return null;

  const [card1, card2, card3] = data.cards;

  return (
    <Section
      height={height}
      className={clsx(styles.section, className)}
      id={id}
    >
      <Container size="xl" className={styles.container}>
        <div className={styles.layout}>
          {/* Left Editorial Column */}
          <div className={styles.editorial}>
            <h2 className={styles.heading}>
              <span className={styles.purpleText}>{data.heading.highlight}</span>{" "}
              <span className={styles.darkText}>{data.heading.rest}</span>
            </h2>
            <p className={styles.description}>{data.description}</p>
          </div>

          {/* Right 2+1 Cards Grid (spotlight container) */}
          <div
            className={styles.grid}
            ref={gridRef}
            onMouseLeave={() => setHoveredSlot(null)}
          >
            {card1 && (
              <div
                className={styles.topLeftSlot}
                onMouseEnter={() => setHoveredSlot("topLeft")}
              >
                <ProductionProofCard card={card1} isTall={false} />
              </div>
            )}
            {card2 && (
              <div
                className={styles.bottomLeftSlot}
                onMouseEnter={() => setHoveredSlot("bottomLeft")}
              >
                <ProductionProofCard card={card2} isTall={false} />
              </div>
            )}
            {card3 && (
              <div
                className={clsx(styles.largeSlot, styles.rightCol)}
                onMouseEnter={() => setHoveredSlot("large")}
              >
                <ProductionProofCard card={card3} isTall={true} />
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
