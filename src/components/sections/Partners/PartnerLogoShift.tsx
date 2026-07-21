"use client";

import { PartnerLogo } from "./PartnerLogo";
import type { PartnerLogoSlot } from "@/data/partners";
import styles from "./PartnerLogoShift.module.css";

interface PartnerLogoShiftProps {
  slot: PartnerLogoSlot;
}

/**
 * PartnerLogoShift
 *
 * The only Client Component in this section. Today it renders just
 * `slot.logos[0]` — no timer, no state, no swap logic. It's a Client
 * Component now, before that logic exists, for the same reason
 * EnvironmentExperience is one ahead of its scroll listener: the
 * future behavior (cycling through `slot.logos` on an interval,
 * staggered by `slot.delay`, each logo fading upward as the next
 * rises in) is inherently client-side — it needs timers and
 * transition state a Server Component can't hold — so drawing the
 * boundary here now means the future work only adds a
 * `useState`/`useEffect` inside this component, not a restructuring
 * of how PartnerLogoStrip passes slots down.
 *
 * This boundary sits at the single-slot level, not lifted up to
 * PartnerLogoStrip or Partners, because each slot's animation is
 * self-contained and staggered independently via `slot.delay` —
 * there's no shared state between slots the way Timeline and Card
 * share `activeStageIndex` in Environment, so there's no reason to
 * push the Client Component boundary any higher than the smallest
 * unit that actually needs it.
 */
export function PartnerLogoShift({ slot }: PartnerLogoShiftProps) {
  const currentLogo = slot.logos[0];

  return (
    <div className={styles.shift}>
      <PartnerLogo logo={currentLogo} />
    </div>
  );
}
