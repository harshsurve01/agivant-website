import { PartnerLogoShift } from "./PartnerLogoShift";
import type { PartnerLogoSlot } from "@/data/partners";
import styles from "./PartnerLogoStrip.module.css";

interface PartnerLogoStripProps {
  slots: PartnerLogoSlot[];
}

/**
 * PartnerLogoStrip
 *
 * Owns the strip's layout: one continuous surface holding all logo
 * slots side by side with subtle separators between them — not four
 * separate cards. Equal-width grid columns (not a flex row with
 * gaps) keep every slot's alignment and separator spacing identical
 * regardless of each logo's natural width, matching the Figma note:
 * "maintain equal logo alignment, equal spacing, centered logos...
 * do not create card-like spacing."
 *
 * No animation lives here — this component only lays out the slots.
 * Each slot's future fade/rise behavior belongs to PartnerLogoShift.
 *
 * Server-renderable: no "use client", no hooks, no state.
 */
export function PartnerLogoStrip({ slots }: PartnerLogoStripProps) {
  return (
    <div className={styles.strip}>
      {slots.map((slot) => (
        <div key={slot.id} className={styles.slot}>
          <PartnerLogoShift slot={slot} />
        </div>
      ))}
    </div>
  );
}
