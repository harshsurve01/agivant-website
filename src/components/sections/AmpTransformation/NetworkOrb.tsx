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
import { EnergySystem, type EdgeBeam } from "./orbEnergy";
import { GlowSystem } from "./orbGlow";
import styles from "./NetworkOrb.module.css";

/** Total nodes on the sphere. Tuned to read as a dense-but-legible
 *  mesh at the orb's on-screen size — not exposed as a prop yet since
 *  no caller needs a different density today, but trivial to lift if
 *  a future milestone does. Unchanged from the static milestone. */
const NODE_COUNT = 94;

/** Each node connects to its N nearest neighbours (see orbMath's
 *  buildNearestNeighborEdges) — this is what keeps the mesh a sparse
 *  "wrapped globe" network instead of a fully-connected cloud.
 *  Unchanged from the static milestone. */
const NEIGHBORS_PER_NODE = 4;

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

const NODE_RADIUS_PX = 2.5;
const LINE_WIDTH_PX = 1;

// Base colors, kept identical to the static milestone's palette.
// Alpha here is the "at full strength" value — the draw loop scales
// it down per-element by depth (see depthAlpha below); it never
// changes the RGB, and never exceeds these original alpha values.
const LINE_COLOR_RGB = "197, 120, 255";
const LINE_BASE_ALPHA = 0.5;
const NODE_FILL_RGB = "216, 160, 255";
const NODE_FILL_BASE_ALPHA = 0.95;
const NODE_STROKE_RGB = "133, 0, 223";
const NODE_STROKE_BASE_ALPHA = 0.9;

/** Depth → alpha-multiplier range. Kept narrow on purpose ("subtle,
 *  do not exaggerate") — the farthest point on the globe still reads
 *  clearly, it's just a little softer than the nearest one. */
const DEPTH_ALPHA_MIN = 0.55;
const DEPTH_ALPHA_MAX = 1;

function depthAlpha(z: number, radius: number): number {
  const depth = normalizedDepth(z, radius);
  return DEPTH_ALPHA_MIN + (DEPTH_ALPHA_MAX - DEPTH_ALPHA_MIN) * depth;
}

// ---------------------------------------------------------------------------
// Energy System tuning (Milestone 3, continuous-beam revision). Every
// edge has its own beam, always moving — no pool, no spawn interval,
// no hop budget, no branching. Beams never introduce a new color —
// they render using the existing NODE_FILL_RGB token above, same
// palette, just moving.
// ---------------------------------------------------------------------------

/** Progress-per-ms range; re-randomized every time a beam completes a
 *  lap, so a single edge's pace still drifts over time. ~500-1100ms
 *  to cross one edge. */
const BEAM_SPEED_RANGE: [number, number] = [0.0009, 0.002];

/** Width of the lit window as a fraction of the edge's own length,
 *  centered on `beam.progress` — not a head-plus-trailing-tail, just
 *  a short window of light that slides continuously along the edge
 *  and fades to fully transparent at both of its own ends, the same
 *  "light passing through fibre" read used for the connector sweeps
 *  elsewhere in this section (see AmpConnectorLayer.tsx). There is no
 *  separate bright dot riding at one end — the whole window is the
 *  beam. */
const BEAM_WINDOW_PROGRESS = 1;

/** Peak alpha at the window's exact center (t=0.5 of the window,
 *  before depth/ambient multipliers). The gradient's own stops taper
 *  this down to 0 at both window edges. */
const BEAM_PEAK_ALPHA = 0.9;

const BEAM_LINE_WIDTH_PX = 3.5;

// ---------------------------------------------------------------------------
// Glow System tuning (Milestone 3).
// ---------------------------------------------------------------------------

const NODE_GLOW_RADIUS_MULTIPLIER = 3.2; // halo radius as a multiple of NODE_RADIUS_PX
const NODE_GLOW_MAX_ALPHA = 0.55; // kept subtle per spec
const NODE_GLOW_FILL_BOOST = 0.35; // small extra brightness on the node's own dot while it's lit

/** Draws one edge's beam as a single travelling light-sweep window —
 *  no packet, no separate head dot, nothing that reads as a discrete
 *  object moving along the edge. A short symmetric window, centered
 *  on `beam.progress` and fading to fully transparent at both of its
 *  own ends, slides continuously along the edge's *already-projected*
 *  endpoints for this frame — the same straight segment the base edge
 *  line is drawn along, so the sweep visibly rides the existing line
 *  rather than cutting its own path. `beam.direction` picks which
 *  endpoint is the travel origin; because the window is symmetric,
 *  swapping direction only changes which way it slides, not its
 *  shape. The window's t-range is allowed to extend slightly past
 *  [0, 1] (i.e. past the edge's own endpoints) on purpose — its own
 *  gradient stops are already 0 alpha out there, so it simply fades
 *  out before reaching the node rather than clipping abruptly. */
function drawEdgeBeam(
  context: CanvasRenderingContext2D,
  edge: Edge,
  beam: EdgeBeam,
  projectedPoints: ProjectedPoint[],
  view: ViewState,
  ambientIntensity: number
) {
  const a = projectedPoints[edge[0]];
  const b = projectedPoints[edge[1]];
  const from = beam.direction === 1 ? a : b;
  const to = beam.direction === 1 ? b : a;

  const halfWindow = BEAM_WINDOW_PROGRESS / 2;
  const startT = beam.progress - halfWindow;
  const endT = beam.progress + halfWindow;

  const startX = from.x + (to.x - from.x) * startT;
  const startY = from.y + (to.y - from.y) * startT;
  const endX = from.x + (to.x - from.x) * endT;
  const endY = from.y + (to.y - from.y) * endT;

  const alpha = depthAlpha((from.z + to.z) / 2, view.radius) * ambientIntensity;
  const peak = BEAM_PEAK_ALPHA * alpha;

  const gradient = context.createLinearGradient(startX, startY, endX, endY);
  gradient.addColorStop(0, `rgba(${NODE_FILL_RGB}, 0)`);
  gradient.addColorStop(0.3, `rgba(${NODE_FILL_RGB}, ${peak * 0.45})`);
  gradient.addColorStop(0.5, `rgba(${NODE_FILL_RGB}, ${peak})`);
  gradient.addColorStop(0.7, `rgba(${NODE_FILL_RGB}, ${peak * 0.45})`);
  gradient.addColorStop(1, `rgba(${NODE_FILL_RGB}, 0)`);

  context.strokeStyle = gradient;
  context.lineWidth = BEAM_LINE_WIDTH_PX;
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
}

/** Soft radial halo behind a node whose glow (from a recent beam
 *  arrival) is above a barely-visible threshold. Purely additive —
 *  the node's own fill/stroke draw calls are untouched by this. */
function drawNodeGlow(
  context: CanvasRenderingContext2D,
  node: ProjectedPoint,
  glowValue: number,
  view: ViewState,
  ambientIntensity: number
) {
  if (glowValue <= 0.02) return;

  const alpha = depthAlpha(node.z, view.radius) * ambientIntensity;
  const haloRadius = NODE_RADIUS_PX * NODE_GLOW_RADIUS_MULTIPLIER;

  const gradient = context.createRadialGradient(node.x, node.y, 0, node.x, node.y, haloRadius);
  gradient.addColorStop(0, `rgba(${NODE_FILL_RGB}, ${NODE_GLOW_MAX_ALPHA * glowValue * alpha})`);
  gradient.addColorStop(1, `rgba(${NODE_FILL_RGB}, 0)`);

  context.fillStyle = gradient;
  context.beginPath();
  context.arc(node.x, node.y, haloRadius, 0, Math.PI * 2);
  context.fill();
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
 * no SVG, no Three.js, no animation library. This is the Milestone 3
 * version: the same sphere/edges/rotation/projection from Milestones
 * 1-2 are completely untouched — this milestone only adds internal
 * life on top of them, via two independent systems:
 *
 *   - Energy System (orbEnergy.ts): every edge carries its own light
 *     beam that loops continuously along it — the whole network is
 *     flowing at once, all the time, not a sparse set of packets
 *     spawning/hopping/expiring on a subset of edges. Pure per-edge
 *     progress + looping — no rendering, no knowledge of rotation or
 *     the canvas.
 *   - Glow System (orbGlow.ts): per-node illumination triggered when
 *     a beam completes a lap and arrives at its edge's far node (via
 *     a one-way callback from the Energy System — neither module
 *     imports the other), plus a slow global "breathing" intensity
 *     for the whole orb.
 *
 * This file wires the two together and does all the drawing: it
 * steps both systems once per frame, then paints each edge's base
 * line immediately followed by its beam (so every beam visibly rides
 * its own line), then node glow halos and node dots on top.
 *
 * All sphere/graph math — sphere generation, the neighbour graph,
 * per-frame rotation, projection, and depth normalization — still
 * lives in orbMath.ts, untouched. This file owns canvas setup (HiDPI
 * scaling, resize handling), the rAF loop, wiring the Energy/Glow
 * systems, and the actual `ctx.*` drawing calls; it never computes
 * sphere/edge geometry itself.
 *
 * Renders as an absolutely-positioned layer that fills its parent
 * (see NetworkOrb.module.css) — AmpCore is responsible for sizing
 * that parent and for stacking the logo/circle above this component
 * via z-index, so this component has zero knowledge of the logo.
 *
 * Milestone 5: the root carries `data-amp-orb="true"` so AmpExperience's
 * GSAP timeline can select and animate (opacity/scale) this layer from
 * the outside, the same DOM-attribute pattern AmpCore already uses for
 * `data-amp-core` — this component still has zero knowledge that any
 * of that scroll choreography exists, or even that it's being
 * animated at all; the rotation loop above runs identically either
 * way, since it's time-driven and never touches opacity/transform on
 * `.wrapper` itself.
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

    // Milestone 3: internal life, layered on top of the untouched
    // rotation/projection above. Created once per mount, same as the
    // buffers above — neither system imports the other; the only
    // link between them is this callback, so a node's arrival tells
    // the Glow System to light up without the Energy System knowing
    // anything about glow, and without the Glow System knowing
    // anything about packets or edges.
    const glow = new GlowSystem(points.length);
    const energy = new EnergySystem(edges, {
      speedRange: BEAM_SPEED_RANGE,
      onNodeArrival: (nodeIndex) => glow.triggerNode(nodeIndex),
    });

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

      energy.step(elapsedMs);
      glow.step(elapsedMs);
      const ambientIntensity = glow.ambientIntensity;

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
        const edge = edges[edgeIndex];
        const [a, b] = edge;
        const from = projectedPoints[a];
        const to = projectedPoints[b];
        const alpha = LINE_BASE_ALPHA * depthAlpha((from.z + to.z) / 2, view.radius) * ambientIntensity;
        context.strokeStyle = `rgba(${LINE_COLOR_RGB}, ${alpha})`;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();

        // Every edge carries its own continuously-looping beam — the
        // base line above never disappears, only the beam moves along
        // it. Drawn right after that edge's line, in the same
        // depth-sorted pass, so beams stay consistent with the
        // painter's-algorithm order already established for edges.
        drawEdgeBeam(context, edge, energy.beams[edgeIndex], projectedPoints, view, ambientIntensity);
      }

      for (const nodeIndex of nodeDrawOrder) {
        const node = projectedPoints[nodeIndex];
        const depthFactor = depthAlpha(node.z, view.radius);
        const glowValue = glow.nodeGlow[nodeIndex];

        // Soft halo first, so the node's own fill/stroke paints on
        // top of it — this is the only new visual behind the node.
        drawNodeGlow(context, node, glowValue, view, ambientIntensity);

        // A currently-lit node's own dot gets a small, capped
        // brightness boost on top of the existing depth-based alpha —
        // kept subtle per spec, the halo carries most of the effect.
        const boost = 1 + glowValue * NODE_GLOW_FILL_BOOST;
        const alpha = depthFactor * ambientIntensity;
        context.fillStyle = `rgba(${NODE_FILL_RGB}, ${Math.min(1, NODE_FILL_BASE_ALPHA * alpha * boost)})`;
        context.strokeStyle = `rgba(${NODE_STROKE_RGB}, ${Math.min(1, NODE_STROKE_BASE_ALPHA * alpha * boost)})`;
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
    <div ref={containerRef} className={styles.wrapper} aria-hidden="true" data-amp-orb="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}