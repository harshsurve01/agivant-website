// PartnerLogoStrip.tsx
import { LogoShift } from "./LogoShift";
import type { PartnerLogo } from "@/data/partners";
import styles from "./PartnerLogoStrip.module.css";

/**
 * Per-slot timer override. All fields are optional and fall back to
 * LogoShift's own defaults (holdMs: 2500, durationMs: 600, ease:
 * "power3.out") when omitted — so passing no `slotTimings` at all
 * reproduces the previous "every slot shares one cadence" behavior
 * exactly.
 */
export interface PartnerLogoSlotTiming {
  /** How long this slot's resting logo stays visible before it
   *  starts its next shift. This is the "dedicated timer" per slot —
   *  set a different holdMs per index to make slots shift at
   *  different rates instead of in lockstep. Pass an array instead
   *  of a single number to give individual logos *within* this
   *  slot's own sequence different hold times (indexed 1:1 with that
   *  slot's logos) — e.g. a slot with 3 logos where one should
   *  linger longer than the other two. */
  holdMs?: number | number[];
  /** How long this slot's swap transition itself takes. */
  durationMs?: number;
  /** GSAP ease for this slot's swap. */
  ease?: string;
}

interface PartnerLogoStripProps {
  /** One entry per slot, handed to its own independent LogoShift
   *  instance untouched. Each entry is that slot's own logo
   *  sequence — historically always exactly 2 logos (a "pair"), but
   *  LogoShift cycles through however many logos it's given, so a
   *  slot can hold 2, 3, or more without any change here. However
   *  many entries are provided is how many slots render; the grid
   *  isn't hardcoded to exactly 4. */
  slots: PartnerLogo[][];
  /** Optional per-slot timing, indexed 1:1 with `slots` (slotTimings[i]
   *  applies to slots[i]). Missing entries, or an omitted array
   *  entirely, fall back to the shared defaults below — so this is
   *  purely additive and safe to leave unset. Each entry is *that
   *  slot's own* timer: once its initial stagger delay has fired, a
   *  slot with holdMs: 6000 keeps shifting every 6s indefinitely,
   *  completely independent of every other slot's cadence. */
  slotTimings?: PartnerLogoSlotTiming[];
}

// 120ms between each slot's first transition (0ms, 120ms, 240ms,
// 360ms, ...) — the entire wave mechanism. Every cycle after the
// first is each LogoShift's own concern; this component doesn't
// coordinate anything beyond this one initial offset per slot.
const STAGGER_MS = 120;

/**
 * PartnerLogoStrip
 *
 * Server Component. The card itself — background, radius, padding,
 * the column grid, and the divider between slots — never moves and
 * never re-renders once mounted. No "use client", no hooks, no
 * shared timeline, no marquee/carousel/scroll of any kind: it just
 * lays out one slot per sequence and gives each one a LogoShift with
 * a staggered start, exactly the "drop multiple instances side by
 * side, control how many sit in a row, and how many logos each one
 * holds" model.
 */
export function PartnerLogoStrip({ slots, slotTimings }: PartnerLogoStripProps) {
  return (
    <div
      className={styles.strip}
      style={{ gridTemplateColumns: `repeat(${slots.length}, 1fr)` }}
    >
      {slots.map((logos, slotIndex) => {
        const timing = slotTimings?.[slotIndex];
        return (
          <div key={logos[0].id} className={styles.slot}>
            <LogoShift
              logos={logos}
              initialDelayMs={slotIndex * STAGGER_MS}
              holdMs={timing?.holdMs}
              durationMs={timing?.durationMs}
              ease={timing?.ease}
            />
          </div>
        );
      })}
    </div>
  );
}