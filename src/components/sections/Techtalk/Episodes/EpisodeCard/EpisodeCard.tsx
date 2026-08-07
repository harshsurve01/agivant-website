import Image from "next/image";
import type { EpisodeCardProps } from "../types";
import styles from "./EpisodeCard.module.css";

/**
 * EpisodeCard
 *
 * A single playlist entry: thumbnail (with a play-state overlay and,
 * when active, a "Now Streaming" badge), category tag, title, and
 * speaker line. Deliberately takes flat props rather than a whole
 * `Episode` record — see EpisodeCardProps in types.ts — so it stays
 * reusable outside the Episodes section (a related-episodes widget,
 * a search results grid, etc.).
 *
 * Presentation only: `onSelect` is called with `id` on click, nothing
 * else. No selection state lives here — EpisodePlaylist just tells
 * this component whether it's the active one via `isActive`.
 *
 * Rendered as a real <button>, not a styled <div onClick>, so click,
 * keyboard (Enter/Space), and focus behavior all come for free rather
 * than being hand-rolled with role="button"/onKeyDown.
 */
export function EpisodeCard({
  id,
  title,
  speaker,
  thumbnail,
  category,
  duration,
  isActive,
  content,
  onSelect,
}: EpisodeCardProps) {
  return (
    <button
      type="button"
      className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
      onClick={() => onSelect?.(id)}
      aria-current={isActive ? "true" : undefined}
    >
      <span className={styles.thumbnailWrapper}>
        <Image
          src={thumbnail}
          alt=""
          fill
          className={styles.thumbnail}
          sizes="(max-width: 768px) 100vw, 380px"
        />

        {isActive && (
          <span className={styles.nowStreamingBadge}>
            {content.nowStreamingLabel}
          </span>
        )}

        {/* Decorative play affordance — inline SVG since no shared
            PlayIcon exists yet among this project's icon set (cube,
            arrow-up-right, arrow-right). Swap for a shared Icon if/
            when a play-glyph variant lands. Duration isn't rendered
            visually per the Figma, but is exposed for assistive tech
            via aria-label below rather than dropped entirely. */}
        <span className={styles.playOverlay} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6.5 4.5L15 10L6.5 15.5V4.5Z" fill="currentColor" />
          </svg>
        </span>

        <span className={styles.visuallyHidden}>
          {title}
          {duration ? `, ${duration}` : ""}
        </span>
      </span>

      <span className={styles.body}>
        {category && <span className={styles.category}>{category}</span>}
        <span className={styles.title}>{title}</span>
        <span className={styles.speakerLine}>
          <span className={styles.speakerLabel}>{content.speakerLabel}</span>{" "}
          {speaker}
        </span>
      </span>
    </button>
  );
}
