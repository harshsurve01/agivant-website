import type { AmpHubData } from "@/data/ampTransformation";
import { NetworkOrb } from "./NetworkOrb";
import styles from "./AmpCore.module.css";

interface AmpCoreProps {
  hub: AmpHubData;
}

/**
 * AmpCore
 *
 * The central visual anchor of the Experience — renamed from AmpHub
 * to match the section's new architecture, where this component owns
 * two stacked layers: the Network Orb and the Amp'd wordmark/logo
 * (see the section spec's "AmpCore" breakdown). The orb is now wired
 * in as a static, code-generated globe (`<NetworkOrb />`, Milestone 1
 * — see NetworkOrb.tsx); rotation, glow, and depth shading land in
 * later milestones without needing any further change here.
 *
 * `.core` is sized larger than `.circle` purely to give the orb room
 * to render around the circle (see AmpCore.module.css) — `.circle`
 * itself, and therefore the logo inside it, keeps its exact original
 * size and screen position. `<NetworkOrb />` is rendered before
 * `.circle` in the JSX so it paints behind it (reinforced by explicit
 * z-index in the CSS) — this component otherwise has zero knowledge
 * of what the orb draws or how; that's entirely NetworkOrb's/orbMath's
 * concern.
 *
 * It also has zero knowledge that connector lines exist.
 * AmpConnectorLayer finds `.circle` purely through the DOM, via the
 * `data-amp-core` attribute below — not through props, imports, or
 * any other coupling — which is what lets this component stay
 * completely independent of the connector system.
 *
 * Still keyed off `AmpHubData` / the `getAmpHub()` data getter for
 * now — the data layer isn't part of this pass. A future
 * data-modeling pass can rename `hub` → `core` in
 * data/ampTransformation.ts once the full Orb content shape is known.
 *
 * The wordmark's three fragments (`hub.brand.lead/body/highlight`)
 * are rendered as separate spans so each can carry its own color
 * (accent / default / brand-purple) without any text being hardcoded
 * inside this component. When `hub.brand.logoSrc` is supplied, the
 * actual logo image renders instead and the text fragments are
 * skipped entirely.
 *
 * Server Component today: no "use client", no hooks, no state of its
 * own — `<NetworkOrb />` is its own Client Component boundary (it
 * needs canvas/ref/effect access), so AmpCore can render it as a
 * plain child without becoming a Client Component itself. The logo's
 * scroll-driven shrink/move, and the orb's future rotation, glow, and
 * depth shading (System 1 + System 2 in the spec's Motion
 * Architecture) still need their own follow-up work — kept out of
 * this pass on purpose.
 */
export function AmpCore({ hub }: AmpCoreProps) {
  return (
    <div className={styles.core}>
      <NetworkOrb />

      <div className={styles.circle} data-amp-core="true">
        {hub.brand.logoSrc ? (
          <img
            src={hub.brand.logoSrc}
            alt={hub.brand.logoAlt ?? "Amp'd"}
            className={styles.logoImage}
          />
        ) : (
          <span className={styles.logo} aria-label="Amp'd">
            <span className={styles.logoLead}>{hub.brand.lead}</span>
            <span className={styles.logoBody}>{hub.brand.body}</span>
            <span className={styles.logoHighlight}>{hub.brand.highlight}</span>
          </span>
        )}
      </div>
    </div>
  );
}