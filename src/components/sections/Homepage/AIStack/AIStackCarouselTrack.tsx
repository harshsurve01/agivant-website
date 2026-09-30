"use client";

import { Children, useCallback, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./AIStackGrid.module.css";

interface AIStackCarouselTrackProps {
  /** Grid classes from AIStackGrid; the carousel styles only apply ≤768px. */
  className?: string;
  /** Server-rendered grid items (one per card). */
  children: ReactNode;
  /** Accessible names for the dots, one per card. */
  labels: string[];
}

/**
 * AIStackCarouselTrack
 *
 * Client wrapper used by AIStackGrid when `mobileCarousel` is on. It
 * renders the same grid element (so tablet/desktop layout is untouched)
 * and adds, for mobile only (≤768px, CSS):
 * - a horizontal scroll-snap row of the cards
 * - dots showing the card in view; tapping a dot scrolls to that card
 *
 * The cards themselves stay Server Components passed in as children.
 */
export function AIStackCarouselTrack({ className, children, labels }: AIStackCarouselTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = Children.count(children);

  // The card nearest the track's centre is the active one.
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
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

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div ref={trackRef} className={className} onScroll={handleScroll}>
        {children}
      </div>

      {count > 1 && (
        <div className={styles.carouselDots} role="group" aria-label="AI stack cards">
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              type="button"
              className={clsx(styles.carouselDot, activeIndex === index && styles.carouselDotActive)}
              aria-label={`Show ${labels[index] ?? `card ${index + 1}`}`}
              aria-current={activeIndex === index}
              onClick={() => {
                setActiveIndex(index);
                scrollToIndex(index);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
