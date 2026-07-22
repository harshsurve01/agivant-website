// PartnerLogoStrip.tsx
import { LogoShift } from "./LogoShift";
import type { PartnerLogoPair } from "@/data/partners";
import styles from "./PartnerLogoStrip.module.css";

interface PartnerLogoStripProps {
  /** One pair per slot — handed to its own independent LogoShift
   *  instance untouched. However many pairs are provided is how many
   *  slots render; the grid isn't hardcoded to exactly 4. */
  pairs: PartnerLogoPair[];
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
export function PartnerLogoStrip({ pairs }: PartnerLogoStripProps) {
  return (
    <div
      className={styles.strip}
      style={{ gridTemplateColumns: `repeat(${pairs.length}, 1fr)` }}
    >
      {pairs.map((pair, slotIndex) => (
        <div key={pair[0].id} className={styles.slot}>
          <LogoShift pair={pair} initialDelayMs={slotIndex * STAGGER_MS} />
        </div>
      ))}
    </div>
  );
}