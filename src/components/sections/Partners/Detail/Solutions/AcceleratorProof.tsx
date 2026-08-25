import { VideoPlayer } from "@/components/ui/VideoPlayer";
import type { AcceleratorProofData } from "@/types/partnerDetail";
import styles from "./Solutions.module.css";

export interface AcceleratorProofProps {
  proof?: AcceleratorProofData;
}

/**
 * AcceleratorProof
 *
 * Renders the proof narrative and supporting video for the currently active accelerator:
 * 1. Top Banner Card with headline & description
 * 2. Purple metric highlights summary line
 * 3. Video player container reusing the shared VideoPlayer
 *
 * Driven directly by the active accelerator state with zero hardcoded presentation copy.
 */
export function AcceleratorProof({ proof }: AcceleratorProofProps) {
  if (!proof) return null;

  return (
    <div className={styles.proofSection}>
      {/* Top Banner Card */}
      <div className={styles.proofBanner}>
        <h3 className={styles.proofHeadline}>{proof.headline}</h3>
        <p className={styles.proofDescription}>{proof.description}</p>
      </div>

      {/* Highlights / Metric Summary line */}
      {proof.highlights && proof.highlights.length > 0 && (
        <div className={styles.proofHighlights}>
          {proof.highlights.map((highlight, idx) => (
            <span key={highlight} className={styles.highlightItem}>
              {idx > 0 && <span className={styles.highlightDot}>·</span>}
              <span>{highlight}</span>
            </span>
          ))}
        </div>
      )}

      {/* Video Player Container */}
      {proof.video && (
        <div className={styles.proofVideoWrapper}>
          <VideoPlayer
            source={{ provider: proof.video.provider, id: proof.video.id }}
            poster={proof.video.poster}
            title={proof.video.title}
          />
        </div>
      )}
    </div>
  );
}
