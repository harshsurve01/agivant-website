import { VideoPlayer } from "@/components/ui/VideoPlayer";
import type { EpisodePlayerProps } from "../types";
import styles from "./EpisodePlayer.module.css";

/**
 * EpisodePlayer
 *
 * The page's primary media player, not a generic card: video, speaker
 * info, episode title/description, and key takeaways for exactly one
 * episode (`episode` — no list awareness, no navigation between
 * episodes; that's EpisodePlaylist's job via Episodes.tsx's
 * `currentEpisodeId` state).
 *
 * Presentation only: no state, no YouTube-loading logic of its own —
 * all of that lives inside VideoPlayer. This component doesn't know
 * YouTube exists either — it maps `episode.youtubeId` onto
 * VideoPlayer's provider-agnostic `source` shape and stops there. If
 * `Episode.youtubeId` is ever replaced by a provider-agnostic field
 * (e.g. from WordPress), only the `source` object below changes —
 * VideoPlayer itself doesn't.
 *
 * `episode` is now optional: Episodes.tsx passes `undefined` when
 * search/depth filtering leaves zero matching episodes, instead of
 * the whole Episodes section bailing out with `return null` (which
 * would also hide the toolbar the person needs to adjust their
 * filters). This component renders `content.emptyStateLabel` in that
 * case rather than crashing on `episode.speaker` etc.
 */
export function EpisodePlayer({ episode, content }: EpisodePlayerProps) {
  if (!episode) {
    return (
      <div className={styles.card}>
        <p className={styles.emptyState}>{content.emptyStateLabel}</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.videoWrapper}>
        <VideoPlayer
          source={{ provider: "youtube", id: episode.youtubeId }}
          poster={episode.thumbnail}
          title={episode.title}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.speakerRow}>
          <span className={styles.avatar} aria-hidden="true">
            {episode.speaker.initials}
          </span>
          <span className={styles.speakerDetails}>
            <span className={styles.speakerName}>{episode.speaker.name}</span>
            <span className={styles.speakerRole}>{episode.speaker.role}</span>
          </span>
        </div>

        <h2 className={styles.title}>{episode.title}</h2>
        <p className={styles.description}>{episode.description}</p>

        <hr className={styles.divider} />

        <h3 className={styles.takeawaysHeading}>
          {content.keyTakeawaysLabel}
        </h3>
        <ul className={styles.takeawaysList}>
          {episode.takeaways.map((takeaway) => (
            <li key={takeaway}>{takeaway}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}