"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmpColumn } from "./AmpColumn";
import { AmpConnectorLayer } from "./AmpConnectorLayer";
import { AmpCore } from "./AmpCore";
import { AmpHeader } from "./AmpHeader";
import type { AmpColumnData, AmpHeaderData, AmpHubData } from "@/data/ampTransformation";
import styles from "./AmpExperience.module.css";

gsap.registerPlugin(ScrollTrigger);

interface AmpExperienceProps {
  header: AmpHeaderData;
  leftColumn: AmpColumnData;
  hub: AmpHubData;
  rightColumn: AmpColumnData;
}

/**
 * How far the user has to scroll (in px) to move through the entire
 * pinned sequence, start to finish. This is the ONE knob that
 * controls pin duration for the whole Experience — bump it up as
 * future milestones add more reveal work to the timeline, no other
 * changes required.
 *
 * NOTE: Milestone 7 originally gave "connectors" its own standalone
 * ~2.5-unit phase after "cards", and this constant was scaled up
 * (5000 * 9/7.5) to match. Connectors are now merged into the
 * "cards" phase instead — each pair's line/dot shares its card's own
 * duration rather than adding a separate stretch afterward — so the
 * timeline's total length shrank back down and this value is likely
 * due for re-tuning (the sequence will now play out faster per pixel
 * scrolled than it did before the merge) once the new pacing has
 * been scrubbed through.
 */
const PIN_SCROLL_DISTANCE = 1000;

/**
 * The five reveal phases this section will eventually choreograph,
 * in playback order. Milestone 4 only stakes out label positions for
 * these — it does not animate anything. Each label gets an equal
 * (placeholder) slice of the timeline via a same-length empty tween,
 * so scroll progress is evenly distributed across phases from day
 * one. Future milestones replace a phase's placeholder tween with
 * real work (e.g. `tl.to(logoRef.current, {...}, "logo")`) — the
 * label stays put, so nothing about the ScrollTrigger/pin setup has
 * to change when that happens.
 */
const TIMELINE_PHASES = ["logo", "orb", "cards", "connectors", "network"] as const;

/** Placeholder duration (in GSAP's unitless timeline time) reserved
 *  for each phase above until it has real tweens of its own. Only
 *  "network" still uses this — Milestone 5 replaced "logo"/"orb",
 *  Milestone 6 replaced "cards", and Milestone 7 (below) replaces
 *  "connectors". */
const PLACEHOLDER_PHASE_DURATION = 1;

// ---------------------------------------------------------------------------
// Milestone 5 tuning — logo shrink + orb reveal only. Nothing below this
// point creates a new ScrollTrigger or timeline; it all inserts into the
// master timeline built further down, at the "logo" and "orb" labels
// reserved in Milestone 4.
// ---------------------------------------------------------------------------

/** The logo's starting size, as a fraction of viewport width. Its
 *  FINAL size is deliberately not a constant here: it's however big
 *  `.circle` already renders per AmpCore.module.css, so this
 *  milestone never hardcodes or duplicates that value, it only
 *  scales relative to it (see `logoStartScale` below). */
const LOGO_INITIAL_VW = 0.3;

/** End-of-shrink opacity — "almost imperceptible," 100% -> ~90%. */
const LOGO_END_OPACITY = 1;

/** How long (in the timeline's unitless time) the logo's shrink+fade
 *  takes. This replaces the "logo" phase's old 1-unit placeholder —
 *  it's now 2 units to give the shrink room to read as smooth rather
 *  than abrupt, and because the orb's reveal (below) overlaps the
 *  back half of it rather than following it, the "logo" + "orb"
 *  phases together still span the same 2 timeline units the two
 *  placeholders used to occupy — PIN_SCROLL_DISTANCE didn't need to
 *  change. */
const LOGO_SHRINK_DURATION = 3;

/** The orb's starting size, as a fraction of viewport width. Its
 *  FINAL size, like the logo's, is never hardcoded: it's whatever
 *  `.wrapper` already renders at (i.e. fills `.core`, per AmpCore's
 *  existing sizing) — this only scales relative to that. */
const ORB_INITIAL_VW = 0.3;

/** How far into the logo's shrink (in timeline time, relative to the
 *  "logo" label) the orb begins fading in. Spec: "when the logo
 *  reaches approximately 55vw, the orb begins to appear" — rather
 *  than trying to compute the exact scroll position where the logo's
 *  rendered width crosses 55vw, this places the overlap at a fixed
 *  point along the shrink's own timeline (55% of the way through),
 *  which reads the same way and stays simple/scrub-safe. */
const ORB_START_OFFSET = LOGO_SHRINK_DURATION * 0.55;

/** Sized so the orb's reveal ends at the exact same timeline moment
 *  the logo's shrink does — "both finish together," per spec. */
const ORB_REVEAL_DURATION = LOGO_SHRINK_DURATION - ORB_START_OFFSET;

/** Shared ease for both tweens — smooth accel/decel, no bounce, no
 *  sudden snap in either direction. "Premium and deliberate," per
 *  spec, for the logo; reused for the orb so the two reveals feel
 *  like one continuous motion rather than two differently-paced ones. */
const REVEAL_EASE = "power1.inOut";

// ---------------------------------------------------------------------------
// Milestone 6 tuning — left/right column card + side-label reveal only.
// Still the same master timeline/ScrollTrigger from Milestone 4; this only
// fills in the "cards" label, which used to be an empty placeholder. Nothing
// here touches the "logo"/"orb" tweens above, AmpCore, NetworkOrb, or the
// connector layer.
// ---------------------------------------------------------------------------

/** Cards "materialize" rather than slide in, so every card animates
 *  FROM this slightly-too-big, blurred, drifted-up state TO its
 *  resting state (opacity 1 / scale 1 / blur 0 / y 0). Values per
 *  spec: scale ~1.1, blur ~12px, translateY ~-10px. */
const CARD_INITIAL_SCALE = 1.1;
const CARD_INITIAL_BLUR_PX = 12;
const CARD_INITIAL_Y_PX = -10;

/** How long (in timeline time) a single left+right card pair takes to
 *  fully materialize. */
const CARD_REVEAL_DURATION = 1;

/** Formerly the gap (in timeline time) between consecutive pairs'
 *  reveal starts. All pairs now share the same "cards" start position
 *  (see the reveal loop below) so every node/connector/label appears
 *  in one simultaneous motion instead of one pair at a time — this is
 *  kept only in case per-pair staggering is reintroduced later. */
const CARD_PAIR_STAGGER = 0.5;

/** Premium, no-bounce ease — matches the logo/orb reveal's feel
 *  rather than introducing a third distinct motion language. */
const CARD_REVEAL_EASE = "power2.out";

// ---------------------------------------------------------------------------
// Milestone 7 tuning — connector path draw-in + joint dot reveal, synced to
// each card pair. Still the same master timeline/ScrollTrigger from
// Milestone 4; this only fills in the "cards" label's per-pair tweens with
// the connector/dot work alongside the card work already there. No separate
// "connectors" phase or timing constants of its own anymore — a pair's line
// and dot always share the exact same position/duration/ease as that pair's
// card (CARD_REVEAL_DURATION/CARD_PAIR_STAGGER/CARD_REVEAL_EASE, above), by
// design, since they're meant to read as one motion, not a followed-up one.
// No beams, no glow, no activation — those stay owned entirely by
// AmpConnectorLayer's own independent scheduling effect, untouched by this
// file.
// ---------------------------------------------------------------------------

/**
 * AmpExperience
 *
 * Milestone 4: this is now the section's Client Component boundary
 * and owns the GSAP + ScrollTrigger pin/timeline described in the
 * section spec's Motion Architecture (System 1). The trigger/pin
 * target below is this component's own root element, not
 * AmpTransformation's `<section>` and not AmpFooter.
 *
 * Milestone 8: AmpHeader now renders INSIDE this root, above the
 * three-column grid, rather than staying a normal-scrolling sibling
 * up in AmpTransformation.tsx — per an updated Pin Behaviour
 * requirement ("pin the header together with AmpCore"), the header
 * needs to be part of the actual pinned/scrubbed element to stay
 * onscreen with AmpCore for the whole pinned sequence instead of
 * scrolling away before it starts. AmpFooter is still a sibling one
 * level up (see AmpTransformation.tsx) and is untouched by any of
 * this: it scrolls normally, after the pin.
 *
 * Milestone 4 built the scroll choreography: the master timeline, the
 * ScrollTrigger that pins/scrubs it, and `TIMELINE_PHASES` as named,
 * empty insertion points. Milestone 5 filled in "logo" and "orb".
 * Milestone 6 filled in "cards". Milestone 7 originally filled in a
 * separate "connectors" phase that ran after every card had already
 * appeared; that phase has since been folded into "cards" itself, so
 * that a given left/right pair's card, its connector line, and its
 * joint dot all reveal together rather than lines following once
 * every card is already on screen. "network" is still an untouched
 * empty placeholder for a later milestone.
 *
 * What the connector work inside "cards" animates, and what it
 * deliberately does NOT: only each connector's Layer-1 static path
 * (found via `[data-amp-connector-side]`) and its joint dot (found
 * via `[data-amp-connector-dot]`) — both scoped inside the connector
 * layer, the same DOM-attribute decoupling this file already uses for
 * `data-amp-core`/`data-amp-orb`/`data-amp-node`. The path's only
 * animated property is `strokeDashoffset`, sliding from the path's
 * own measured length (fully undrawn) down to 0 (fully drawn); the
 * dot is a plain opacity fade. No beam, no glow, no network-activation
 * logic of any kind is touched here: those are AmpConnectorLayer's
 * Layer 2 and its own independent scheduling effect, which this file
 * doesn't select, reference, or gate in any way — they simply keep
 * running exactly as AmpConnectorLayer.tsx already has them wired, on
 * their own timers, unrelated to scroll. Every connector's path data
 * already runs card → core (see `buildCurve` in AmpConnectorLayer.tsx),
 * so a plain downward dashoffset tween is what keeps the draw
 * direction "from the card toward the center, never the reverse"
 * without this file needing to know or care which side a given path
 * belongs to.
 *
 * What "cards" animates: AmpColumn/AmpNode are Server Components with
 * no knowledge of any of this — every left/right AmpNode is found
 * purely via `[data-amp-node]`, scoped inside `leftSlotRef`/
 * `rightSlotRef` so left and right nodes are never mixed up, the same
 * DOM-attribute decoupling `data-amp-core`/`data-amp-orb` already use
 * elsewhere in this file. Cards don't slide in — each one animates
 * opacity/scale/blur/y together so it reads as materializing out of
 * nothing, per spec. Every left/right pair now shares the same
 * "cards" start position (`CARD_REVEAL_DURATION` long) rather than
 * staggering by index, so all pairs materialize together in one
 * simultaneous motion instead of one at a time, and each column's
 * `[data-amp-column-label]` reveals (opacity only, no blur/scale of
 * its own) at the exact same position as that column's FIRST card —
 * it's included directly in that pair's tween call rather than given
 * any label/position of its own, which is what "do not animate them
 * independently" means in practice here.
 *
 * Cards and their side labels are still explicitly hidden — via the
 * same one-time `.set()` at the very start of the timeline that
 * already hid the orb and the connector layer — until their "cards"
 * tweens actually reach them; a GSAP tween only touches a target's
 * style once the scrubbed playhead reaches that tween's own start, so
 * without this they'd sit at their CSS default (fully visible) for
 * the entire "logo"/"orb" stretch.
 *
 * Still one timeline, one ScrollTrigger — Milestone 6 only inserts
 * into what Milestone 4 already created via `gsap.context()`, same
 * mount/unmount lifecycle as before.
 *
 * Structure below (columns / core / connector layer) is functionally
 * unchanged from Milestone 4 — `leftSlot`/`rightSlot` picked up their
 * own refs (so this milestone can hide them without reaching into
 * AmpColumn), and the connector layer is selected via
 * `gridRef.current.firstElementChild` rather than a ref of its own,
 * since it's rendered by a component this file doesn't own (see the
 * effect below for why, and the caveat on that approach). Milestone 8
 * added `gridRef` itself, scoping that lookup to the three-column
 * grid now that AmpHeader — not the connector layer — is
 * `experienceRef`'s first child.
 */
export function AmpExperience({ header, leftColumn, hub, rightColumn }: AmpExperienceProps) {
  const experienceRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const leftSlotRef = useRef<HTMLDivElement>(null);
  const rightSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const experience = experienceRef.current;
    if (!experience) return;

    let cancelled = false;
    let rafId = 0;
    let ctx: gsap.Context | null = null;

    // AmpConnectorLayer measures node/core positions asynchronously —
    // inside a `useLayoutEffect` that schedules a `requestAnimationFrame`
    // and only THEN calls `setPaths(...)` (see AmpConnectorLayer.tsx) —
    // before it renders any real `<path>`/`<circle>` elements into the
    // DOM. This effect used to query `[data-amp-connector-side]` /
    // `[data-amp-connector-dot]` synchronously, once, on mount — which
    // always lost that race: it queried empty NodeLists, silently wired
    // up ZERO reveal tweens for any connector, and then AmpConnectorLayer's
    // first real render landed a frame later with every line and dot at
    // its untouched SVG/CSS default — fully drawn, fully opaque, outside
    // the timeline's control entirely. That's what caused every connector
    // to appear at once regardless of scroll or stagger. `readyToBuild`
    // below is the fix: poll every frame until AmpConnectorLayer has
    // rendered exactly one path per currently-mounted card (0 === 0
    // resolves immediately if there are no cards, so this can never hang
    // waiting on connectors that will never exist), and only then build
    // the timeline — by which point every path/dot this effect needs
    // actually exists to be queried and gated correctly from the start.
    function readyToBuild(): boolean {
      const leftSlot = leftSlotRef.current;
      const rightSlot = rightSlotRef.current;
      const expectedCount =
        (leftSlot?.querySelectorAll("[data-amp-node]").length ?? 0) +
        (rightSlot?.querySelectorAll("[data-amp-node]").length ?? 0);

      const grid = gridRef.current;
      const connectorLayer = (grid?.firstElementChild ?? null) as HTMLElement | null;
      const actualCount = connectorLayer
        ? connectorLayer.querySelectorAll("[data-amp-connector-side]").length
        : 0;

      return actualCount >= expectedCount;
    }

    function waitThenBuild() {
      if (cancelled) return;
      if (!readyToBuild()) {
        rafId = requestAnimationFrame(waitThenBuild);
        return;
      }
      buildTimeline();
    }

    function buildTimeline() {
      // TS doesn't carry the outer `if (!experience) return;` narrowing
      // into this separately-declared nested function — even though
      // `experience` is `const` and genuinely can't have changed, TS
      // treats a named function declaration as callable at any time and
      // re-widens the type back to `HTMLDivElement | null` inside it.
      // Repeating the guard here, in this function's own scope, is what
      // actually narrows it for everything below.
      if (!experience) return;

      // `.circle` (the logo) and NetworkOrb's `.wrapper` are both found
      // via DOM attribute, not props/refs threaded through AmpCore —
      // same decoupling AmpConnectorLayer already relies on for
      // `data-amp-core` (see AmpCore.tsx). `data-amp-orb` is Milestone
      // 5's equivalent, added to NetworkOrb's own root. `data-amp-circle-bg`
      // is Milestone 9's equivalent — the white circle's own background
      // layer, nested inside `.circle` but animated independently of it
      // (see the "orb" tween below).
      const logoEl = experience.querySelector<HTMLElement>("[data-amp-core]");
      const orbEl = experience.querySelector<HTMLElement>("[data-amp-orb]");
      const circleBgEl = experience.querySelector<HTMLElement>("[data-amp-circle-bg]");

      // Milestone 6: every AmpNode and each column's side label, found
      // the same DOM-attribute way — but scoped to `leftSlotRef`/
      // `rightSlotRef` rather than searched for across the whole
      // Experience, since AmpNode/the label attribute don't carry which
      // column they belong to beyond `data-amp-side`, and scoping by
      // slot is simpler and more robust than filtering on that
      // attribute after the fact. Order within each side matches DOM
      // order, i.e. the order AmpColumn rendered `column.cards` in.
      const leftSlot = leftSlotRef.current;
      const rightSlot = rightSlotRef.current;
      const leftNodes = leftSlot
        ? Array.from(leftSlot.querySelectorAll<HTMLElement>("[data-amp-node]"))
        : [];
      const rightNodes = rightSlot
        ? Array.from(rightSlot.querySelectorAll<HTMLElement>("[data-amp-node]"))
        : [];
      const leftLabelEl = leftSlot?.querySelector<HTMLElement>("[data-amp-column-label]") ?? null;
      const rightLabelEl = rightSlot?.querySelector<HTMLElement>("[data-amp-column-label]") ?? null;

      // The connector layer is rendered by a sibling component this
      // file doesn't own and that carries no selectable attribute
      // today, so it's picked up structurally: AmpConnectorLayer is
      // always the first child rendered into `.grid` (see the JSX
      // below). Scoped to `gridRef` rather than `experienceRef` now
      // that AmpHeader also lives inside the pinned root — AmpHeader,
      // not the connector layer, is `experienceRef`'s actual first
      // child. This is intentionally the same "arbitrary JSX order"
      // this component's original doc comment already called out — it
      // was harmless for layout since the layer is positioned out of
      // flow, but it's now also load-bearing for this selector. If
      // AmpConnectorLayer's JSX position ever moves, or it gains a
      // `data-amp-connector-layer` attribute, prefer that instead.
      const grid = gridRef.current;
      const connectorLayer = (grid?.firstElementChild ?? null) as HTMLElement | null;

      // Milestone 7: each connector's own STATIC path (Layer 1 only —
      // never the travelling-beam path, which AmpConnectorLayer tags
      // with no `data-amp-connector*` attribute on purpose), found via
      // `data-amp-connector-side` scoped inside the connector layer.
      // DOM order here matches the order AmpConnectorLayer rendered
      // `paths` in, i.e. left-node order then right-node order (see
      // AmpConnectorLayer.tsx) — the same index-pairing assumption the
      // "cards" phase above already relies on for its own nodes.
      // `readyToBuild` above guarantees these are no longer empty by
      // the time this function runs.
      const leftConnectorPaths = connectorLayer
        ? Array.from(
            connectorLayer.querySelectorAll<SVGPathElement>('[data-amp-connector-side="left"]')
          )
        : [];
      const rightConnectorPaths = connectorLayer
        ? Array.from(
            connectorLayer.querySelectorAll<SVGPathElement>('[data-amp-connector-side="right"]')
          )
        : [];

      // Each connector's joint dot, found via `data-amp-connector-dot`
      // (see AmpConnectorLayer.tsx) — same left/right scoping and same
      // DOM-order-matches-node-order assumption as the paths above, so
      // `leftJointDots[i]`/`rightJointDots[i]` line up with
      // `leftConnectorPaths[i]`/`rightConnectorPaths[i]` and with
      // `leftNodes[i]`/`rightNodes[i]`.
      const leftJointDots = connectorLayer
        ? Array.from(
            connectorLayer.querySelectorAll<SVGCircleElement>('[data-amp-connector-dot="left"]')
          )
        : [];
      const rightJointDots = connectorLayer
        ? Array.from(
            connectorLayer.querySelectorAll<SVGCircleElement>('[data-amp-connector-dot="right"]')
          )
        : [];

      // Each connector's beam WRAPPER group, found via
      // `data-amp-connector-beam` (see AmpConnectorLayer.tsx) — same
      // left/right scoping and same DOM-order assumption as the paths
      // and dots above. Gating this wrapper's opacity (rather than the
      // `.sweep` path's own) is what lets a beam's independent
      // active/inactive schedule keep working after reveal — see the
      // comment in AmpConnectorLayer.tsx for why animating the path's
      // own opacity directly would have broken that.
      const leftBeamGroups = connectorLayer
        ? Array.from(
            connectorLayer.querySelectorAll<SVGGElement>('[data-amp-connector-beam="left"]')
          )
        : [];
      const rightBeamGroups = connectorLayer
        ? Array.from(
            connectorLayer.querySelectorAll<SVGGElement>('[data-amp-connector-beam="right"]')
          )
        : [];

      if (!logoEl || !orbEl) return;

      ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: experience,
          start: "top 15%",
          end: `+=${PIN_SCROLL_DISTANCE}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          // markers: true, // uncomment locally to visualize start/end while tuning PIN_SCROLL_DISTANCE
        },
      });

      // Measured once, right after mount: each element's own natural
      // (i.e. final, CSS-defined) rendered width. Starting scale is
      // derived from these rather than any hardcoded size, so the
      // "final" state this milestone animates TO is always whatever
      // AmpCore.module.css / NetworkOrb.module.css already say it
      // should be — nothing about that is duplicated here.
      const viewportWidth = window.innerWidth;
      const logoNaturalWidth = logoEl.getBoundingClientRect().width;
      const orbNaturalWidth = orbEl.getBoundingClientRect().width;
      const logoStartScale = (viewportWidth * LOGO_INITIAL_VW) / logoNaturalWidth;
      const orbStartScale = (viewportWidth * ORB_INITIAL_VW) / orbNaturalWidth;

      // Initial state, set once (not animated): as soon as the
      // Experience pins, only the logo should be visible. The orb's
      // own fromTo below re-affirms opacity 0 at the "orb" label,
      // every card/label's own fromTo re-affirms opacity 0 again at
      // the "cards" label, and every connector's own fromTo
      // re-affirms its dashoffset at the "connectors" label — but all
      // of them still need it here too, otherwise each would sit at
      // its CSS/SVG default (fully visible/fully drawn) for the
      // stretch between pin-start and its own reveal tween.
      tl.set(
        [
          orbEl,
          circleBgEl,
          connectorLayer,
          ...leftNodes,
          ...rightNodes,
          leftLabelEl,
          rightLabelEl,
          ...leftJointDots,
          ...rightJointDots,
          ...leftBeamGroups,
          ...rightBeamGroups,
        ].filter(Boolean),
        { opacity: 0 },
        0
      );

      // Connector paths don't use opacity to hide (the layer itself
      // already gates that above) — they need to start fully
      // UNDRAWN, per spec ("do not fade them in ... use a true path
      // drawing animation"). `getTotalLength()` is real per-path
      // geometry (curve length varies per connector), measured once
      // here rather than hardcoded, the same "never duplicate a
      // measured value" approach LOGO_INITIAL_VW/ORB_INITIAL_VW's
      // scale math already uses above. Setting BOTH dasharray and
      // dashoffset to that length is what makes the path invisible
      // (a dash exactly as long as the path, fully offset off the
      // start) without touching opacity at all.
      const allConnectorPaths = [...leftConnectorPaths, ...rightConnectorPaths];
      if (allConnectorPaths.length > 0) {
        tl.set(
          allConnectorPaths,
          {
            strokeDasharray: (_i, target) => (target as SVGPathElement).getTotalLength(),
            strokeDashoffset: (_i, target) => (target as SVGPathElement).getTotalLength(),
          },
          0
        );
      }

      // ---- "logo": huge -> natural size, near-imperceptible fade ----
      tl.addLabel("logo").fromTo(
        logoEl,
        { scale: logoStartScale, opacity: 1 },
        { scale: 1, opacity: LOGO_END_OPACITY, duration: LOGO_SHRINK_DURATION, ease: REVEAL_EASE },
        "logo"
      );

      // ---- "orb": fades/shrinks in from behind the logo, starting
      // before the logo tween above finishes — the overlap is
      // intentional (see ORB_START_OFFSET) ----
      tl.addLabel("orb", `logo+=${ORB_START_OFFSET}`).fromTo(
        orbEl,
        { scale: orbStartScale, opacity: 0 },
        { scale: 1, opacity: 1, duration: ORB_REVEAL_DURATION, ease: REVEAL_EASE },
        "orb"
      );

      // The white circle background starts at 0 opacity (see
      // `.circleBackground` in AmpCore.module.css) and fades in
      // gradually in lockstep with the orb — same label, same
      // duration, same ease — so the two "reach full visibility
      // together," per spec. It's a separate `fromTo` (rather than
      // folded into the orb's own call above) because it only needs
      // opacity, not the orb's scale tween; the logo/wordmark sitting
      // on top of it is untouched and stays fully visible throughout.
      if (circleBgEl) {
        tl.fromTo(
          circleBgEl,
          { opacity: 0 },
          { opacity: 1, duration: ORB_REVEAL_DURATION, ease: REVEAL_EASE },
          "orb"
        );
      }

      // ---- "cards": once the logo/orb transition finishes, the left
      // and right columns materialize in index-paired stagger (L1+R1,
      // then L2+R2, ...) — and, in lockstep with each pair, that same
      // pair's connector line draws in toward AmpCore and its joint
      // dot fades in. Card, line, and dot for a given pair all share
      // the same position/duration/ease below, so they start and
      // finish together rather than every card appearing first and
      // every line following afterward as a separate phase. Each
      // column's side label still rides along with that column's
      // first card only. ----
      tl.addLabel("cards");

      // The connector layer's own container was hidden via opacity in
      // the initial `.set()` above; flipped back to visible here, at
      // the very start of this phase, as a one-time non-animated
      // switch — not a tween. Individual lines stay invisible after
      // this via their own strokeDashoffset (still full length, i.e.
      // undrawn), and individual joint dots stay invisible via their
      // own opacity (still 0), until THAT pair's tweens below reach
      // them. So flipping the container visible here doesn't reveal
      // anything by itself — it just stops gating everything at once,
      // handing that job to each pair's own tweens instead.
      if (connectorLayer) {
        tl.set(connectorLayer, { opacity: 1 }, "cards");
      }

      const pairCount = Math.max(
        leftNodes.length,
        rightNodes.length,
        leftConnectorPaths.length,
        rightConnectorPaths.length
      );

      for (let pairIndex = 0; pairIndex < pairCount; pairIndex++) {
        // All pairs share the same "cards" start position (rather than
        // being offset by `pairIndex * CARD_PAIR_STAGGER`) so every
        // node, its connector line, its joint dot, and its label all
        // reveal together in one simultaneous motion instead of one
        // pair at a time.
        const position = "cards";

        const pairNodes = [leftNodes[pairIndex], rightNodes[pairIndex]].filter(Boolean);
        if (pairNodes.length > 0) {
          tl.fromTo(
            pairNodes,
            {
              opacity: 0,
              scale: CARD_INITIAL_SCALE,
              filter: `blur(${CARD_INITIAL_BLUR_PX}px)`,
              y: CARD_INITIAL_Y_PX,
            },
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              y: 0,
              duration: CARD_REVEAL_DURATION,
              ease: CARD_REVEAL_EASE,
            },
            position
          );
        }

        // Side labels are tied to each column's first pair only —
        // no independent label/position of their own, per spec.
        // Opacity-only: unlike the cards, the label never carries its
        // own scale/blur/translateY tween.
        if (pairIndex === 0) {
          const labelsForFirstPair = [leftLabelEl, rightLabelEl].filter(Boolean);
          if (labelsForFirstPair.length > 0) {
            tl.fromTo(
              labelsForFirstPair,
              { opacity: 0 },
              { opacity: 1, duration: CARD_REVEAL_DURATION, ease: CARD_REVEAL_EASE },
              position
            );
          }
        }

        // This pair's connector line draws in at the exact same
        // position/duration/ease as its card, above — never the
        // reverse direction. No fade, no beam, no glow: the ONLY
        // thing animated is `strokeDashoffset` sliding from the
        // path's full length (invisible) down to 0 (fully drawn);
        // every path's `d` already runs card → core (see
        // buildCurve/AmpConnectorLayer.tsx), so animating dashoffset
        // downward naturally draws in that same direction and can't
        // visually run center-outward.
        const pairPaths = [leftConnectorPaths[pairIndex], rightConnectorPaths[pairIndex]].filter(
          Boolean
        );
        if (pairPaths.length > 0) {
          tl.to(
            pairPaths,
            {
              strokeDashoffset: 0,
              duration: CARD_REVEAL_DURATION,
              ease: CARD_REVEAL_EASE,
            },
            position
          );
        }

        // This pair's joint dot — and only this pair's, not the whole
        // layer's worth at once — fades in alongside its card and
        // line, so a dot never appears before its own line has
        // started drawing toward it.
        const pairDots = [leftJointDots[pairIndex], rightJointDots[pairIndex]].filter(Boolean);
        if (pairDots.length > 0) {
          tl.fromTo(
            pairDots,
            { opacity: 0 },
            { opacity: 1, duration: CARD_REVEAL_DURATION, ease: CARD_REVEAL_EASE },
            position
          );
        }

        // This pair's beam wrapper group — same position/duration/
        // ease as everything else in this pair. Only controls whether
        // a beam is ALLOWED to be seen; whether one is actually
        // travelling at any given moment is still entirely
        // AmpConnectorLayer's own independent schedule (data-active),
        // which keeps running underneath this the whole time — so a
        // beam that's due to activate on this connector while its
        // group is still hidden simply stays invisible until this
        // tween opens the group, rather than being skipped or reset.
        const pairBeamGroups = [leftBeamGroups[pairIndex], rightBeamGroups[pairIndex]].filter(
          Boolean
        );
        if (pairBeamGroups.length > 0) {
          tl.fromTo(
            pairBeamGroups,
            { opacity: 0 },
            { opacity: 1, duration: CARD_REVEAL_DURATION, ease: CARD_REVEAL_EASE },
            position
          );
        }
      }

      // "network" — still Milestone 4's empty placeholder, untouched
      // by this milestone.
      const remainingPhases = TIMELINE_PHASES.filter(
        (phase) => phase !== "logo" && phase !== "orb" && phase !== "cards" && phase !== "connectors"
      );
      remainingPhases.forEach((phase) => {
        tl.addLabel(phase).to({}, { duration: PLACEHOLDER_PHASE_DURATION });
      });
      }, experienceRef);
    }

    waitThenBuild();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={experienceRef} className={styles.experience}>
      <div className={styles.headerRow}>
        <AmpHeader heading={header.heading} description={header.description} />
      </div>

      <div ref={gridRef} className={styles.grid}>
        <AmpConnectorLayer />

        <div ref={leftSlotRef} className={styles.leftSlot}>
          <AmpColumn column={leftColumn} side="left" />
        </div>

        <AmpCore hub={hub} />

        <div ref={rightSlotRef} className={styles.rightSlot}>
          <AmpColumn column={rightColumn} side="right" />
        </div>
      </div>
    </div>
  );
}