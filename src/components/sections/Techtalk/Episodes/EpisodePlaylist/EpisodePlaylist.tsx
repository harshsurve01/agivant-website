import { EpisodeCard } from "../EpisodeCard";
import type { EpisodePlaylistProps } from "../types";
import styles from "./EpisodePlaylist.module.css";

/**
 * EpisodePlaylist
 *
 * Renders exactly the `episodes` list it's given, one EpisodeCard per
 * entry. Doesn't know about search or filtering — that's Episodes.tsx
 * (and later, whatever owns the toolbar's callbacks) narrowing the
 * list before it ever reaches this component.
 *
 * Presentation only, no local state: which episode is "active" comes
 * in via `currentEpisodeId`, and selection is reported back out via
 * `onSelectEpisode` — this component never decides what happens next.
 */
export function EpisodePlaylist({
  episodes,
  currentEpisodeId,
  content,
  onSelectEpisode,
}: EpisodePlaylistProps) {
  return (
    <div className={styles.playlist}>
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
