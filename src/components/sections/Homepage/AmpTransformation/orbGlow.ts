/* ==========================================================================
   orbGlow.ts
   The orb's Glow System (Milestone 3): per-node illumination that
   reacts to energy arrivals, plus a slow global "breathing" intensity
   for the whole orb. This module knows nothing about the graph,
   beams, rotation, or the canvas — NetworkOrb.tsx calls
   triggerNode()/step() and reads `nodeGlow` / `ambientIntensity` when
   it draws each frame. The only thing connecting this to the Energy
   System is the `onNodeArrival` callback wired up in NetworkOrb.tsx;
   neither module imports the other.
   ========================================================================== */

/** Per-millisecond decay factor for a triggered node's glow, applied
 *  as `decay ** elapsedMs` rather than a flat per-frame multiplier so
 *  the fade rate stays consistent regardless of frame rate. Chosen
 *  for a smooth "glow -> fade back" over several hundred ms — closer
 *  to 1 would linger longer, closer to 0 would snap off. */
const NODE_GLOW_DECAY_PER_MS = 0.9985;

/** Full ambient breathing cycle length, in ms — long and subtle per
 *  spec, not a pulse. */
const BREATH_PERIOD_MS = 20_000;

/** How far the global intensity multiplier swings above/below 1 —
 *  kept small so it reads as a slow shift in mood rather than a
 *  visible flicker. */
const BREATH_AMPLITUDE = 0.12;

export class GlowSystem {
  /** Current glow intensity per node, 0 (resting) to 1 (just hit by a
   *  beam). Plain typed array, not React state — this is written
   *  every frame and read directly by the draw loop. */
  readonly nodeGlow: Float32Array;
  private breathPhaseMs = 0;

  constructor(nodeCount: number) {
    this.nodeGlow = new Float32Array(nodeCount);
  }

  /** Call when a beam reaches `nodeIndex`. Snaps that node's glow
   *  to full — if it's already glowing from another arriving beam,
   *  this simply keeps it lit rather than double-brightening it — and
   *  step() eases it back down on subsequent frames. */
  triggerNode(nodeIndex: number) {
    this.nodeGlow[nodeIndex] = 1;
  }

  /** Advances glow decay and the breathing clock by `elapsedMs`. Call
   *  once per animation frame. */
  step(elapsedMs: number) {
    const decay = Math.pow(NODE_GLOW_DECAY_PER_MS, elapsedMs);
    for (let i = 0; i < this.nodeGlow.length; i++) {
      const value = this.nodeGlow[i];
      if (value > 0.001) {
        this.nodeGlow[i] = value * decay;
      } else if (value !== 0) {
        this.nodeGlow[i] = 0;
      }
    }

    this.breathPhaseMs = (this.breathPhaseMs + elapsedMs) % BREATH_PERIOD_MS;
  }

  /** This frame's global orb intensity multiplier — a slow sine
   *  oscillation around 1. Every alpha calculation in the draw loop
   *  multiplies by this, so breathing layers on top of the existing
   *  depth-based alpha logic without touching the underlying palette
   *  or any base alpha value. */
  get ambientIntensity(): number {
    const t = (this.breathPhaseMs / BREATH_PERIOD_MS) * Math.PI * 2;
    return 1 + Math.sin(t) * BREATH_AMPLITUDE;
  }
}