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
 * changes required. Currently a placeholder: there's no animation
 * content yet, so the number itself is arbitrary, it just needs to
 * be "long enough" to prove the pin/unpin lifecycle out.
 */
const PIN_SCROLL_DISTANCE = 4000;

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
 *  for each phase above until it has real tweens of its own. Still
 *  used below for "cards"/"connectors"/"network" — Milestone 5 only
 *  replaces the "logo" and "orb" placeholders with real tweens. */
const PLACEHOLDER_PHASE_DURATION = 1;

// ---------------------------------------------------------------------------
// Milestone 5 tuning — logo shrink + orb reveal only. Nothing below this
// point creates a new ScrollTrigger or timeline; it all inserts into the
// master timeline built further down, at the "logo" and "orb" labels
// reserved in Milestone 4.
// ---------------------------------------------------------------------------

/** The logo's starting size, as a fraction of viewport width — "bold
 *  and dominant," per spec. Its FINAL size is deliberately not a
 *  constant here: it's however big `.circle` already renders per
 *  AmpCore.module.css, so this milestone never hardcodes or
 *  duplicates that value, it only scales relative to it (see
 *  `logoStartScale` below). */
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
const LOGO_SHRINK_DURATION = 2;

/** The orb's starting size, as a fraction of viewport width — "already
 *  proportional to the current logo size" at the moment it appears.
 *  Its FINAL size, like the logo's, is never hardcoded: it's whatever
 *  `.wrapper` already renders at (i.e. fills `.core`, per AmpCore's
 *  existing sizing) — this only scales relative to that. */
const ORB_INITIAL_VW = 0.25;

/** How far into the logo's shrink (in timeline time, relative to the
 *  "logo" label) the orb begins fading in. Spec: "when the logo
 *  reaches approximately 55vw, the orb begins to appear" — rather
 *  than trying to compute the exact scroll position where the logo's
 *  rendered width crosses 55vw, this places the overlap at a fixed
 *  point along the shrink's own timeline (55% of the way through),
 *  which reads the same way and stays simple/scrub-safe. */
const ORB_START_OFFSET = LOGO_SHRINK_DURATION * 0.25;

/** Sized so the orb's reveal ends at the exact same timeline moment
 *  the logo's shrink does — "both finish together," per spec. */
const ORB_REVEAL_DURATION = LOGO_SHRINK_DURATION - ORB_START_OFFSET;

/** Shared ease for both tweens — smooth accel/decel, no bounce, no
 *  sudden snap in either direction. "Premium and deliberate," per
 *  spec, for the logo; reused for the orb so the two reveals feel
 *  like one continuous motion rather than two differently-paced ones. */
const REVEAL_EASE = "power1.inOut";

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
 * empty insertion points. Milestone 5 fills in exactly two of those —
 * "logo" and "orb" — with real tweens. "cards", "connectors", and
 * "network" are still untouched empty placeholders; those stay for
 * later milestones to fill in, same as before.
 *
 * What's animated now: the logo starts oversized (~70vw) and shrinks
 * to its natural `.circle` size with a barely-there opacity fade; the
 * Network Orb starts hidden, then fades/scales in from ~55vw partway
 * through the logo's shrink (an intentional overlap — see
 * `ORB_START_OFFSET`), finishing at the same moment the logo does.
 * The orb's own continuous rotation is untouched by any of this — it
 * was already time-driven and running regardless of scroll or
 * opacity (see NetworkOrb.tsx), so nothing here needs to start,
 * stop, or otherwise coordinate with it.
 *
 * Cards and the connector layer are still explicitly NOT revealed —
 * they're hidden via a single one-time `.set()` at the very start of
 * the timeline (not an animated reveal, just the correct "nothing but
 * the logo is visible yet" initial state) and stay that way until
 * their own future milestones take over.
 *
 * Still one timeline, one ScrollTrigger — Milestone 5 only inserts
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
      // own fromTo below re-affirms opacity 0 at the "orb" label, but
      // needs this too — otherwise it would sit at its CSS default
      // (visible) for the stretch between pin-start and the "orb"
      // label. Cards and the connector layer have no reveal tween at
      // all yet, so without this they'd simply never be hidden.
      tl.set([orbEl, leftSlotRef.current, rightSlotRef.current, connectorLayer].filter(Boolean), {
        opacity: 0,
      }, 0);

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

      // "cards", "connectors", "network" — still Milestone 4's empty
      // placeholders, untouched by this milestone.
      const remainingPhases = TIMELINE_PHASES.filter(
        (phase) => phase !== "logo" && phase !== "orb"
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