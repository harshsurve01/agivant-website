"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  buildNearestNeighborEdges,
  generateFibonacciSpherePoints,
  normalizedDepth,
  projectPoint,
  rotatePointOnto,
  type Edge,
  type Point3D,
  type ProjectedPoint,
} from "./orbMath";
import styles from "./NetworkOrb.module.css";

/** Total nodes on the sphere. Tuned to read as a dense-but-legible
 *  mesh at the orb's on-screen size — not exposed as a prop yet since
 *  no caller needs a different density today, but trivial to lift if
 *  a future milestone does. Unchanged from the static milestone. */
const NODE_COUNT = 64;

/** Each node connects to its N nearest neighbours (see orbMath's
 *  buildNearestNeighborEdges) — this is what keeps the mesh a sparse
 *  "wrapped globe" network instead of a fully-connected cloud.
 *  Unchanged from the static milestone. */
const NEIGHBORS_PER_NODE = 3;

/** How much of the canvas's shorter side the sphere's radius fills.
 *  Leaves a small margin so nodes near the silhouette edge don't get
 *  clipped by the canvas bounds. */
const SPHERE_FILL_RATIO = 0.92;

/** Camera distance expressed as a multiple of the sphere radius.
 *  Larger = flatter/more orthographic, smaller = more exaggerated
 *  perspective. 3x gives a subtle, natural-looking depth falloff
 *  without distorting the silhouette into an obvious cone shape. */
const CAMERA_DISTANCE_RATIO = 3;

/** Radians of Y rotation per millisecond, so the loop can multiply
 *  directly by a frame's elapsed time. One full turn every 90 seconds
 *  reads as slow and elegant rather than a spinning toy. Constant —
 *  no acceleration, no easing. */
const ROTATION_RADIANS_PER_MS = (Math.PI * 2) / 20_000;

/** A small, fixed tilt around the X axis (not animated over time) —
 *  purely so the globe doesn't look perfectly upright/flat-on, per
 *  this milestone's "optional subtle X-axis rotation" note. ~8°. */
const TILT_X_RADIANS = (8 * Math.PI) / 180;

const NODE_RADIUS_PX = 2.25;
const LINE_WIDTH_PX = 0.75;

// Base colors, kept identical to the static milestone's palette.
// Alpha here is the "at full strength" value — the draw loop scales
// it down per-element by depth (see depthAlpha below); it never
// changes the RGB, and never exceeds these original alpha values.
const LINE_COLOR_RGB = "197, 120, 255";
const LINE_BASE_ALPHA = 0.35;
const NODE_FILL_RGB = "216, 160, 255";
const NODE_FILL_BASE_ALPHA = 0.85;
const NODE_STROKE_RGB = "133, 0, 223";
const NODE_STROKE_BASE_ALPHA = 0.4;

/** Depth → alpha-multiplier range. Kept narrow on purpose ("subtle,
 *  do not exaggerate") — the farthest point on the globe still reads
 *  clearly, it's just a little softer than the nearest one. */
const DEPTH_ALPHA_MIN = 0.55;
const DEPTH_ALPHA_MAX = 1;

function depthAlpha(z: number, radius: number): number {
  const depth = normalizedDepth(z, radius);
  return DEPTH_ALPHA_MIN + (DEPTH_ALPHA_MAX - DEPTH_ALPHA_MIN) * depth;
}

interface ViewState {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  radius: number;
  cameraDistance: number;
}

/**
 * NetworkOrb
 *
 * A code-generated network globe rendered on a single HTML5 Canvas —
 * no SVG, no Three.js, no animation library. This is the Milestone 2
 * version: the same sphere/edges from Milestone 1 now rotate
 * continuously at a constant, gentle velocity via
 * `requestAnimationFrame`, with depth (post-rotation Z) driving
 * painter's-algorithm draw order and a subtle near/far opacity cue.
 * No glow, no energy pulses, no connector integration — those are
 * later milestones.
 *
 * All math — sphere generation, the neighbour graph, per-frame
 * rotation, projection, and depth normalization — lives in
 * orbMath.ts. This file only owns canvas setup (HiDPI scaling, resize
 * handling), the rAF loop itself, and the actual `ctx.*` drawing
 * calls; it never computes geometry.
 *
 * Renders as an absolutely-positioned layer that fills its parent
 * (see NetworkOrb.module.css) — AmpCore is responsible for sizing
 * that parent and for stacking the logo/circle above this component
 * via z-index, so this component has zero knowledge of the logo.
 *
 * Performance: `points` and `edges` are generated once via `useMemo`
 * on a UNIT sphere, same as the static milestone. Two more buffers —
 * `rotatedPoints` and `projectedPoints` — are allocated once (one
 * `Point3D`/`ProjectedPoint` per source point) and then overwritten
 * in place every frame via `rotatePointOnto`/`projectPoint`'s `out`
 * parameter, so the animation loop never allocates a new points array.
 * The only per-frame array work is re-sorting two small, preallocated
 * index arrays (for the painter's-algorithm draw order) — sorting
 * itself is unavoidable since depth order changes every frame, but no
 * new index array is built from scratch each time.
 *
 * No React state: everything the loop needs (current rotation angle,
 * last frame timestamp, current view/canvas metrics) lives in refs or
 * closure-local variables, updated imperatively. A ResizeObserver
 * updates the view metrics and the canvas's backing store only when
 * the container's size actually changes — not every frame — matching
 * the pattern AmpConnectorLayer already uses elsewhere in this
 * section. The rAF loop is started once on mount and cancelled on
 * unmount.
 */
export function NetworkOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Unit-sphere geometry: generated once and never touched by resize,
  // rotation, DPR changes, or re-renders.
  const points = useMemo<Point3D[]>(() => generateFibonacciSpherePoints(NODE_COUNT), []);
  const edges = useMemo<Edge[]>(
    () => buildNearestNeighborEdges(points, NEIGHBORS_PER_NODE),
    [points]
  );

  // Reusable per-frame buffers — allocated once, overwritten in place
  // every frame instead of being rebuilt.
  const rotatedPoints = useMemo<Point3D[]>(
    () => points.map(() => ({ x: 0, y: 0, z: 0 })),
    [points]
  );
  const projectedPoints = useMemo<ProjectedPoint[]>(
    () => points.map(() => ({ x: 0, y: 0, scale: 0, z: 0 })),
    [points]
  );
  const edgeDrawOrder = useMemo<number[]>(() => edges.map((_, index) => index), [edges]);
  const nodeDrawOrder = useMemo<number[]>(() => points.map((_, index) => index), [points]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // TypeScript can't carry the `ctx !== null` narrowing from the
    // check above into the nested resizeCanvas/drawFrame closures
    // below (control-flow narrowing doesn't cross function
    // boundaries) — even though `ctx` is a `const` that can never
    // become null again. Rebinding it here with an explicit non-null
    // type is what removes the "'ctx' is possibly 'null'" errors
    // without needing `!` assertions scattered through the draw loop.
    const context: CanvasRenderingContext2D = ctx;

    const view: ViewState = {
      width: 0,
      height: 0,
      centerX: 0,
      centerY: 0,
      radius: 0,
      cameraDistance: 0,
    };

    function resizeCanvas() {
      if (!container || !canvas) return;
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      // HiDPI: back the canvas with `dpr`x pixels but keep its CSS
      // box at the container's logical size, so lines/nodes stay
      // crisp on retina displays instead of blurring.
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      view.width = width;
      view.height = height;
      view.centerX = width / 2;
      view.centerY = height / 2;
      view.radius = (Math.min(width, height) / 2) * SPHERE_FILL_RATIO;
      view.cameraDistance = view.radius * CAMERA_DISTANCE_RATIO;
    }

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    let animationFrameId = 0;
    let lastTimestamp: number | null = null;
    let angleY = 0;

    function drawFrame(timestamp: number) {
      animationFrameId = requestAnimationFrame(drawFrame);

      if (lastTimestamp === null) lastTimestamp = timestamp;
      const elapsedMs = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // Constant angular velocity: elapsed time scales the rotation
      // directly, so speed stays the same regardless of frame rate —
      // no acceleration, no easing.
      angleY += elapsedMs * ROTATION_RADIANS_PER_MS;

      if (view.width === 0 || view.height === 0) return;

      for (let i = 0; i < points.length; i++) {
        rotatePointOnto(points[i], angleY, TILT_X_RADIANS, rotatedPoints[i]);
        projectPoint(rotatedPoints[i], view, projectedPoints[i]);
      }

      context.clearRect(0, 0, view.width, view.height);

      // Painter's algorithm: draw back-to-front by depth so nearer
      // lines/nodes naturally sit above farther ones without any
      // manual layering logic. Sorting the preallocated index arrays
      // in place — no new array is created here.
      edgeDrawOrder.sort((a, b) => {
        const za = (projectedPoints[edges[a][0]].z + projectedPoints[edges[a][1]].z) / 2;
        const zb = (projectedPoints[edges[b][0]].z + projectedPoints[edges[b][1]].z) / 2;
        return za - zb;
      });
      nodeDrawOrder.sort((a, b) => projectedPoints[a].z - projectedPoints[b].z);

      context.lineWidth = LINE_WIDTH_PX;
      for (const edgeIndex of edgeDrawOrder) {
        const [a, b] = edges[edgeIndex];
        const from = projectedPoints[a];
        const to = projectedPoints[b];
        const alpha = LINE_BASE_ALPHA * depthAlpha((from.z + to.z) / 2, view.radius);
        context.strokeStyle = `rgba(${LINE_COLOR_RGB}, ${alpha})`;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
      }

      for (const nodeIndex of nodeDrawOrder) {
        const node = projectedPoints[nodeIndex];
        const alpha = depthAlpha(node.z, view.radius);
        context.fillStyle = `rgba(${NODE_FILL_RGB}, ${NODE_FILL_BASE_ALPHA * alpha})`;
        context.strokeStyle = `rgba(${NODE_STROKE_RGB}, ${NODE_STROKE_BASE_ALPHA * alpha})`;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(node.x, node.y, NODE_RADIUS_PX, 0, Math.PI * 2);
        context.fill();
        context.stroke();
      }
    }

    animationFrameId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [points, edges, rotatedPoints, projectedPoints, edgeDrawOrder, nodeDrawOrder]);

  return (
    <div ref={containerRef} className={styles.wrapper} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}