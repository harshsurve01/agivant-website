"use client";

import { useRef, useEffect, useCallback } from "react";
import type { TestimonialCardData } from "@/data/testimonials";
import { TestimonialVideoCard } from "./TestimonialVideoCard";
import { TestimonialTextCard } from "./TestimonialTextCard";
import styles from "./TestimonialCarousel.module.css";

interface TestimonialCarouselProps {
  cards: TestimonialCardData[];
}

/**
 * Visual styling configuration mapped per sequential card index (0 to 5)
 * matching the exact Figma color scheme:
 * 1. Black (Video - Sachin)
 * 2. Strong Purple with Gold quote mark (Text)
 * 3. Light Purple (Video - Peter)
 * 4. Black with Purple quote mark (Text)
 * 5. Strong Purple with Black quote mark (Text)
 * 6. Black with Purple quote mark (Text)
 */
const CARD_STYLE_CONFIG = [
  { theme: "black" as const },
  { theme: "purple" as const, quoteColor: "gold" as const },
  { theme: "light-purple" as const },
  { theme: "black" as const, quoteColor: "purple" as const },
  { theme: "purple" as const, quoteColor: "black" as const },
  { theme: "black" as const, quoteColor: "purple" as const },
];

/**
 * TestimonialCarousel
 *
 * High-performance, infinite looping, smooth draggable/swipeable carousel.
 * Features:
 * - Continuous automatic movement via requestAnimationFrame
 * - Full mouse drag on desktop and touch swipe on mobile
 * - Pauses during active interaction; smoothly resumes on release
 * - Tripled card track with seamless wrap modulo math (0 jumps, 0 pops)
 */
export function TestimonialCarousel({ cards }: TestimonialCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Position state refs for 60fps RAF loop without React re-render overhead
  const posRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const startXRef = useRef(0);
  const startPosRef = useRef(0);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const singleSetWidthRef = useRef(0);

  // Measure single set width (width of 1 complete sequence of cards)
  const measureSetWidth = useCallback(() => {
    if (!trackRef.current) return;
    const firstItem = trackRef.current.children[0] as HTMLElement;
    const seventhItem = trackRef.current.children[cards.length] as HTMLElement;
    if (firstItem && seventhItem && seventhItem.offsetLeft > firstItem.offsetLeft) {
      singleSetWidthRef.current = seventhItem.offsetLeft - firstItem.offsetLeft;
    } else {
      singleSetWidthRef.current = cards.length * 384;
    }
  }, [cards.length]);

  // Main animation frame loop
  useEffect(() => {
    measureSetWidth();
    window.addEventListener("resize", measureSetWidth);

    let rafId: number;
    const speed = 0.65; // pixels per frame

    const tick = () => {
      if (trackRef.current) {
        if (!singleSetWidthRef.current || singleSetWidthRef.current === 0) {
          measureSetWidth();
        }

        const totalWidth = singleSetWidthRef.current || cards.length * 384;

        // Auto-scroll when not dragging or hovering
        if (!isDraggingRef.current && !isHoveredRef.current) {
          posRef.current -= speed;
        }

        // Wrap seamlessly
        if (posRef.current <= -totalWidth) {
          posRef.current += totalWidth;
        } else if (posRef.current > 0) {
          posRef.current -= totalWidth;
        }

        trackRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measureSetWidth);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [cards.length, measureSetWidth]);

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only primary left-click
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startPosRef.current = posRef.current;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    posRef.current = startPosRef.current + dx;

    const totalWidth = singleSetWidthRef.current;
    if (totalWidth > 0) {
      if (posRef.current <= -totalWidth) posRef.current += totalWidth;
      else if (posRef.current > 0) posRef.current -= totalWidth;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if pointer capture was already lost
    }
  };

  // Render 3 consecutive sets for seamless infinite wrapping
  const repeatedCards = [...cards, ...cards, ...cards];

  return (
    <div
      ref={viewportRef}
      className={styles.viewport}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      role="region"
      aria-label="Client Testimonials Carousel"
    >
      <div ref={trackRef} className={styles.track}>
        {repeatedCards.map((card, idx) => {
          const configIndex = idx % cards.length;
          const config = CARD_STYLE_CONFIG[configIndex];

          return (
            <div key={`${card.id}-${idx}`} className={styles.cardWrap}>
              {card.type === "video" ? (
                <TestimonialVideoCard
                  card={card}
                  theme={config.theme as "black" | "light-purple"}
                />
              ) : (
                <TestimonialTextCard
                  card={card}
                  theme={config.theme as "purple" | "black"}
                  quoteColor={config.quoteColor}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
