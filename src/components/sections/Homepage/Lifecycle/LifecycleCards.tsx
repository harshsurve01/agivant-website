"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import { LifecycleCard, type LifecycleCardStage } from "./LifecycleCard";
import { LifecycleIndicator } from "./LifecycleIndicator";
import { NumberedIndicator } from "./NumberedIndicator";
import { LifecycleModal } from "./LifecycleModal";
import styles from "./LifecycleCards.module.css";

const AUTO_ROTATE_INTERVAL_MS = 5000;
/** Width at which the opt-in mobile carousel replaces the stacked cards. */
const MOBILE_CAROUSEL_QUERY = "(max-width: 768px)";

export interface LifecycleCardsProps {
  stages: LifecycleCardStage[];
  initialActiveIndex?: number;
  autoRotate?: boolean;
  autoRotateIntervalMs?: number;
  enableModal?: boolean;
  showLearnMore?: boolean;
  indicatorVariant?: "dots" | "numbered";
  /**
   * Mobile only (≤768px): show the stages as a swipeable, snapping
   * carousel with dots instead of a vertical stack. Off by default, so
   * every other usage keeps the stacked mobile layout.
   */
  mobileCarousel?: boolean;
  renderIndicator?: (props: {
    totalStages: number;
    activeIndex: number;
    onSelectIndex: (index: number) => void;
  }) => React.ReactNode;
}

/**
 * LifecycleCards
 *
 * Renders all 5 Lifecycle stages side-by-side in a horizontal grid with:
 * - Viewport-aware automatic active-card rotation (runs only when in viewport)
 * - Hover priority override (pauses automatic rotation during user interaction)
 * - Seamless resume from current active index on mouse leave or re-entering viewport
 * - Customizable indicator renderer (e.g. NumberedIndicator)
 * - Stage details modal on "Learn more" click
 */
export function LifecycleCards({
  stages,
  initialActiveIndex = 0,
  autoRotate = true,
  autoRotateIntervalMs = AUTO_ROTATE_INTERVAL_MS,
  enableModal = true,
  showLearnMore,
  indicatorVariant = "dots",
  mobileCarousel = false,
  renderIndicator,
}: LifecycleCardsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [activeModalStage, setActiveModalStage] = useState<LifecycleCardStage | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isCarousel, setIsCarousel] = useState<boolean>(false);

  // Carousel mode = opt-in prop AND a mobile-width viewport.
  useEffect(() => {
    if (!mobileCarousel) return;
    const query = window.matchMedia(MOBILE_CAROUSEL_QUERY);
    const update = () => setIsCarousel(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [mobileCarousel]);

  // Carousel: scroll a stage's card to the centre of the track.
  const scrollToIndex = useCallback((index: number) => {
    const track = gridRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  // Carousel: the card nearest the track centre is the active stage.
  const handleTrackScroll = useCallback(() => {
    const track = gridRef.current;
    if (!track) return;
    const centre = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Infinity;
    Array.from(track.children).forEach((child, index) => {
      const el = child as HTMLElement;
      const distance = Math.abs(el.offsetLeft + el.offsetWidth / 2 - centre);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });
    setActiveIndex((prev) => (prev === nearest ? prev : nearest));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // No auto-rotation in the mobile carousel: the user's swipe drives it.
    if (!autoRotate || isCarousel || !isInView || isPaused || activeModalStage !== null || stages.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stages.length);
    }, autoRotateIntervalMs);

    return () => clearInterval(timer);
  }, [autoRotate, isCarousel, autoRotateIntervalMs, isInView, isPaused, activeModalStage, stages.length]);

  return (
    <div
      ref={containerRef}
      className={styles.interactiveWrapper}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        ref={gridRef}
        className={clsx(styles.grid, mobileCarousel && styles.gridCarousel)}
        onScroll={isCarousel ? handleTrackScroll : undefined}
      >
        {stages.map((stage, index) => (
          <LifecycleCard
            key={stage.id}
            stage={stage}
            isActive={activeIndex === index}
            showLearnMore={showLearnMore ?? enableModal}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => {
              setActiveIndex(index);
              if (isCarousel) scrollToIndex(index);
            }}
            onLearnMore={() => {
              if (enableModal) {
                setActiveModalStage(stage);
              }
            }}
          />
        ))}
      </div>

      {mobileCarousel && (
        <div className={styles.carouselDots} role="group" aria-label="Lifecycle stages">
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              type="button"
              className={clsx(
                styles.carouselDot,
                activeIndex === index && styles.carouselDotActive
              )}
              aria-label={`Show ${stage.title}`}
              aria-current={activeIndex === index}
              onClick={() => {
                setActiveIndex(index);
                scrollToIndex(index);
              }}
            />
          ))}
        </div>
      )}

      {renderIndicator ? (
        renderIndicator({
          totalStages: stages.length,
          activeIndex,
          onSelectIndex: (index) => setActiveIndex(index),
        })
      ) : indicatorVariant === "numbered" ? (
        <NumberedIndicator
          totalStages={stages.length}
          activeIndex={activeIndex}
          onSelectIndex={(index) => setActiveIndex(index)}
        />
      ) : (
        <LifecycleIndicator
          totalStages={stages.length}
          activeIndex={activeIndex}
        />
      )}

      {enableModal && (
        <LifecycleModal
          isOpen={activeModalStage !== null}
          onClose={() => setActiveModalStage(null)}
          title={activeModalStage?.title ?? ""}
          details={activeModalStage?.details ?? []}
        />
      )}
    </div>
  );
}

