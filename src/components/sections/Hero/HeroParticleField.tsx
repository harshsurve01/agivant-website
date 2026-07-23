"use client";

import { useEffect, useRef } from "react";
import styles from "./HeroParticleField.module.css";

/**
 * HeroParticleField
 *
 * Interactive cursor-driven particle field, the Sprint 2 layer in the
 * approved chain (Hero → HeroBackground → HeroParticleField → ...).
 * The only Client Component in this subtree — HeroBackground itself
 * stays a Server Component and simply renders this as a nested leaf,
 * the same Server/Client split already used by Button/ButtonMotion.
 *
 * Desktop-only by design: this component either fully mounts its
 * canvas + rAF loop, or renders nothing. There is no touch/mobile
 * variant — see shouldRun() below, re-evaluated on resize so crossing
 * the breakpoint live (e.g. rotating a foldable, resizing a browser
 * window) mounts/unmounts cleanly rather than leaving a dead canvas.
 *
 * Rendering approach: a single canvas, sized to the Hero's own
 * bounding box (not the viewport), redrawn every animation frame.
 * Particle state (position/velocity/opacity) lives in a plain array
 * in a ref — never in React state — so cursor movement and the
 * simulation loop never trigger re-renders.
 *
 * Physics model, per particle, every frame:
 *   1. Reveal:     opacity eases toward a target derived from a smooth
 *                  falloff curve based on distance to the cursor.
 *   2. Repulsion:  cursor applies an outward impulse to nearby
 *                  particles, strength shaped by the same style of
 *                  smooth falloff (no linear/inverse-square cutoff).
 *   3. Spring-back: a damped spring pulls each particle toward its
 *                  original grid position — NOT a simple lerp. This
 *                  is what gives the "liquid settling" feel: the
 *                  spring force and repulsion coexist in the same
 *                  velocity integration, so a particle under active
 *                  repulsion is pulled outward while the spring keeps
 *                  tugging it home, and once repulsion stops the
 *                  spring (plus damping) carries it back and lets it
 *                  settle without overshoot/snapping.
 *   4. Damping:    velocity is scalar-damped each frame so the spring
 *                  doesn't oscillate — this is what makes it a damped
 *                  spring rather than an undamped one.
 */

interface Particle {
  ox: number;
  oy: number; // original (grid) position — fixed for the particle's lifetime
  x: number;
  y: number; // current position
  vx: number;
  vy: number;
  opacity: number; // current rendered opacity, eased toward a target each frame
}

// ---------------------------------------------------------------------------
// Tunable constants. Kept together and named so visual tuning doesn't
// require touching the simulation logic below.
// ---------------------------------------------------------------------------

const DESKTOP_BREAKPOINT_PX = 769; // matches the existing 768px breakpoint
// used elsewhere in Hero/HeroBackground — anything narrower doesn't mount.

const PARTICLE_SPACING_PX =20; // baseline grid spacing — this (not a fixed
// particle count) is what makes density viewport-relative: a wider/taller
// Hero simply tiles more cells at the same spacing, so perceived density
// stays constant across screen sizes instead of thinning out or clumping.
const JITTER_RATIO = 0; // per-axis random offset, as a fraction of
// spacing, applied once at grid-generation time so the field reads as an
// organic scatter rather than a mechanical grid.

const INFLUENCE_RADIUS_PX = 350; // reveal radius — the "flashlight" size
const REPULSION_RADIUS_PX = 130; // repulsion radius — deliberately smaller
// than the reveal radius, so particles are visible for a moment before
// they're disturbed, rather than being pushed the instant they appear.
const REPULSION_STRENGTH = 1.7; // impulse magnitude at distance 0 (falls off
// to 0 at REPULSION_RADIUS_PX via the same smooth curve as opacity)

const SPRING_STIFFNESS = 0.15; // how hard the spring pulls toward origin
const SPRING_DAMPING = 0.82; // per-frame velocity retention (< 1 → damped;
// closer to 1 = looser/bouncier, closer to 0 = stiffer/heavier)

const OPACITY_EASE = 0.09; // how quickly rendered opacity approaches target
const MAX_PARTICLE_OPACITY = 0.55; // ceiling so revealed particles stay
// subtle/atmospheric rather than fully opaque dots
const PARTICLE_RADIUS_PX = 2;

/** Smoothstep-based falloff: 1 at distance 0, eases to 0 at `radius`,
 *  with a soft shoulder at both ends rather than a linear ramp or a
 *  harsh inverse-square spike near the center. This one curve backs
 *  both the reveal fade and the repulsion strength, per the "smooth,
 *  atmospheric, not harsh" direction. */
function smoothFalloff(distance: number, radius: number): number {
  if (distance >= radius) return 0;
  const t = 1 - distance / radius;
  return t * t * (3 - 2 * t); // smoothstep(0,1,t)
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isDesktopWidth(): boolean {
  return (
    typeof window !== "undefined" &&
    window.innerWidth >= DESKTOP_BREAKPOINT_PX
  );
}

/** Builds a jittered grid of particles sized to (width, height) in CSS px. */
function generateParticles(width: number, height: number): Particle[] {
  const particles: Particle[] = [];
  const cols = Math.ceil(width / PARTICLE_SPACING_PX);
  const rows = Math.ceil(height / PARTICLE_SPACING_PX);
  const jitterPx = PARTICLE_SPACING_PX * JITTER_RATIO;

  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const baseX = col * PARTICLE_SPACING_PX;
      const baseY = row * PARTICLE_SPACING_PX;
      const ox = baseX + (Math.random() * 2 - 1) * jitterPx;
      const oy = baseY + (Math.random() * 2 - 1) * jitterPx;
      particles.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0, opacity: 0 });
    }
  }
  return particles;
}

export function HeroParticleField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return; // never mounts the sim — same
    // spirit as HeroBackground.module.css disabling the glow breathing
    // under this media query.
    if (!isDesktopWidth()) return; // desktop-only, per spec — no
    // touch/mobile variant at all, not even a static fallback.

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let dpr = Math.max(window.devicePixelRatio || 1, 1);
    let width = 0;
    let height = 0;

    const cursor = { x: 0, y: 0, active: false };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.max(window.devicePixelRatio || 1, 1);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = generateParticles(width, height);
    };

    resize();

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    // Listen on the shared ancestor (`.experience`, HeroBackground's own
    // wrapper — `container`'s parentElement) rather than on `container`
    // itself. `.contentLayer` sits at a higher z-index and its bounding
    // box covers the *entire* Hero footprint (its own height is what
    // gives `.experience` a height at all, and it's width:100%), so it
    // wins every hit-test across the whole area — `container` would
    // never receive a pointer event directly, no matter where the
    // cursor is. Pointer events bubble, though: a pointer landing on
    // any descendant of `.experience` (whether that's `.contentLayer`
    // or `container` itself, in spots nothing else covers) still
    // propagates up to their common ancestor. Coordinates are still
    // computed against `container`'s own rect below, since that's the
    // canvas's actual positioning box (and it's inset:0 of the parent,
    // so the two rects are identical anyway).
    const trackingTarget = container.parentElement ?? container;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      cursor.x = event.clientX - rect.left;
      cursor.y = event.clientY - rect.top;
    };
    const handlePointerEnter = (event: PointerEvent) => {
      cursor.active = true;
      handlePointerMove(event);
    };
    const handlePointerLeave = () => {
      cursor.active = false;
    };

    trackingTarget.addEventListener("pointermove", handlePointerMove);
    trackingTarget.addEventListener("pointerenter", handlePointerEnter);
    trackingTarget.addEventListener("pointerleave", handlePointerLeave);

    // Theme-aware color: the canvas element inherits `color` from the
    // design token set in HeroParticleField.module.css, so particles
    // stay on-token (and correct under any future theme change)
    // without hardcoding a value here.
    const particleColor = getComputedStyle(canvas).color;

    let rafId = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = particleColor;

      for (const p of particles) {
        const dx = p.x - cursor.x;
        const dy = p.y - cursor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 1. Reveal — ease opacity toward a falloff-shaped target.
        const targetOpacity =
          cursor.active && distance < INFLUENCE_RADIUS_PX
            ? smoothFalloff(distance, INFLUENCE_RADIUS_PX)
            : 0;
        p.opacity += (targetOpacity - p.opacity) * OPACITY_EASE;

        // 2. Repulsion — outward impulse, smooth falloff, only while
        //    the cursor is active and within the (smaller) repulsion radius.
        if (cursor.active && distance < REPULSION_RADIUS_PX && distance > 0.0001) {
          const strength =
            REPULSION_STRENGTH * smoothFalloff(distance, REPULSION_RADIUS_PX);
          p.vx += (dx / distance) * strength;
          p.vy += (dy / distance) * strength;
        }

        // 3. Damped spring back toward the original position — force,
        //    not a positional lerp, so it coexists with repulsion
        //    instead of fighting/snapping against it.
        p.vx += (p.ox - p.x) * SPRING_STIFFNESS;
        p.vy += (p.oy - p.y) * SPRING_STIFFNESS;

        // 4. Damping, then integrate.
        p.vx *= SPRING_DAMPING;
        p.vy *= SPRING_DAMPING;
        p.x += p.vx;
        p.y += p.vy;

        if (p.opacity > 0.003) {
          ctx.globalAlpha = p.opacity * MAX_PARTICLE_OPACITY;
          ctx.beginPath();
          ctx.arc(p.x, p.y, PARTICLE_RADIUS_PX, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      trackingTarget.removeEventListener("pointermove", handlePointerMove);
      trackingTarget.removeEventListener("pointerenter", handlePointerEnter);
      trackingTarget.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}