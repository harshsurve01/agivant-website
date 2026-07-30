import type { AmpHubData } from "@/data/ampTransformation";
import styles from "./AmpHub.module.css";

interface AmpHubProps {
  hub: AmpHubData;
}

/**
 * AmpHub
 *
 * Renders ONLY the circular container and the Amp'd wordmark/logo —
 * nothing else. It has zero knowledge that connector lines exist.
 *
 * All connector-line rendering has moved out to <AmpConnectors>, a
 * sibling of this component in AmpExperience's tree. That component
 * finds this one purely through the DOM, via the `data-amp-hub`
 * attribute below — not through props, imports, or any other coupling
 * — which is what lets this component stay completely independent of
 * the connector system per the new connector architecture.
 *
 * The wordmark's three fragments (`hub.brand.lead/body/highlight`)
 * are rendered as separate spans so each can carry its own color
 * (accent / default / brand-purple) without any text being hardcoded
 * inside this component. When `hub.brand.logoSrc` is supplied, the
 * actual logo image renders instead and the text fragments are
 * skipped entirely.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function AmpHub({ hub }: AmpHubProps) {
  return (
    <div className={styles.hub}>
      <div className={styles.circle} data-amp-hub="true">
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