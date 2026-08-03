"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import styles from "./AmpConnectorLayer.module.css";

interface ConnectorPath {
  id: string;
  d: string;
  /** Raw local-space anchor coordinates — the same (x1,y1)->(x2,y2)
   *  endpoints `buildCurve` drew the path between. Kept alongside `d`
   *  so each connector's gradients (see below) can be oriented along
   *  that connector's own direction via `gradientUnits="userSpaceOnUse"`,
   *  without re-deriving anything from the path string. */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// ---------------------------------------------------------------------------
// Connector system. Deliberately minimal — every connector is exactly
// two layers, nothing else:
//
//   1. Static Connector — always visible, never animated. A plain
//      grey→purple→grey gradient stroke.
//   2. Travelling Light Beam — the only animated element. A short,
//      soft-edged highlight that slides continuously along the
//      connector, like a reflection sliding across polished glass —
//      not a particle, not a dot, not a pulse.
//
// There is no separate glow layer, no beam "head" marker, and no
// packet/node-activation logic of any kind — those all belonged to an
// earlier, more game-like revision of this system and have been
// removed on purpose.
// ---------------------------------------------------------------------------

// Layer 1 — Static Connector. Grey blending into the background at
// both ends, purple sitting at the midpoint. Fixed, never animated.
const BASE_GRADIENT_GREY_RGB = "99, 97, 97";
const BASE_GRADIENT_PURPLE_RGB = "151, 92, 255";

// Layer 2 — Travelling Light Beam. Drawn as an exact duplicate of the
// connector's own geometry (same width, same cap, no blur) so it
// reads as *that line's own color changing*, not as a distinct shape
// sliding over it — the connector's stroke briefly tints bright
// Agivant purple, then fades back to grey, the way light passing
// through fibre briefly lights up the cable rather than appearing as
// an object inside it. One hue only — no lighter "core" tone — so
// there's nothing for the eye to lock onto as a travelling object.
const SWEEP_PURPLE_RGB = "151, 92, 255"; // Agivant purple — same family as the static gradient's midpoint

// Fixed pixel length for the illuminated window (not a fraction of
// the connector's own length), so it reads the same size on every
// connector regardless of how long or short that connector is.
const SWEEP_WINDOW_PX_RANGE: [number, number] = [80, 150];

// Per-connector beam speed and start-delay ranges — "randomize
// timing, but don't let it turn chaotic," so the ranges are narrow.
const SWEEP_DURATION_RANGE_S: [number, number] = [0.9, 1.6];
const SWEEP_DELAY_RANGE_S: [number, number] = [0, 0.4];

// Which LEFT connectors currently show a beam at all — a small,
// rotating subset, each cycling fully independently of the others.
// Right-side connectors do NOT use this — see the "Right-side
// routing" block below, which schedules them as coordinated patterns
// instead of independent per-connector cycles.
const MAX_ACTIVE_LEFT_SWEEPS = 2;
const SWEEP_ACTIVE_MS: [number, number] = [2200, 3400]; // how long a chosen connector keeps its beam
const SWEEP_REST_MS: [number, number] = [900, 2600]; // gap before that connector can be chosen again
const SWEEP_RETRY_MS: [number, number] = [300, 900]; // if the cap is full, how soon to check again

// ---------------------------------------------------------------------------
// Right-side routing. Right connectors don't cycle independently —
// they're driven by an "intelligent routing" cycle: each cycle picks
// how many outcomes light up together (weighted so a single outcome
// is by far the most common case and "light up everything" is rare),
// then which specific connectors, biased against repeating whichever
// ones just fired. See `runRightRoutingCycle` in the scheduling
// effect below.
// ---------------------------------------------------------------------------

// Illustrative weights, not exact probabilities to hit precisely —
// single-outcome cycles should dominate, full-distribution cycles
// should be rare. `count: Infinity` is clamped to "every right
// connector that currently exists" wherever it's consumed.
const RIGHT_PATTERN_WEIGHTS: ReadonlyArray<{ count: number; weight: number }> = [
  { count: 1, weight: 0.25 },
  { count: 2, weight: 0.45 },
  { count: 3, weight: 0.3 },
  { count: Infinity, weight: 0.15 },
];

const RIGHT_CYCLE_ACTIVE_MS: [number, number] = [2200, 3400]; // how long a routed connector's beam stays lit
const RIGHT_CYCLE_REST_MS: [number, number] = [700, 1900]; // gap after one full cycle before the next is picked
const RIGHT_STAGGER_MS_RANGE: [number, number] = [50, 300]; // jitter between each connector's start within a multi-connector cycle

function randomBetween([min, max]: [number, number]): number {
  return min + Math.random() * (max - min);
}

/** Fisher-Yates shuffle, used to build/refill the right-side "draw
 *  bag" (see `createRightConnectorBag` below) — never mutates its
 *  input. */
function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Weighted random pick from `RIGHT_PATTERN_WEIGHTS`-shaped options —
 *  a plain roulette-wheel selection, not an exact quota system, which
 *  is what keeps single-outcome cycles common and full-distribution
 *  cycles rare without ever hard-locking to a fixed ratio. */
function pickWeighted(options: ReadonlyArray<{ count: number; weight: number }>): number {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  let roll = Math.random() * total;
  for (const option of options) {
    if (roll < option.weight) return option.count;
    roll -= option.weight;
  }
  return options[options.length - 1].count;
}

/** A shuffled "draw bag" of connector ids: drawing empties it, and it
 *  only reshuffles once truly empty. This is what keeps right-side
 *  selection from repeating the same outcome over and over — every
 *  connector gets used once before any connector gets used a second
 *  time, while the *order* within each pass through the bag is still
 *  random. */
function createConnectorBag(ids: readonly string[]) {
  let bag: string[] = [];

  function refillIfEmpty() {
    if (bag.length === 0) bag = shuffle(ids);
  }

  return {
    /** Draws up to `count` distinct ids (capped to however many ids
     *  exist in total). Spans a bag refill mid-draw if `count` is
     *  larger than what's currently left in the bag, so a
     *  "full distribution" cycle still returns every id exactly
     *  once rather than looping the bag within a single draw. */
    draw(count: number): string[] {
      const target = Math.min(count, ids.length);
      const picked: string[] = [];
      while (picked.length < target) {
        refillIfEmpty();
        // Guard against an id already picked earlier in *this* draw
        // showing up again immediately after a mid-draw refill.
        const index = bag.findIndex((id) => !picked.includes(id));
        if (index === -1) break;
        picked.push(...bag.splice(index, 1));
      }
      return picked;
    },
  };
}

/** Deterministic pseudo-random value in `[min, max]` derived from a
 *  string id + a salt. Used for each connector's beam duration/delay
 *  so every connector's rhythm differs (no two beams look
 *  synchronized) while staying perfectly stable across re-renders —
 *  unlike `Math.random()`, this never reshuffles a connector's timing
 *  just because some *other* connector's activity toggled and caused
 *  this component to re-render. */
function stableRandom(id: string, salt: number, [min, max]: [number, number]): number {
  let hash = salt;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const fraction = (hash % 10_000) / 10_000;
  return min + fraction * (max - min);
}

interface SweepGeometry {
  /** The lit window's own two endpoints at rest (t=0): a short segment
   *  sitting just before the connector's start, mapped 1:1 onto the
   *  gradient's 0%→100% stops. `animateTransform` below then slides
   *  this whole window along the connector's own direction vector. */
  windowStartX: number;
  windowStartY: number;
  windowEndX: number;
  windowEndY: number;
  /** Translation needed to carry the window from just-before-start to
   *  just-past-end — a pure straight-line translate, since the window
   *  itself is far shorter than the connector and doesn't need to
   *  bend with the curve to read correctly. */
  translateX: number;
  translateY: number;
}

function computeSweepGeometry(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  windowLength: number
): SweepGeometry {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  const unitX = dx / length;
  const unitY = dy / length;

  const windowStartX = x1 - unitX * windowLength;
  const windowStartY = y1 - unitY * windowLength;

  const travel = length + windowLength;

  return {
    windowStartX,
    windowStartY,
    windowEndX: x1,
    windowEndY: y1,
    translateX: unitX * travel,
    translateY: unitY * travel,
  };
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
 * `id` (`connector-left-<node id>` / `connector-right-<node id>`).
 *
 * On top of that static geometry, each connector renders exactly one
 * more element: its travelling light beam, drawn with a gradient
 * stroke whose *position* (not its stop values) is animated via
 * `animateTransform`. That transform runs continuously for every
 * connector regardless of activity — it's cheap for a handful of SVG
 * elements — and only the beam's *opacity* is toggled per connector
 * (see the scheduling effect below), so a beam becoming "active"
 * never restarts or resyncs its motion, it simply fades into view
 * already mid-travel and fades back out, with no visible reset.
 *
 * Left-side connectors travel card → core (into the orb); right-side
 * connectors travel core → card (out of the orb) — `isRightSide`
 * below just swaps the `animateTransform`'s `from`/`to`, so the
 * business story (capabilities in, outcomes out) reads correctly even
 * though left/right beams are still scheduled completely
 * independently of each other and of the orb's own internal
 * animation (see the scheduling effect below).
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
          x1,
          y1,
          x2,
          y2,
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
          x1,
          y1,
          x2,
          y2,
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

  // Which connectors currently show a beam. Mirrored into a ref so the
  // scheduling effect below can always read the *current* set inside
  // timeout callbacks (closures over `activeIds` state would otherwise
  // see a stale snapshot from whenever that timeout was scheduled).
  const [activeIds, setActiveIds] = useState<ReadonlySet<string>>(new Set());
  const activeIdsRef = useRef<Set<string>>(new Set());

  function activateSweep(id: string) {
    const next = new Set(activeIdsRef.current);
    next.add(id);
    activeIdsRef.current = next;
    setActiveIds(next);
  }

  function deactivateSweep(id: string) {
    const next = new Set(activeIdsRef.current);
    next.delete(id);
    activeIdsRef.current = next;
    setActiveIds(next);
  }

  // Left- and right-side connectors are scheduled through two
  // deliberately different systems — this is the "into the orb, out to
  // a card" story carried by *scheduling*, not just by beam direction
  // (see `isRightSide` above):
  //
  //   - Left side: each connector runs its own independent idle/active
  //     cycle on a randomized timer — not a single shared "swap the
  //     active set every N seconds" clock — so activity reads as
  //     organic rather than metronomic. A shared cap
  //     (MAX_ACTIVE_LEFT_SWEEPS) keeps at most a couple lit at once
  //     regardless of how many left connectors exist.
  //
  //   - Right side: NOT independent per-connector cycles. A single
  //     "intelligent routing" clock (`runRightRoutingCycle`) picks how
  //     many outcomes light up together each cycle (weighted via
  //     `RIGHT_PATTERN_WEIGHTS` — single-outcome cycles dominate, full
  //     distribution is rare), draws that many distinct connector ids
  //     from a shuffled "draw bag" (so no outcome repeats until every
  //     outcome has had a turn), and staggers each drawn connector's
  //     start by `RIGHT_STAGGER_MS_RANGE` so simultaneous activations
  //     never land on the exact same frame.
  //
  // Nothing here waits on the orb's own internal animation.
  useEffect(() => {
    if (paths.length === 0) return;

    let cancelled = false;
    const timers: number[] = [];

    const leftPaths = paths.filter((path) => path.id.startsWith("connector-left-"));
    const rightPaths = paths.filter((path) => path.id.startsWith("connector-right-"));

    function countActive(prefix: string): number {
      let count = 0;
      activeIdsRef.current.forEach((id) => {
        if (id.startsWith(prefix)) count += 1;
      });
      return count;
    }

    // ---- Left side: independent per-connector idle/active cycling ----

    function scheduleLeftCycle(id: string) {
      timers.push(window.setTimeout(() => attemptActivateLeft(id), randomBetween(SWEEP_REST_MS)));
    }

    function attemptActivateLeft(id: string) {
      if (cancelled) return;

      if (countActive("connector-left-") >= MAX_ACTIVE_LEFT_SWEEPS) {
        // Cap's full — this connector just checks back shortly rather
        // than losing its turn entirely.
        timers.push(window.setTimeout(() => attemptActivateLeft(id), randomBetween(SWEEP_RETRY_MS)));
        return;
      }

      activateSweep(id);
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          deactivateSweep(id);
          scheduleLeftCycle(id);
        }, randomBetween(SWEEP_ACTIVE_MS))
      );
    }

    leftPaths.forEach((path, index) => {
      // Staggered initial kick-off so connectors don't all attempt to
      // light up in the same tick on mount, and a couple are already
      // lit shortly after load rather than everything starting dark.
      const initialDelay = randomBetween([0, 900]) + index * 120;
      timers.push(window.setTimeout(() => attemptActivateLeft(path.id), initialDelay));
    });

    // ---- Right side: weighted routing cycle ----

    if (rightPaths.length > 0) {
      const rightBag = createConnectorBag(rightPaths.map((path) => path.id));

      function runRightRoutingCycle() {
        if (cancelled) return;

        const picked = pickWeighted(RIGHT_PATTERN_WEIGHTS);
        const patternCount = Number.isFinite(picked) ? picked : rightPaths.length;
        const drawnIds = rightBag.draw(patternCount);

        let cycleSpan = 0;

        drawnIds.forEach((id, index) => {
          // First connector in a cycle starts almost immediately;
          // additional connectors in the same cycle are jittered
          // relative to it so a dual/triple/full activation never
          // reads as a single synchronized flash.
          const startDelay = index === 0 ? 0 : randomBetween(RIGHT_STAGGER_MS_RANGE) * index;
          const activeDuration = randomBetween(RIGHT_CYCLE_ACTIVE_MS);
          cycleSpan = Math.max(cycleSpan, startDelay + activeDuration);

          timers.push(
            window.setTimeout(() => {
              if (cancelled) return;
              activateSweep(id);
              timers.push(
                window.setTimeout(() => {
                  if (cancelled) return;
                  deactivateSweep(id);
                }, activeDuration)
              );
            }, startDelay)
          );
        });

        // Next cycle isn't picked until this entire cycle's beams have
        // finished and a rest gap has elapsed — keeps the routing feel
        // deliberate rather than overlapping cycle-on-cycle.
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            runRightRoutingCycle();
          }, cycleSpan + randomBetween(RIGHT_CYCLE_REST_MS))
        );
      }

      timers.push(window.setTimeout(runRightRoutingCycle, randomBetween([0, 900])));
    }

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
    // Re-running when `paths` changes (e.g. a responsive re-measure
    // adds/removes a card) restarts every connector's cycle — a minor
    // visual reset on layout change, traded for not having to
    // reconcile timers against a shifting id set.
  }, [paths]);

  return (
    <div ref={rootRef} className={styles.layer} aria-hidden="true">
      <svg className={styles.svg}>
        <defs>
          {paths.map((path) => (
            <linearGradient
              key={`base-${path.id}`}
              id={`base-gradient-${path.id}`}
              gradientUnits="userSpaceOnUse"
              x1={path.x1}
              y1={path.y1}
              x2={path.x2}
              y2={path.y2}
            >
              {/* Layer 1 — Static Connector: grey blending into the
                  background at both ends, purple at the midpoint.
                  Fixed — nothing here is ever animated. */}
              <stop offset="0%" stopColor={`rgba(${BASE_GRADIENT_GREY_RGB}, 0.4)`} />
              <stop offset="50%" stopColor={`rgba(${BASE_GRADIENT_PURPLE_RGB}, 0.55)`} />
              <stop offset="100%" stopColor={`rgba(${BASE_GRADIENT_GREY_RGB}, 0.4)`} />
            </linearGradient>
          ))}
        </defs>

        {paths.map((path) => {
          const isActive = activeIds.has(path.id);
          const isRightSide = path.id.startsWith("connector-right-");
          const windowLength = stableRandom(path.id, 3, SWEEP_WINDOW_PX_RANGE);
          const geometry = computeSweepGeometry(path.x1, path.y1, path.x2, path.y2, windowLength);
          const duration = stableRandom(path.id, 1, SWEEP_DURATION_RANGE_S);
          const delay = stableRandom(path.id, 2, SWEEP_DELAY_RANGE_S);

          const fromVector = "0 0";
          const toVector = `${geometry.translateX} ${geometry.translateY}`;
          // Right-side connectors travel core → card (out of the
          // orb): swapping from/to plays the exact same straight-line
          // translation backwards, so the lit window still starts and
          // ends off-path (invisible) at both extremes either way.
          const animateFrom = isRightSide ? toVector : fromVector;
          const animateTo = isRightSide ? fromVector : toVector;

          return (
            <g key={path.id}>
              {/* Layer 1 — Static Connector. Always present; its
                  grey→purple→grey gradient (defined above) is fixed
                  and never animated. `data-amp-connector`/
                  `data-amp-connector-side` are read-only markers —
                  same DOM-attribute decoupling as `data-amp-node`
                  elsewhere in this section — that let AmpExperience's
                  scroll timeline find and progressively draw this
                  path (via stroke-dasharray/stroke-dashoffset) from
                  the outside, without this component knowing that
                  scroll choreography exists. Layer 2 (the beam,
                  below) is NOT tagged — its own reveal/activation is
                  a separate concern this component already owns
                  independently of scroll. */}
              <path
                d={path.d}
                className={styles.path}
                stroke={`url(#base-gradient-${path.id})`}
                data-amp-connector={path.id}
                data-amp-connector-side={isRightSide ? "right" : "left"}
              />

              {/* Layer 2 — Travelling Light Beam. Not a separate
                  shape: this path is an exact geometric duplicate of
                  Layer 1 (same `d`, same width, same cap, no blur —
                  see the .module.css), stroked with a single-hue
                  purple gradient whose position (not its stop values)
                  is animated via `animateTransform`. Because both
                  paths sit pixel-for-pixel on top of each other, the
                  visible effect is the connector's own stroke
                  tinting purple as the window passes through it, not
                  a distinct object riding over the line. The
                  transform keeps running at all times; only opacity
                  toggles with `data-active`, so a beam fading into
                  view never looks like it "restarted". */}
              <linearGradient
                id={`sweep-gradient-${path.id}`}
                gradientUnits="userSpaceOnUse"
                x1={geometry.windowStartX}
                y1={geometry.windowStartY}
                x2={geometry.windowEndX}
                y2={geometry.windowEndY}
              >
                <stop offset="0%" stopColor={`rgba(${SWEEP_PURPLE_RGB}, 0)`} />
                <stop offset="30%" stopColor={`rgba(${SWEEP_PURPLE_RGB}, 0.45)`} />
                <stop offset="50%" stopColor={`rgba(${SWEEP_PURPLE_RGB}, 1)`} />
                <stop offset="70%" stopColor={`rgba(${SWEEP_PURPLE_RGB}, 0.45)`} />
                <stop offset="100%" stopColor={`rgba(${SWEEP_PURPLE_RGB}, 0)`} />
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  from={animateFrom}
                  to={animateTo}
                  dur={`${duration}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </linearGradient>
              <path
                d={path.d}
                className={styles.sweep}
                data-active={isActive ? "true" : "false"}
                stroke={`url(#sweep-gradient-${path.id})`}
              />
            </g>
          );
        })}
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