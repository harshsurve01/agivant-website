import clsx from "clsx";
import type { BlogFilterOption } from "./types";
import styles from "./BlogFilters.module.css";

export interface BlogFiltersProps {
  topics: BlogFilterOption[];
  selectedTopic: string;
  onTopicChange: (id: string) => void;

  readTimeOptions: BlogFilterOption[];
  selectedReadTime: string;
  onReadTimeChange: (id: string) => void;

  audienceOptions: BlogFilterOption[];
  selectedAudience: string;
  onAudienceChange: (id: string) => void;
}

/**
 * BlogFilters
 *
 * Renders the glass filter panel: topic pills on the left, a
 * vertical divider, and the Read Time / Audience segmented controls
 * on the right. Pure presentation — every current value and every
 * change handler arrives through props from BlogHub, which owns all
 * filter state. Selecting an option here only ever calls the
 * matching `on*Change` callback; it never mutates anything itself.
 *
 * No "use client" directive of its own — it's rendered inside
 * BlogHub, which is already a Client Component, so its onClick
 * handlers work as part of that same client module graph (same
 * pattern Button/ButtonMotion already established elsewhere in the
 * project).
 */
export function BlogFilters({
  topics,
  selectedTopic,
  onTopicChange,
  readTimeOptions,
  selectedReadTime,
  onReadTimeChange,
  audienceOptions,
  selectedAudience,
  onAudienceChange,
}: BlogFiltersProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.topicColumn}>
        <p className={styles.groupLabel}>By Topic</p>
        <div className={styles.topicRow}>
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              aria-pressed={selectedTopic === topic.id}
              className={clsx(
                styles.topicButton,
                selectedTopic === topic.id && styles.topicButtonActive
              )}
              onClick={() => onTopicChange(topic.id)}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.rightColumn}>
        <div className={styles.segmentGroup}>
          <p className={styles.groupLabel}>Read Time</p>
          <div className={styles.segmentTrack} role="group" aria-label="Filter by read time">
            {readTimeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={selectedReadTime === option.id}
                className={clsx(
                  styles.segmentButton,
                  selectedReadTime === option.id && styles.segmentButtonActive
                )}
                onClick={() => onReadTimeChange(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.segmentGroup}>
          <p className={styles.groupLabel}>Audience</p>
          <div className={styles.segmentTrack} role="group" aria-label="Filter by audience">
            {audienceOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={selectedAudience === option.id}
                className={clsx(
                  styles.segmentButton,
                  selectedAudience === option.id && styles.segmentButtonActive
                )}
                onClick={() => onAudienceChange(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
