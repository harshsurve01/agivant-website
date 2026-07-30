"use client";

import { useLayoutEffect, useRef, useState } from "react";
import styles from "./AmpConnectorLayer.module.css";

interface ConnectorPath {
  id: string;
  d: string;
}

/**
 * AmpConnectorLayer
 *
 * The connector layer: a single SVG overlay that draws one path per
 * node (left or right) into AmpCore. Completely independent of
 * AmpCore and AmpColumn/AmpNode — it never imports their data types
 * or receives props from them. Instead it discovers every element it
 * needs to connect purely through the DOM:
 *
 *   - `[data-amp-core]`                          — AmpCore's own circular element
 *   - `[data-amp-node][data-amp-side="left"]`     — each left node
 *   - `[data-amp-node][data-amp-side="right"]`    — each right node
 *
 * This is what lets AmpCore stay a plain "circle + logo" component and
 * AmpNode stay a plain "card" component: neither has to know
 * connectors exist, and this component doesn't have to know anything
 * about AmpHubData/AmpCardData shapes.
 *
 * This component's own root <div> is rendered as a plain child of
 * AmpExperience's layout (see AmpExperience.tsx) — NOT inside AmpCore —
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
 * paths never drift out of sync with the nodes/core they're attached
 * to.
 *
 * Every path is rendered as its own <path> with a stable, addressable
 * `id` (`connector-left-<node id>` / `connector-right-<node id>`) —
 * exactly the granularity the section spec's draw-in (`pathLength`
 * 0 → 1, one after another) and living-pulse animations need to
 * target individual connectors independently.
 *
 * Client Component: needs refs + effects to measure real DOM layout,
 * which cannot happen on the server.
 */
export function AmpConnectorLayer() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<ConnectorPath[]>([]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const container = root?.parentElement;
    if (!root || !container) return;

    let frame = 0;

    function measure() {
      if (!container) return;

      const coreEl = container.querySelector<HTMLElement>("[data-amp-core]");
      if (!coreEl) {
        setPaths([]);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const coreRect = coreEl.getBoundingClientRect();

      // Every rect below is expressed relative to the container's own
      // top-left corner — the same origin the SVG overlay itself sits
      // at (see AmpConnectorLayer.module.css's `inset: 0`).
      const toLocal = (rect: DOMRect) => ({
        left: rect.left - containerRect.left,
        right: rect.right - containerRect.left,
        top: rect.top - containerRect.top,
        bottom: rect.bottom - containerRect.top,
      });

      const core = toLocal(coreRect);
      const coreCenterY = (core.top + core.bottom) / 2;
      // Spread each side's termination points across most (not all)
      // of the core's own height, so they visually land at distinct
      // points around its circumference instead of all converging on
      // one exact spot — matching the reference image's fan-in look.
      const coreSpread = (core.bottom - core.top) * 0.2;

      function anchorYs(count: number): number[] {
        if (count <= 0) return [];
        if (count === 1) return [coreCenterY];
        const start = coreCenterY - coreSpread / 2;
        const step = coreSpread / (count - 1);
        return Array.from({ length: count }, (_, index) => start + step * index);
      }

      const leftNodeEls = Array.from(
        container.querySelectorAll<HTMLElement>('[data-amp-node][data-amp-side="left"]')
      );
      const rightNodeEls = Array.from(
        container.querySelectorAll<HTMLElement>('[data-amp-node][data-amp-side="right"]')
      );

      const leftCoreYs = anchorYs(leftNodeEls.length);
      const rightCoreYs = anchorYs(rightNodeEls.length);

      const nextPaths: ConnectorPath[] = [];

      leftNodeEls.forEach((el, index) => {
        const node = toLocal(el.getBoundingClientRect());
        const nodeId = el.dataset.ampNode ?? String(index);
        const y1 = (node.top + node.bottom) / 2;
        const x1 = node.right;
        const x2 = core.left;
        const y2 = leftCoreYs[index];
        nextPaths.push({
          id: `connector-left-${nodeId}`,
          d: buildCurve(x1, y1, x2, y2),
        });
      });

      rightNodeEls.forEach((el, index) => {
        const node = toLocal(el.getBoundingClientRect());
        const nodeId = el.dataset.ampNode ?? String(index);
        const y1 = (node.top + node.bottom) / 2;
        const x1 = node.left;
        const x2 = core.right;
        const y2 = rightCoreYs[index];
        nextPaths.push({
          id: `connector-right-${nodeId}`,
          d: buildCurve(x1, y1, x2, y2),
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
          <path key={path.id} id={path.id} d={path.d} className={styles.path} />
        ))}
      </svg>
    </div>
  );
}

/**
 * Builds a smooth "S-curve" cubic-bezier path between a node's edge
 * and its core anchor point — horizontal in, horizontal out — giving
 * the fan its curved, organic look instead of a straight diagonal
 * line. Control points sit at the horizontal midpoint between the two
 * ends so the curve is symmetric regardless of how far the core
 * anchor sits above/below the node's own vertical center.
 */
function buildCurve(x1: number, y1: number, x2: number, y2: number): string {
  const midX = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
}
