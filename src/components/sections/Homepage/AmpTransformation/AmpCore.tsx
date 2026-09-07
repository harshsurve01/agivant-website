import type { AmpHubData } from "@/data/ampTransformation";
import styles from "./AmpCore.module.css";

interface AmpCoreProps {
  hub: AmpHubData;
}

/**
 * AmpCore
 *
 * The central visual anchor of the AmpTransformation section:
 * - The new organic iridescent Amp Core blob asset (/images/logo/amp-core.png)
 * - The centered "Amp'd" wordmark logo sitting in the middle of the blob
 *
 * Structured as a clean component so that later this static image can be
 * replaced with a looping animation without altering surrounding layout.
 */
export function AmpCore({ hub }: AmpCoreProps) {
  return (
    <div className={styles.core} data-amp-core="true">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/logo/amp-core.png"
        className={styles.blobVideo}
        data-amp-blob="true"
        aria-hidden="true"
      >
        <source src="/videos/ampd-section-bg.mp4" type="video/mp4" />
      </video>

      <div className={styles.logoWrap} data-amp-logo="true">
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