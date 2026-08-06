/* ==========================================================================
   orbEnergy.ts
   The orb's Energy System (Milestone 3, continuous-beam revision):
   every edge in the graph carries its own light beam, always moving,
   all the time — not sparse packets that spawn/hop/expire on a
   subset of edges. This module owns beam progress and looping only;
   it has no idea what a canvas, a rotation angle, or a projected
   point is. NetworkOrb.tsx reads `EnergySystem.beams` each frame
   (index-aligned with the existing `edges` array) and decides how to
   paint them; this file never draws anything.

   Deliberately generic on purpose: nothing here references "orb"
   concepts beyond a plain edge list, so the same beam engine is
   reusable later to animate Orb → Connector Lines → Cards, per the
   milestone's future-compatibility note. NetworkOrb.tsx is just
   today's only caller.
   ========================================================================== */

import type { Edge } from "./orbMath";

export interface EdgeBeam {
  /** 0..1 position along the edge, looping back to 0 on overflow so
   *  the beam is a continuous, never-ending stream rather than a
   *  one-shot travel. */
  progress: number;
  /** Progress units per ms. Re-randomized every loop (not just once
   *  per edge) so a single edge's pace still drifts over time instead
   *  of repeating identically forever. */
  speed: number;
  /** Fixed per edge at creation: 1 travels node[0] -> node[1], -1 the
   *  reverse. Chosen once so a given edge's beam always flows the
   *  same way, rather than flickering direction. */
  direction: 1 | -1;
}

export interface EnergySystemOptions {
  /** Progress-per-ms range; a beam's speed is re-rolled from this
   *  range each time it loops, keeping motion organic rather than
   *  metronomic. */
  speedRange: [number, number];
  /** Called every time a beam completes a full traversal of its edge
   *  and loops back to its start — this is the Energy System's only
   *  connection to the Glow System, and it's a one-way callback, not
   *  a shared data structure, so the two systems stay decoupled. */
  onNodeArrival?: (nodeIndex: number) => void;
}

function randomBetween([min, max]: [number, number]): number {
  return min + Math.random() * (max - min);
}

/** One beam per edge, index-aligned with the edge list passed in.
 *  Every edge is active from the moment the system is constructed —
 *  there's no pool, no spawning, no lifecycle to run out: the whole
 *  network is lit and flowing simultaneously and constantly. */
export class EnergySystem {
  readonly beams: EdgeBeam[];
  private readonly edges: Edge[];
  private readonly options: EnergySystemOptions;

  constructor(edges: Edge[], options: EnergySystemOptions) {
    this.edges = edges;
    this.options = options;
    this.beams = edges.map(() => ({
      // Random starting phase per edge so every beam doesn't begin
      // its loop in lockstep — the network reads as continuously
      // alive rather than pulsing on a shared beat, even though every
      // edge is moving at once.
      progress: Math.random(),
      speed: randomBetween(options.speedRange),
      direction: Math.random() < 0.5 ? 1 : -1,
    }));
  }

  /** Advances every beam by `elapsedMs`. A beam that completes its
   *  edge reports the arrival node to the Glow System and immediately
   *  starts its next lap with a fresh randomized speed — the stream
   *  never stops. Call once per animation frame. */
  step(elapsedMs: number) {
    for (let i = 0; i < this.beams.length; i++) {
      const beam = this.beams[i];
      beam.progress += beam.speed * elapsedMs;

      while (beam.progress >= 1) {
        beam.progress -= 1; // loop, don't reset to exactly 0 — keeps the
        // beam's motion continuous across the wrap instead of a visible jump

        const edge = this.edges[i];
        const arrivalNode = beam.direction === 1 ? edge[1] : edge[0];
        this.options.onNodeArrival?.(arrivalNode);

        beam.speed = randomBetween(this.options.speedRange);
      }
    }
  }
}