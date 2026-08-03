"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmpColumn } from "./AmpColumn";
import { AmpConnectorLayer } from "./AmpConnectorLayer";
import { AmpCore } from "./AmpCore";
import type { AmpColumnData, AmpHubData } from "@/data/ampTransformation";
import styles from "./AmpExperience.module.css";

gsap.registerPlugin(ScrollTrigger);

interface AmpExperienceProps {
  leftColumn: AmpColumnData;
  hub: AmpHubData;
  rightColumn: AmpColumnData;
}

/**
 * How far the user has to scroll (in px) to move through the entire
 * pinned sequence, start to finish. This is the ONE knob that
 * controls pin duration for the whole Experience — bump it up as
 * future milestones add more reveal work to the timeline, no other
 * changes required. Bumped again for Milestone 7: "connectors" went
 * from a 1-unit empty placeholder to a real ~2.5-unit staggered draw
 * (it reuses the cards' own duration/stagger, see
 * CONNECTOR_DRAW_DURATION/CONNECTOR_PAIR_STAGGER below), so the
 * timeline's total length grew from 7.5 units to 9 — this scales
 * PIN_SCROLL_DISTANCE by the same ratio (5000 * 9/7.5) so scroll
 * speed through the rest of the sequence doesn't change.
 */
const PIN_SCROLL_DISTANCE = 6000;

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
const LOGO_END_OPACITY = 0.9;

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

/** How far apart (in timeline time) consecutive pairs' reveals start.
 *  Smaller than CARD_REVEAL_DURATION on purpose, per spec ("a slight
 *  overlap between consecutive pairs is acceptable") — each pair
 *  starts before the previous one has fully finished materializing,
 *  which is what makes the reveal read as one continuous "ecosystem
 *  assembling itself" motion rather than four separate, disconnected
 *  reveals. */
const CARD_PAIR_STAGGER = 0.5;

/** Premium, no-bounce ease — matches the logo/orb reveal's feel
 *  rather than introducing a third distinct motion language. */
const CARD_REVEAL_EASE = "power2.out";

// ---------------------------------------------------------------------------
// Milestone 7 tuning — connector path draw-in only. Still the same master
// timeline/ScrollTrigger from Milestone 4; this only fills in the
// "connectors" label, which used to be an empty placeholder. No beams, no
// glow, no activation — those stay owned entirely by AmpConnectorLayer's own
// independent scheduling effect, untouched by this file.
// ---------------------------------------------------------------------------

/** How long (in timeline time) a single left+right connector pair takes
 *  to fully draw. Reuses the cards' own duration/stagger/ease so the
 *  connectors read as a continuation of the same reveal rhythm rather
 *  than a differently-paced phase. */
const CONNECTOR_DRAW_DURATION = CARD_REVEAL_DURATION;

/** How far apart (in timeline time) consecutive connector pairs start
 *  drawing — smaller than CONNECTOR_DRAW_DURATION on purpose, per spec
 *  ("a small overlap between pairs is acceptable"), matching the same
 *  overlapping stagger the cards themselves use. */
const CONNECTOR_PAIR_STAGGER = CARD_PAIR_STAGGER;

const CONNECTOR_DRAW_EASE = CARD_REVEAL_EASE;

/**
 * AmpExperience
 *
 * Milestone 4: this is now the section's Client Component boundary
 * and owns the GSAP + ScrollTrigger pin/timeline described in the
 * section spec's Motion Architecture (System 1). Per that spec's Pin
 * Behaviour — "pin ONLY the Experience" — the trigger/pin target
 * below is this component's own root element, not AmpTransformation's
 * `<section>` and not AmpFooter. AmpHeader and AmpFooter are siblings
 * one level up (see AmpTransformation.tsx) and are untouched by any
 * of this: they scroll normally, before and after the pin.
 *
 * Milestone 4 built the scroll choreography: the master timeline, the
 * ScrollTrigger that pins/scrubs it, and `TIMELINE_PHASES` as named,
 * empty insertion points. Milestone 5 filled in "logo" and "orb".
 * Milestone 6 filled in "cards". Milestone 7 (this pass) fills in
 * "connectors": each card's static connector path draws progressively
 * toward AmpCore, in the same left+right paired stagger the cards
 * themselves used. "network" is still an untouched empty placeholder
 * for a later milestone.
 *
 * What "connectors" animates, and what it deliberately does NOT: only
 * each connector's Layer-1 static path (found via
 * `[data-amp-connector-side]`, scoped inside the connector layer, the
 * same DOM-attribute decoupling this file already uses for
 * `data-amp-core`/`data-amp-orb`/`data-amp-node`), and only its
 * `strokeDashoffset` — sliding from the path's own measured length
 * (fully undrawn) down to 0 (fully drawn). No beam, no glow, no
 * network-activation logic of any kind is touched here: those are
 * AmpConnectorLayer's Layer 2 and its own independent scheduling
 * effect, which this milestone doesn't select, reference, or gate in
 * any way — they simply keep running exactly as AmpConnectorLayer.tsx
 * already has them wired, on their own timers, unrelated to scroll.
 * Every connector's path data already runs card → core (see
 * `buildCurve` in AmpConnectorLayer.tsx), so a plain downward
 * dashoffset tween is what keeps the draw direction "from the card
 * toward the center, never the reverse" without this file needing to
 * know or care which side a given path belongs to.
 *
 * What "cards" animates: AmpColumn/AmpNode are Server Components with
 * no knowledge of any of this — every left/right AmpNode is found
 * purely via `[data-amp-node]`, scoped inside `leftSlotRef`/
 * `rightSlotRef` so left and right nodes are never mixed up, the same
 * DOM-attribute decoupling `data-amp-core`/`data-amp-orb` already use
 * elsewhere in this file. Cards don't slide in — each one animates
 * opacity/scale/blur/y together so it reads as materializing out of
 * nothing, per spec. Left/right cards at the same index reveal as a
 * pair (`CARD_PAIR_STAGGER` apart, `CARD_REVEAL_DURATION` long, with
 * a deliberate overlap between consecutive pairs), and each column's
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
 * `experience.firstElementChild` rather than a new ref, since it's
 * rendered by a component this file doesn't own (see the effect
 * below for why, and the caveat on that approach).
 */
export function AmpExperience({ leftColumn, hub, rightColumn }: AmpExperienceProps) {
  const experienceRef = useRef<HTMLDivElement>(null);
  const leftSlotRef = useRef<HTMLDivElement>(null);
  const rightSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const experience = experienceRef.current;
    if (!experience) return;

    // `.circle` (the logo) and NetworkOrb's `.wrapper` are both found
    // via DOM attribute, not props/refs threaded through AmpCore —
    // same decoupling AmpConnectorLayer already relies on for
    // `data-amp-core` (see AmpCore.tsx). `data-amp-orb` is Milestone
    // 5's equivalent, added to NetworkOrb's own root.
    const logoEl = experience.querySelector<HTMLElement>("[data-amp-core]");
    const orbEl = experience.querySelector<HTMLElement>("[data-amp-orb]");

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
    // always the first child rendered into `.experience` (see the
    // JSX below). This is intentionally the same "arbitrary JSX
    // order" this component's original doc comment already called
    // out — it was harmless for layout since the layer is positioned
    // out of flow, but it's now also load-bearing for this selector.
    // If AmpConnectorLayer's JSX position ever moves, or it gains a
    // `data-amp-connector-layer` attribute, prefer that instead.
    const connectorLayer = experience.firstElementChild as HTMLElement | null;

    // Milestone 7: each connector's own STATIC path (Layer 1 only —
    // never the travelling-beam path, which AmpConnectorLayer tags
    // with no `data-amp-connector*` attribute on purpose), found via
    // `data-amp-connector-side` scoped inside the connector layer.
    // DOM order here matches the order AmpConnectorLayer rendered
    // `paths` in, i.e. left-node order then right-node order (see
    // AmpConnectorLayer.tsx) — the same index-pairing assumption the
    // "cards" phase above already relies on for its own nodes.
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

    if (!logoEl || !orbEl) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: experience,
          start: "top 25%",
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
        [orbEl, connectorLayer, ...leftNodes, ...rightNodes, leftLabelEl, rightLabelEl].filter(
          Boolean
        ),
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

      // ---- "cards": once the logo/orb transition finishes, the left
      // and right columns materialize in index-paired stagger (L1+R1,
      // then L2+R2, ...), each column's side label riding along with
      // that column's first card only ----
      tl.addLabel("cards");

      const cardPairCount = Math.max(leftNodes.length, rightNodes.length);
      for (let pairIndex = 0; pairIndex < cardPairCount; pairIndex++) {
        const position =
          pairIndex === 0 ? "cards" : `cards+=${pairIndex * CARD_PAIR_STAGGER}`;

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
      }

      // ---- "connectors": once every card has appeared, each card's
      // path draws progressively toward AmpCore — never the reverse
      // — in the same left+right, index-paired stagger the cards
      // themselves used. No fade, no beam, no glow: the ONLY thing
      // animated is `strokeDashoffset` sliding from the path's full
      // length (invisible) down to 0 (fully drawn); every path's `d`
      // already runs card → core (see buildCurve/AmpConnectorLayer.tsx),
      // so animating dashoffset downward naturally draws in that same
      // direction and can't visually run center-outward. ----
      tl.addLabel("connectors");

      // The whole connector layer was hidden via opacity in the
      // initial `.set()` above; per spec connectors reveal by
      // drawing, not fading, so this is a one-time, non-animated
      // switch back to visible — happening at the very start of this
      // phase, instantaneous, not a tween — after which each path's
      // own dashoffset is what makes it actually appear on screen.
      if (connectorLayer) {
        tl.set(connectorLayer, { opacity: 1 }, "connectors");
      }

      const connectorPairCount = Math.max(leftConnectorPaths.length, rightConnectorPaths.length);
      for (let pairIndex = 0; pairIndex < connectorPairCount; pairIndex++) {
        const position =
          pairIndex === 0 ? "connectors" : `connectors+=${pairIndex * CONNECTOR_PAIR_STAGGER}`;

        const pairPaths = [leftConnectorPaths[pairIndex], rightConnectorPaths[pairIndex]].filter(
          Boolean
        );
        if (pairPaths.length > 0) {
          tl.to(
            pairPaths,
            {
              strokeDashoffset: 0,
              duration: CONNECTOR_DRAW_DURATION,
              ease: CONNECTOR_DRAW_EASE,
            },
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

    return () => ctx.revert();
  }, []);

  return (
    <div ref={experienceRef} className={styles.experience}>
      <AmpConnectorLayer />

      <div ref={leftSlotRef} className={styles.leftSlot}>
        <AmpColumn column={leftColumn} side="left" />
      </div>

      <AmpCore hub={hub} />

      <div ref={rightSlotRef} className={styles.rightSlot}>
        <AmpColumn column={rightColumn} side="right" />
      </div>
    </div>
  );
}