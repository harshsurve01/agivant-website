import { EpisodeCard } from "../EpisodeCard";
import type { EpisodePlaylistProps } from "../types";
import styles from "./EpisodePlaylist.module.css";

/**
 * EpisodePlaylist
 *
 * Renders the episode list alongside the main player.
 *
 * Styled with transparent glass surface and 10px backdrop blur sampling
 * the page ribbon layer beneath.
 */
export function EpisodePlaylist({
  episodes,
  currentEpisodeId,
  content,
  onSelectEpisode,
}: EpisodePlaylistProps) {
  return (
    <div
      className={styles.playlist}
      style={{
        background: "rgba(217, 217, 217, 0)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <ul className={styles.list}>
        {episodes.map((episode) => (
          <li key={episode.id}>
            <EpisodeCard
              id={episode.id}
              title={episode.title}
              speaker={episode.speaker.name}
              thumbnail={episode.thumbnail}
              category={episode.category}
              youtubeId={episode.youtubeId}
              duration={episode.duration}
              isActive={episode.id === currentEpisodeId}
              content={content}
              onSelect={onSelectEpisode}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
