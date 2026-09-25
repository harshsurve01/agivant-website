"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Section, type SectionHeight } from "@/components/ui/Section";
import type { PartnerSolutionsData } from "@/types/partnerDetail";
import { AcceleratorCard } from "./AcceleratorCard";
import { SolutionDisplayPanel } from "./SolutionDisplayPanel";
import { AcceleratorProof } from "./AcceleratorProof";
import styles from "./Solutions.module.css";

export interface SolutionsProps {
  data?: PartnerSolutionsData;
  height?: SectionHeight;
  className?: string;
  /** Header alignment. Defaults to "left". */
  align?: "left" | "center";
  /** Vertical divider between the panel's two columns. Defaults to false. */
  columnDivider?: boolean;
  /** Swap card arrow directions (active ↗, inactive ↙). Defaults to false. */
  reverseArrows?: boolean;
  /** Keep card titles in the accent colour and fully opaque when inactive. Defaults to false. */
  accentInactiveTitles?: boolean;
  /** Set the description, card and panel body text to --font-size-lg. Defaults to false. */
  largeBodyText?: boolean;
  /** NVIDIA 3-tier typography standard (4xl heading, xl card titles, lg all other text). */
  nvidiaTypography?: boolean;
  /** Page-specific variant (e.g. "tigergraph"). Defaults to "default". */
  variant?: "default" | "tigergraph";
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
const AUTO_ROTATE_INTERVAL_MS = 5000;

export function Solutions({
  data,
  height = "viewport",
  className,
  align = "left",
  columnDivider = false,
  reverseArrows = false,
  accentInactiveTitles = false,
  largeBodyText = false,
  nvidiaTypography = false,
  variant = "default",
}: SolutionsProps) {
  if (!data?.accelerators?.length) return null;

  const isCarousel = data.accelerators.length >= 5;
  const [activeId, setActiveId] = useState<string>(data.accelerators[0].id);
  const [pointerLeft, setPointerLeft] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

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

  // Viewport intersection observer to run auto-rotation only when in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Update pointer position on scroll and resize
  useEffect(() => {
    updatePointer();
    const trackEl = trackRef.current;
    const handleScroll = () => {
      updatePointer();
    };

    if (trackEl && isCarousel) {
      trackEl.addEventListener("scroll", handleScroll, { passive: true });
    }
    window.addEventListener("resize", updatePointer);

    return () => {
      if (trackEl && isCarousel) {
        trackEl.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", updatePointer);
    };
  }, [updatePointer, isCarousel]);

  // Auto-carousel timer (shifts every 5 seconds)
  useEffect(() => {
    if (
      !isCarousel ||
      !isInView ||
      isPaused ||
      isDragging ||
      data.accelerators.length <= 1
    ) {
      return;
    }

    const timer = setInterval(() => {
      setActiveId((prevId) => {
        const activeIdx = data.accelerators.findIndex((a) => a.id === prevId);
        const nextIdx = (activeIdx + 1) % data.accelerators.length;
        return data.accelerators[nextIdx].id;
      });
    }, AUTO_ROTATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isCarousel, isInView, isPaused, isDragging, data.accelerators]);

  // Smoothly scroll active card into view when activeId changes
  useEffect(() => {
    if (!isCarousel || !trackRef.current) return;
    const activeIdx = data.accelerators.findIndex((a) => a.id === activeId);
    const activeCardEl = cardRefs.current[activeIdx];
    const trackEl = trackRef.current;
    if (activeCardEl && trackEl) {
      if (activeIdx === 0) {
        trackEl.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const trackRect = trackEl.getBoundingClientRect();
        const cardRect = activeCardEl.getBoundingClientRect();
        if (cardRect.left < trackRect.left) {
          trackEl.scrollBy({
            left: cardRect.left - trackRect.left - 20,
            behavior: "smooth",
          });
        } else if (cardRect.right > trackRect.right) {
          trackEl.scrollBy({
            left: cardRect.right - trackRect.right + 20,
            behavior: "smooth",
          });
        }
      }
    }
  }, [activeId, data.accelerators, isCarousel]);

  // Drag-to-scroll event handlers for carousel track
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCarousel || !trackRef.current) return;
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX;
    startScrollLeftRef.current = trackRef.current.scrollLeft;
    hasMovedRef.current = false;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !trackRef.current) return;
      const dx = e.pageX - startXRef.current;
      if (Math.abs(dx) > 5) {
        hasMovedRef.current = true;
      }
      trackRef.current.scrollLeft = startScrollLeftRef.current - dx;
    };

    const handleWindowMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        setTimeout(() => {
          hasMovedRef.current = false;
        }, 60);
      }
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isDragging]);

  // Hash navigation support
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
    <Section
      ref={sectionRef}
      height={height}
      className={clsx(
        styles.section,
        largeBodyText && styles.sectionLargeText,
        nvidiaTypography && styles.nvidiaTypography,
        variant === "tigergraph" && styles.tigergraphSolutions,
        className
      )}
      id="solutions"
    >
      <Container size="xl" className={styles.container}>
        {/* Section Header */}
        <div
          className={clsx(
            styles.headerWrapper,
            align === "center" && styles.headerWrapperCentered
          )}
        >
          <div className={styles.headerContent}>
            <h2 className={styles.heading}>
              {data.heading.highlight && !data.heading.prefix ? (
                <>
                  <span className={styles.purpleText}>
                    {data.heading.highlight}
                  </span>{" "}
                  {data.heading.suffix && (
                    <span className={styles.darkText}>
                      {data.heading.suffix}
                    </span>
                  )}
                  {data.heading.text && (
                    <span className={styles.darkText}>{data.heading.text}</span>
                  )}
                </>
              ) : (
                <>
                  {data.heading.prefix && (
                    <span className={styles.darkText}>{data.heading.prefix}</span>
                  )}
                  {data.heading.highlight && (
                    <span className={styles.purpleText}>
                      {data.heading.highlight}
                    </span>
                  )}
                  {data.heading.suffix && (
                    <span className={styles.darkText}>
                      {data.heading.suffix}
                    </span>
                  )}
                  {data.heading.text && (
                    <span className={styles.darkText}>{data.heading.text}</span>
                  )}
                </>
              )}
            </h2>
            {data.subheading && (
              <p className={styles.subheading}>{data.subheading}</p>
            )}
            {data.description && (
              <p className={styles.subtitle}>{data.description}</p>
            )}
          </div>
        </div>

        {/* Interactive Accelerator Cards (3 or 4 cards grid, or 5+ cards draggable auto-carousel track) */}
        <div
          ref={trackRef}
          className={clsx(
            styles.cardsGrid,
            data.accelerators.length === 3 && styles.cardsGrid3,
            isCarousel && styles.carouselTrack,
            isDragging && styles.carouselTrackDragging,
            accentInactiveTitles && styles.cardsGridAccentTitles
          )}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseDown={handleMouseDown}
        >
          {data.accelerators.map((accelerator, index) => (
            <AcceleratorCard
              key={accelerator.id}
              accelerator={accelerator}
              isActive={accelerator.id === activeId}
              onClick={() => {
                if (hasMovedRef.current) return;
                setActiveId(accelerator.id);
              }}
              onMouseEnter={() => {
                if (!isCarousel) {
                  setActiveId(accelerator.id);
                }
              }}
              cardRef={(el) => {
                cardRefs.current[index] = el;
              }}
              reverseArrow={reverseArrows}
              variant={variant}
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
          columnLabels={data.columnLabels}
          columnDivider={columnDivider}
          variant={variant}
        />

        {/* Accelerator Proof — headline, metrics, and video for the
            SAME activeAccelerator driving SolutionDisplayPanel above.
            No independent state; switching cards updates both. */}
        <AcceleratorProof proof={activeAccelerator.proof} />

        {/* Optional closing statement below display panel */}
        {data.closingStatement && (
          <p className={styles.closingStatement}>{data.closingStatement}</p>
        )}
      </Container>
    </Section>
  );
}
