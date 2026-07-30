"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./AmpConnectors.module.css";

interface ConnectorPath {
  id: string;
  d: string;
  /** Seconds, derived from a stable hash of `id` — see hashToRange
   *  below — so each path animates on its own offset/speed instead of
   *  every connector flowing in lockstep, without the "randomness"
   *  reshuffling on every re-measure (a resize, etc.). */
  delay: number;
  duration: number;
}

/**
 * Deterministic 0..1 pseudo-random value derived from a string, so
 * the same card always gets the same flow delay/duration across
 * re-renders and resizes (a real Math.random() would reshuffle every
 * time AmpConnectors re-measures).
 */
function hashToUnitRange(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) & 0xffffffff;
  }
  return (Math.abs(hash) % 1000) / 1000;
}

/**
 * AmpConnectors
 *
 * The connector layer: a single SVG overlay that draws one path per
 * card (left or right) into the central hub. Completely independent
 * of AmpHub and AmpColumn/AmpCard — it never imports their data types
 * or receives props from them. Instead it discovers every node it
 * needs to connect purely through the DOM:
 *
 *   - `[data-amp-hub]`             — the hub's own circular element
 *   - `[data-amp-card][data-amp-side="left"]`  — each left card
 *   - `[data-amp-card][data-amp-side="right"]` — each right card
 *
 * This is what lets AmpHub stay a plain "circle + logo" component and
 * AmpCard stay a plain "card" component: neither has to know
 * connectors exist, and this component doesn't have to know anything
 * about AmpHubData/AmpCardData shapes.
 *
 * This component's own root <div> is rendered as a plain child of
 * AmpExperience's grid (see AmpExperience.tsx) — NOT inside AmpHub —
 * and reads `rootRef.current.parentElement` to get AmpExperience's
 * own container element, which is what every measurement below is
 * relative to. AmpExperience.module.css gives that container
 * `position: relative` for this overlay to anchor against.
 *
 * All geometry is computed from `getBoundingClientRect()` in real
 * pixels — there is no rem/viewBox unit conversion anywhere in this
 * file, and no coordinate is ever hardcoded. That's what makes this
 * layer responsive across desktop/tablet/mobile "for free": whatever
 * the current layout measures as, the paths measure the same.
 *
 * A ResizeObserver on the container re-measures on any layout change
 * (column reflow, window resize, font swap, content change), so the
 * paths never drift out of sync with the cards/hub they're attached
 * to.
 *
 * Every path is rendered as its own <path> with a stable, addressable
 * `id` (`connector-left-<card id>` / `connector-right-<card id>`) —
 * exactly the granularity a future Framer Motion pass needs to
 * animate draw-in, glow, pulse, or "active connection" states on
 * individual connectors.
 *
 * Client Component: needs refs + effects to measure real DOM layout,
 * which cannot happen on the server.
 */
export function AmpConnectors() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<ConnectorPath[]>([]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const container = root?.parentElement;
    if (!root || !container) return;

    let frame = 0;

    function measure() {
      if (!container) return;

      const hubEl = container.querySelector<HTMLElement>("[data-amp-hub]");
      if (!hubEl) {
        setPaths([]);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const hubRect = hubEl.getBoundingClientRect();

      // Every rect below is expressed relative to the container's own
      // top-left corner — the same origin the SVG overlay itself sits
      // at (see AmpConnectors.module.css's `inset: 0`).
      const toLocal = (rect: DOMRect) => ({
        left: rect.left - containerRect.left,
        right: rect.right - containerRect.left,
        top: rect.top - containerRect.top,
        bottom: rect.bottom - containerRect.top,
      });

      const hub = toLocal(hubRect);
      const hubCenterY = (hub.top + hub.bottom) / 2;
      // Spread each side's termination points across most (not all)
      // of the hub's own height, so they visually land at distinct
      // points around its circumference instead of all converging on
      // one exact spot — matching the reference image's fan-in look.
      const hubSpread = (hub.bottom - hub.top) * 0.2;

      function anchorYs(count: number): number[] {
        if (count <= 0) return [];
        if (count === 1) return [hubCenterY];
        const start = hubCenterY - hubSpread / 2;
        const step = hubSpread / (count - 1);
        return Array.from({ length: count }, (_, index) => start + step * index);
      }

      const leftCardEls = Array.from(
        container.querySelectorAll<HTMLElement>('[data-amp-card][data-amp-side="left"]')
      );
      const rightCardEls = Array.from(
        container.querySelectorAll<HTMLElement>('[data-amp-card][data-amp-side="right"]')
      );

      const leftHubYs = anchorYs(leftCardEls.length);
      const rightHubYs = anchorYs(rightCardEls.length);

      const nextPaths: ConnectorPath[] = [];

      leftCardEls.forEach((el, index) => {
        const card = toLocal(el.getBoundingClientRect());
        const cardId = el.dataset.ampCard ?? String(index);
        const y1 = (card.top + card.bottom) / 2;
        const x1 = card.right;
        const x2 = hub.left;
        const y2 = leftHubYs[index];
        nextPaths.push({
          id: `connector-left-${cardId}`,
          d: buildCurve(x1, y1, x2, y2),
          delay: hashToUnitRange(`left-${cardId}`) * -4,
          duration: 2.5 + hashToUnitRange(`left-${cardId}-speed`) * 2,
        });
      });

      rightCardEls.forEach((el, index) => {
        const card = toLocal(el.getBoundingClientRect());
        const cardId = el.dataset.ampCard ?? String(index);
        const y1 = (card.top + card.bottom) / 2;
        const x1 = card.left;
        const x2 = hub.right;
        const y2 = rightHubYs[index];
        // Drawn hub → card (not card → hub, unlike the left side's
        // literal x1/x2 above) so that, like every left-side path,
        // this path's own start-to-end direction runs left-to-right
        // on screen. That's what lets a single CSS dashoffset
        // animation (see .path's `animation` in
        // AmpConnectors.module.css) flow the same visual direction
        // for every connector regardless of which side it's on.
        nextPaths.push({
          id: `connector-right-${cardId}`,
          d: buildCurve(x2, y2, x1, y1),
          delay: hashToUnitRange(`right-${cardId}`) * -4,
          duration: 2.5 + hashToUnitRange(`right-${cardId}-speed`) * 2,
        });
      });

      setPaths(nextPaths);
    }

    function scheduleMeasure() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }

    scheduleMeasure();

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(container);

    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("orientationchange", scheduleMeasure);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("orientationchange", scheduleMeasure);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.layer} aria-hidden="true">
      <svg className={styles.svg}>
        {paths.map((path) => (
          <path
            key={path.id}
            id={path.id}
            d={path.d}
            className={styles.path}
            style={
              {
                "--amp-flow-delay": `${path.delay}s`,
                "--amp-flow-duration": `${path.duration}s`,
              } as CSSProperties
            }
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * Builds a smooth "S-curve" cubic-bezier path between a card's edge
 * and its hub anchor point — horizontal in, horizontal out — giving
 * the fan its curved, organic look instead of a straight diagonal
 * line. Control points sit at the horizontal midpoint between the two
 * ends so the curve is symmetric regardless of how far the hub anchor
 * sits above/below the card's own vertical center.
 */
function buildCurve(x1: number, y1: number, x2: number, y2: number): string {
  const midX = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
}