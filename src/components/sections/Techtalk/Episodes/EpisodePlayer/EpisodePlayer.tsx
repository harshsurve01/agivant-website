import { VideoPlayer } from "@/components/ui/VideoPlayer";
import type { EpisodePlayerProps } from "../types";
import styles from "./EpisodePlayer.module.css";

/**
 * EpisodePlayer
 *
 * The page's primary media player: video, speaker info, episode
 * title/description, and key takeaways for the active episode.
 *
 * Styled with transparent glass surface and 10px backdrop blur sampling
 * the page ribbon layer beneath.
 */
export function EpisodePlayer({ episode, content }: EpisodePlayerProps) {
  if (!episode) {
    return (
      <div
        className={styles.card}
        style={{
          background: "rgba(217, 217, 217, 0)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <p className={styles.emptyState}>{content.emptyStateLabel}</p>
      </div>
    );
  }

  return (
    <div
      className={styles.card}
      style={{
        background: "rgba(217, 217, 217, 0)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
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