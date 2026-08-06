/* ==========================================================================
   orbMath.ts
   All of the Network Orb's math lives here, deliberately isolated from
   React: point generation, neighbour-graph construction, rotation,
   projection, and depth normalization are pure functions operating on
   plain numbers/objects. NetworkOrb.tsx only ever calls into this
   file and draws whatever it returns — it never computes geometry
   itself. That split is what lets future milestones (glow, energy
   pulses, connector integration) extend the math here without
   touching canvas/React code, and vice versa.

   Every generator below works on a UNIT sphere (radius 1). NetworkOrb
   scales points up to real pixels at draw time, so resizing the
   canvas never requires regenerating the sphere or its neighbour
   graph — only re-projecting the same points, which is cheap enough
   to do every animation frame.
   ========================================================================== */

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

/** An edge is just a pair of indices into a Point3D[] array. */
export type Edge = readonly [number, number];

export interface ProjectedPoint {
  x: number;
  y: number;
  /** Perspective scale factor applied at this depth — >1 means
   *  "closer to camera than the sphere's equator", <1 means
   *  "farther". Reserved for future depth-based sizing; NetworkOrb
   *  uses it for draw-order today. */
  scale: number;
  /** Original unprojected (but rotated) z, kept for painter's-algorithm
   *  sorting and for depth-based opacity. */
  z: number;
}

/**
 * Generates `count` points evenly distributed across the surface of a
 * unit sphere using the Fibonacci/golden-angle spiral. This gives a
 * "natural and balanced" distribution (no clustering at the poles the
 * way naive lat/long grids produce) without any randomness — the
 * layout is fully deterministic for a given `count`.
 */
export function generateFibonacciSpherePoints(count: number): Point3D[] {
  if (count <= 0) return [];

  const points: Point3D[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    // y sweeps linearly from +1 (top pole) to -1 (bottom pole).
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;

    points.push({
      x: Math.cos(theta) * radiusAtY,
      y,
      z: Math.sin(theta) * radiusAtY,
    });
  }

  return points;
}

function distance3D(a: Point3D, b: Point3D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Connects each point to its `neighborsPerNode` nearest points (by
 * straight-line 3D distance), deduplicating so an edge between the
 * same pair is never drawn twice. This intentionally does NOT
 * connect every node to every other node — the result is a sparse
 * "wrapped around a globe" mesh rather than a dense cloud.
 *
 * O(n²) distance computation is fine here: this runs once for a
 * fixed, small node count (tens of points), not per frame — the
 * graph is generated on the UNIT sphere before any rotation is ever
 * applied, so rotating the globe never needs to recompute it.
 */
export function buildNearestNeighborEdges(
  points: Point3D[],
  neighborsPerNode: number
): Edge[] {
  const seen = new Set<string>();
  const edges: Edge[] = [];

  points.forEach((point, index) => {
    const distances = points
      .map((other, otherIndex) => ({
        index: otherIndex,
        distance: index === otherIndex ? Infinity : distance3D(point, other),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, neighborsPerNode);

    distances.forEach(({ index: neighborIndex }) => {
      const key = index < neighborIndex ? `${index}-${neighborIndex}` : `${neighborIndex}-${index}`;
      if (seen.has(key)) return;
      seen.add(key);
      edges.push(index < neighborIndex ? [index, neighborIndex] : [neighborIndex, index]);
    });
  });

  return edges;
}

/**
 * Rotates `source` (a point on the unit sphere) around the Y axis by
 * `angleY`, then around the X axis by `angleX`, writing the result
 * into `target` — no new object is allocated. This is what makes the
 * per-frame rotation cheap: NetworkOrb preallocates one `Point3D`
 * per source point once, then calls this every frame to overwrite the
 * same buffer instead of building a new rotated-points array each
 * time.
 *
 * `source` and `target` may be the same object only if you don't need
 * the original preserved — NetworkOrb always keeps them separate
 * (unrotated `points` vs. a reusable `rotatedPoints` buffer) so the
 * base geometry from generateFibonacciSpherePoints is never mutated.
 *
 * Y-axis rotation is the primary, continuously-accumulating spin.
 * X-axis rotation is intended for a small constant tilt (see
 * NetworkOrb's TILT_X) rather than its own independent animation —
 * this function doesn't care which use case it's called for, it just
 * rotates.
 */
export function rotatePointOnto(source: Point3D, angleY: number, angleX: number, target: Point3D): void {
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const rotatedX = source.x * cosY + source.z * sinY;
  const rotatedZ = source.z * cosY - source.x * sinY;

  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const rotatedY = source.y * cosX - rotatedZ * sinX;
  const finalZ = source.y * sinX + rotatedZ * cosX;

  target.x = rotatedX;
  target.y = rotatedY;
  target.z = finalZ;
}

export interface ProjectionOptions {
  /** Center of the sphere in screen-space pixels. */
  centerX: number;
  centerY: number;
  /** Sphere radius in screen-space pixels (unit-sphere points get
   *  multiplied up to this before projecting). */
  radius: number;
  /** Distance from the camera to the sphere's center, in the same
   *  pixel units as `radius`. Larger values flatten the perspective
   *  toward orthographic; smaller values exaggerate depth. */
  cameraDistance: number;
}

/**
 * Projects a single sphere point (already rotated, if applicable)
 * into 2D screen space using a simple perspective projection from a
 * static camera looking at the sphere's center — rotating the globe
 * rotates the points themselves (see `rotatePointOnto`), not the
 * camera, so this function's math never changes between the static
 * and rotating milestones.
 *
 * Pass `out` to write into an existing ProjectedPoint instead of
 * allocating a new one — NetworkOrb preallocates one `ProjectedPoint`
 * per source point and reuses that buffer every frame, so a full
 * 60fps rotation never allocates a new points array.
 */
export function projectPoint(
  point: Point3D,
  options: ProjectionOptions,
  out?: ProjectedPoint
): ProjectedPoint {
  const { centerX, centerY, radius, cameraDistance } = options;

  const worldX = point.x * radius;
  const worldY = point.y * radius;
  const worldZ = point.z * radius;

  const scale = cameraDistance / (cameraDistance - worldZ);

  const result = out ?? { x: 0, y: 0, scale: 0, z: 0 };
  result.x = centerX + worldX * scale;
  result.y = centerY + worldY * scale;
  result.scale = scale;
  result.z = worldZ;
  return result;
}

/**
 * Maps a rotated point's world-space Z (in the same pixel units as
 * `radius`, i.e. roughly `[-radius, radius]`) to a `0..1` depth
 * fraction where `1` is "as close to the camera as this sphere gets"
 * and `0` is "as far as this sphere gets". Used to drive the subtle
 * near-stronger/far-softer opacity cue — kept as its own tiny pure
 * function so that cue's math lives here rather than being inlined
 * into the draw loop.
 */
export function normalizedDepth(z: number, radius: number): number {
  if (radius <= 0) return 0.5;
  const value = (z / radius + 1) / 2;
  return Math.min(1, Math.max(0, value));
}