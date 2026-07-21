"use client";

import { SpotlightContainer } from "./SpotlightContainer";
import type { CaseStudy } from "@/data/proof";
import styles from "./SpotlightExperience.module.css";

interface SpotlightExperienceProps {
  caseStudies: CaseStudy[];
}

/**
 * SpotlightExperience
 *
 * The only Client Component in this section. Today it renders no
 * state at all — no `hoveredCard`, no timers, no transitions — it
 * just passes `caseStudies` straight through to SpotlightContainer.
 * It's a Client Component now, before that state exists, for the
 * same reason PartnerLogoShift is: the future behavior (hovering any
 * card expands it to fill the container while the other two animate
 * out, then everything returns on mouse-leave) is inherently
 * client-side — it needs `useState` for which card is active and
 * `useEffect`/GSAP for the transition, neither of which a Server
 * Component can hold. Drawing the boundary here now means Phase 4
 * only adds state inside this component; SpotlightContainer and
 * SpotlightCard already take everything they need as props, so
 * nothing below this line needs to be restructured when the hover
 * behavior lands.
 *
 * Per the architecture note: do not couple this today to useState or
 * useEffect. Nothing below implements them yet — the future animation
 * may end up using CSS, GSAP, or requestAnimationFrame, chosen later.
 * Today's job is only to prepare this component as the client
 * boundary, not to implement anything inside it.
 */
export function SpotlightExperience({ caseStudies }: SpotlightExperienceProps) {
  return (
    <div className={styles.experience}>
      <SpotlightContainer caseStudies={caseStudies} />
    </div>
  );
}
