// PartnerLogoStrip.tsx
import { LogoShift } from "./LogoShift";
import type { PartnerLogoPair } from "@/data/partners";
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
   *  different rates instead of in lockstep. */
  holdMs?: number;
  /** How long this slot's swap transition itself takes. */
  durationMs?: number;
  /** GSAP ease for this slot's swap. */
  ease?: string;
}

interface PartnerLogoStripProps {
  /** One pair per slot — handed to its own independent LogoShift
   *  instance untouched. However many pairs are provided is how many
   *  slots render; the grid isn't hardcoded to exactly 4. */
  pairs: PartnerLogoPair[];
  /** Optional per-slot timing, indexed 1:1 with `pairs` (slotTimings[i]
   *  applies to pairs[i]). Missing entries, or an omitted array
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
 * lays out one slot per pair and gives each one a LogoShift with a
 * staggered start, exactly the "drop multiple instances side by
 * side, control how many sit in a row" model.
 */
export function PartnerLogoStrip({ pairs, slotTimings }: PartnerLogoStripProps) {
  return (
    <div
      className={styles.strip}
      style={{ gridTemplateColumns: `repeat(${pairs.length}, 1fr)` }}
    >
      {pairs.map((pair, slotIndex) => {
        const timing = slotTimings?.[slotIndex];
        return (
          <div key={pair[0].id} className={styles.slot}>
            <LogoShift
              pair={pair}
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