"use client";

import { useCallback, useEffect, useRef } from "react";
import type { PartnerLogo as PartnerLogoType } from "@/data/partners";
import { PartnerLogo } from "./PartnerLogo";
import styles from "./PartnerLogoMarquee.module.css";

/** Mobile only. Tablet/desktop keep PartnerLogoStrip (LogoShift slots). */
const MOBILE_QUERY = "(max-width: 768px)";
/** Same auto-scroll speed as the Client Testimonials carousel. */
const SPEED_PX_PER_FRAME = 0.65;
/** Pointer travel (px) after which a press counts as a drag, not a tap. */
const DRAG_THRESHOLD_PX = 6;

interface PartnerLogoMarqueeProps {
  logos: PartnerLogoType[];
}

/**
 * PartnerLogoMarquee
 *
 * Mobile (≤768px) replacement for the partner logo strip: every
 * partner logo in one continuously auto-scrolling, draggable row — the
 * same mechanism as the Client Testimonials carousel (rAF translate
 * loop over three copies of the set, seamless wrap, pause on hover,
 * pointer drag). Each logo card is half the row wide, so two logos fit
 * across the screen.
 *
 * The animation loop only runs while the mobile query matches; on
 * wider screens this renders hidden (CSS) and stays idle.
 */
export function PartnerLogoMarquee({ logos }: PartnerLogoMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const setWidthRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const startXRef = useRef(0);
  const startPosRef = useRef(0);
  const movedRef = useRef(false);

  // Width of one full set of logos = distance to the first logo of set 2.
  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.children[0] as HTMLElement | undefined;
    const nextSetFirst = track.children[logos.length] as HTMLElement | undefined;
    setWidthRef.current =
      first && nextSetFirst ? nextSetFirst.offsetLeft - first.offsetLeft : 0;
  }, [logos.length]);

  const wrap = (pos: number) => {
    const total = setWidthRef.current;
    if (total <= 0) return pos;
    if (pos <= -total) return pos + total;
    if (pos > 0) return pos - total;
    return pos;
  };

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    let rafId = 0;

    const tick = () => {
      const track = trackRef.current;
      if (track) {
        if (!setWidthRef.current) measureSetWidth();
        if (!isDraggingRef.current && !isHoveredRef.current) {
          posRef.current -= SPEED_PX_PER_FRAME;
        }
        posRef.current = wrap(posRef.current);
        track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (rafId) return;
      measureSetWidth();
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
    };
    const sync = () => (query.matches ? start() : stop());

    sync();
    query.addEventListener("change", sync);
    window.addEventListener("resize", measureSetWidth);
    return () => {
      stop();
      query.removeEventListener("change", sync);
      window.removeEventListener("resize", measureSetWidth);
    };
  }, [measureSetWidth]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    movedRef.current = false;
    startXRef.current = e.clientX;
    startPosRef.current = posRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    if (!movedRef.current && Math.abs(dx) > DRAG_THRESHOLD_PX) {
      movedRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (!movedRef.current) return;
    posRef.current = wrap(startPosRef.current + dx);
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
      // pointer capture may not have been taken (a tap) or already lost
    }
  };

  // A drag should not also follow the logo's link.
  const handleClickCapture = (e: React.MouseEvent) => {
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      movedRef.current = false;
    }
  };

  const repeated = [...logos, ...logos, ...logos];

  return (
    <div
      className={styles.viewport}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClickCapture={handleClickCapture}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      role="region"
      aria-label="Partner logos"
    >
      <div ref={trackRef} className={styles.track}>
        {repeated.map((logo, index) => {
          // Only the first copy of the set is exposed to keyboard / screen readers.
          const isFirstSet = index < logos.length;
          return (
            <div
              key={`${logo.id}-${index}`}
              className={styles.item}
              aria-hidden={isFirstSet ? undefined : true}
            >
              <PartnerLogo logo={logo} active={isFirstSet} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
