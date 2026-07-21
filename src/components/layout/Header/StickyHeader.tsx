"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Header.module.css";

export interface StickyHeaderProps {
  children: ReactNode;
}

/**
 * StickyHeader
 *
 * Owns exactly one concern: detecting when the header has reached the
 * top of the viewport and toggling the `.stuck` visual state. It does
 * not know about Logo, nav, dividers, or the CTA — those are passed in
 * as children and rendered exactly as Header.tsx already composes them.
 *
 * Client Component boundary, isolated from Header.tsx: Header itself
 * stays an async Server Component that fetches navigation data; only
 * the sticky-detection behavior needs "use client" (state + effects),
 * matching the same Server/Client split already documented in
 * Button.tsx for future interactivity.
 *
 * Detection method: a zero-height sentinel is rendered as a sibling
 * immediately before <header>, in normal document flow — i.e. at the
 * exact scroll position where header's top edge would be. An
 * IntersectionObserver watches that sentinel; once it scrolls out of
 * view at the top of the viewport, header's top edge has reached
 * viewport y=0, which is precisely when position: sticky visually
 * engages. No scroll-position math, no fixed pixel thresholds tied to
 * AnnouncementBar's height — this works regardless of what's above
 * Header, so AnnouncementBar remains untouched and un-pinned.
 */
export function StickyHeader({ children }: StickyHeaderProps) {
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      // -1px rootMargin: the sentinel is 0-height, so without this an
      // intersection ratio right at the boundary can be ambiguous in
      // some browsers. Standard, well-documented trick for this exact
      // "has my sticky element engaged yet" detection.
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      <header className={clsx(styles.header, isStuck && styles.stuck)}>
        {children}
      </header>
    </>
  );
}
