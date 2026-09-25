"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import type { NvidiaAdvantageProps } from "./types";
import styles from "./NvidiaAdvantage.module.css";

/**
 * Presentational helper to split "Agivant's Advantage" into purple + dark text.
 */
function renderHeading(heading: string) {
  const match = "Agivant's";
  if (heading.startsWith(match)) {
    return (
      <>
        <span className={styles.purpleText}>{match}</span>
        <span className={styles.darkText}>{heading.slice(match.length)}</span>
      </>
    );
  }
  return <span className={styles.darkText}>{heading}</span>;
}

/**
 * NvidiaAdvantage
 *
 * NVIDIA Partner Detail Page - "Agivant's Advantage" section.
 * Features:
 * - Two-tone heading: "Agivant's" (purple) + "Advantage" (black)
 * - Single description string
 * - 3 chronological stages: Build, Deploy, Run
 * - Dynamically anchored SVG path anchored to the center of Markers 01 -> 02 -> 03
 * - Smooth continuous Bézier curves with zero kink at Marker 01
 * - Exposes CSS custom properties for independent card positioning and curve shape tuning
 * - Continuous micro-animation flowing along the path
 * - Strict rem-based typography and variables.css design tokens
 */
export function NvidiaAdvantage({ data, className }: NvidiaAdvantageProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const marker0Ref = useRef<HTMLDivElement>(null);
  const marker1Ref = useRef<HTMLDivElement>(null);
  const marker2Ref = useRef<HTMLDivElement>(null);

  const [pathD, setPathD] = useState<string>("");
  const [viewBox, setViewBox] = useState<string>("0 0 1024 400");

  const lastCoordsRef = useRef<string>("");

  const updatePath = useCallback(() => {
    const track = trackRef.current;
    const m0 = marker0Ref.current;
    const m1 = marker1Ref.current;
    const m2 = marker2Ref.current;

    if (!track || !m0 || !m1 || !m2) return;

    const trackRect = track.getBoundingClientRect();
    if (trackRect.width === 0 || trackRect.height === 0) return;

    const r0 = m0.getBoundingClientRect();
    const r1 = m1.getBoundingClientRect();
    const r2 = m2.getBoundingClientRect();

    // Dynamic marker centers relative to track container
    const p0 = {
      x: r0.left + r0.width / 2 - trackRect.left,
      y: r0.top + r0.height / 2 - trackRect.top,
    };
    const p1 = {
      x: r1.left + r1.width / 2 - trackRect.left,
      y: r1.top + r1.height / 2 - trackRect.top,
    };
    const p2 = {
      x: r2.left + r2.width / 2 - trackRect.left,
      y: r2.top + r2.height / 2 - trackRect.top,
    };

    // Read curve tuning controls from CSS custom properties
    const computed = window.getComputedStyle(track);
    const rootFontSize =
      parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;

    const parseUnit = (val: string, fallbackRem: number) => {
      if (!val) return fallbackRem * rootFontSize;
      const trimmed = val.trim();
      if (trimmed.endsWith("rem")) return parseFloat(trimmed) * rootFontSize;
      if (trimmed.endsWith("px")) return parseFloat(trimmed);
      const n = parseFloat(trimmed);
      return isNaN(n) ? fallbackRem * rootFontSize : n;
    };

    const parseFloatVal = (val: string, fallback: number) => {
      const n = parseFloat(val);
      return isNaN(n) ? fallback : n;
    };

    const c1Height = parseUnit(computed.getPropertyValue("--advantage-curve-1-height"), 2.75);
    const c2Height = parseUnit(computed.getPropertyValue("--advantage-curve-2-height"), 3.5);
    const c1Bend = parseFloatVal(computed.getPropertyValue("--advantage-curve-1-bend"), 0.35);
    const c2Bend = parseFloatVal(computed.getPropertyValue("--advantage-curve-2-bend"), 0.35);

    const isMobile = window.innerWidth <= 1024;

    let d: string;
    if (isMobile) {
      // Vertical chronological connection from Marker 01 -> Marker 02 -> Marker 03
      d = [
        `M ${p0.x} ${p0.y}`,
        `C ${p0.x} ${p0.y + (p1.y - p0.y) * 0.5}, ${p1.x} ${p0.y + (p1.y - p0.y) * 0.5}, ${p1.x} ${p1.y}`,
        `C ${p1.x} ${p1.y + (p2.y - p1.y) * 0.5}, ${p2.x} ${p1.y + (p2.y - p1.y) * 0.5}, ${p2.x} ${p2.y}`,
      ].join(" ");
    } else {
      // Smooth continuous desktop curve: Marker 01 -> Marker 02 -> Marker 03
      // Anchored directly at the centers of the 3 markers (no kinks or abrupt tails)
      const dx1 = p1.x - p0.x;
      const dx2 = p2.x - p1.x;

      // Arc 1 (Marker 01 -> Marker 02): arches up by c1Height above p0.y
      const cp1x = p0.x + dx1 * c1Bend;
      const cp1y = p0.y - c1Height;

      const cp2x = p1.x - dx1 * (1 - c1Bend);
      const cp2y = p0.y - c1Height + (p1.y - p0.y) * 0.25;

      // Arc 2 (Marker 02 -> Marker 03): arches up by c2Height above p1.y
      const cp3x = p1.x + dx2 * c2Bend;
      const cp3y = p1.y - c2Height;

      const cp4x = p2.x - dx2 * (1 - c2Bend);
      const cp4y = p2.y - c2Height * 0.25;

      d = [
        `M ${p0.x} ${p0.y}`,
        `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`,
        `C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${p2.x} ${p2.y}`,
      ].join(" ");
    }

    const cacheKey = `${p0.x.toFixed(1)},${p0.y.toFixed(1)},${p1.x.toFixed(1)},${p1.y.toFixed(1)},${p2.x.toFixed(1)},${p2.y.toFixed(1)},${trackRect.width.toFixed(1)},${trackRect.height.toFixed(1)},${c1Height},${c2Height},${c1Bend},${c2Bend},${isMobile}`;
    if (cacheKey !== lastCoordsRef.current) {
      lastCoordsRef.current = cacheKey;
      setPathD(d);
      setViewBox(`0 0 ${trackRect.width} ${trackRect.height}`);
    }
  }, []);

  useEffect(() => {
    updatePath();

    const observer = new ResizeObserver(() => {
      updatePath();
    });

    if (trackRef.current) observer.observe(trackRef.current);
    if (marker0Ref.current) observer.observe(marker0Ref.current);
    if (marker1Ref.current) observer.observe(marker1Ref.current);
    if (marker2Ref.current) observer.observe(marker2Ref.current);

    // MutationObserver to detect Next.js CSS hot reloads and class updates
    const mutObserver = new MutationObserver(() => {
      updatePath();
    });
    mutObserver.observe(document.head, { childList: true, subtree: true });
    if (trackRef.current) {
      mutObserver.observe(trackRef.current, { attributes: true, subtree: true, childList: true });
    }

    // Polling interval ensures instant adaptation when CSS custom properties are live-edited
    const intervalId = setInterval(updatePath, 200);

    window.addEventListener("resize", updatePath);

    return () => {
      clearInterval(intervalId);
      observer.disconnect();
      mutObserver.disconnect();
      window.removeEventListener("resize", updatePath);
    };
  }, [updatePath]);

  if (!data?.stages?.length) return null;

  const markerRefs = [marker0Ref, marker1Ref, marker2Ref];

  return (
    <section className={clsx(styles.section, className)} id="agivant-advantage">
      <Container size="xl" className={styles.container}>
        <h2 className={styles.heading}>{renderHeading(data.heading)}</h2>
        {data.description && (
          <p className={styles.description}>{data.description}</p>
        )}

        <div className={styles.track} ref={trackRef}>
          {/* Continuous Curved Dotted SVG Path + Micro-animation */}
          {pathD && (
            <svg
              className={styles.pathSvg}
              viewBox={viewBox}
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <mask id="advantage-path-mask">
                  <path
                    d={pathD}
                    pathLength={100}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={8}
                    className={styles.maskPath}
                  />
                </mask>
              </defs>
              {/* Base static dotted path */}
              <path d={pathD} className={styles.basePath} />
              {/* Flowing animated dash highlight: 01 -> 02 -> 03 -> loop */}
              <path
                d={pathD}
                className={styles.flowPath}
                mask="url(#advantage-path-mask)"
              />
            </svg>
          )}

          {/* Staggered Chronological Stages */}
          <div className={styles.stagesGrid}>
            {data.stages.map((stage, idx) => {
              const displayStep = stage.step.replace(/^0+/, "") || `${idx + 1}`;
              return (
                <div key={stage.id} className={styles.stageItem}>
                  <div
                    className={styles.markerWrapper}
                    ref={markerRefs[idx]}
                    aria-hidden="true"
                  >
                    <span className={styles.numberMarker}>{displayStep}</span>
                  </div>

                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>{stage.title}</h3>
                    <p className={styles.cardBody}>{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
