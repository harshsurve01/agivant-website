import { ALL_DEPTHS_VALUE, type Episode } from "../types";

/**
 * Inputs Episodes.tsx passes through on every render — mirrors the
 * searchQuery/selectedDepth state it owns, kept as a separate type
 * here rather than importing component state directly, so this file
 * has zero dependency on React.
 */
export interface EpisodeFilters {
  /** Raw search input value, matched case-insensitively as a
   *  substring against title, category, speaker name, and tags. No
   *  fuzzy matching — a plain normalized `.includes()` check. */
  searchQuery: string;
  /** Selected Subject Depth value. ALL_DEPTHS_VALUE matches every
   *  episode regardless of its own `depth`. */
  depth: string;
}

/**
 * filterEpisodes
 *
 * Pure function: no React, no DOM, no knowledge of where `episodes`
 * came from. Works identically whether the array was built from
 * data/techtalk.ts or a future WordPress JSON response, since it only
 * reads the shared `Episode` shape (see Episodes/types.ts).
 *
 * Owned and called by Episodes.tsx. EpisodesToolbar and EpisodeCard
 * never call this directly — per the architecture, filtering logic
 * lives in exactly one place, and every other component stays
 * presentation-only.
 */
export function filterEpisodes(
  episodes: Episode[],
  filters: EpisodeFilters
): Episode[] {
  const normalizedQuery = normalize(filters.searchQuery);

  return episodes.filter((episode) => {
    const matchesDepth =
      filters.depth === ALL_DEPTHS_VALUE || episode.depth === filters.depth;

    if (!matchesDepth) return false;
    if (!normalizedQuery) return true;

    return matchesSearch(episode, normalizedQuery);
  });
}

/**
 * Checks title, category, speaker name, and tags — in that order, but
 * order has no effect on the result since this is `.some()`, not a
 * ranked/scored match. Tags is spread even though today's mock data
 * always supplies `[]`, so this already works the moment real tags
 * exist without touching this function again.
 */
function matchesSearch(episode: Episode, normalizedQuery: string): boolean {
  const haystack = [
    episode.title,
    episode.category,
    episode.speaker.name,
    ...episode.tags,
  ];

  return haystack.some((field) => normalize(field).includes(normalizedQuery));
}

/** Case-insensitive, whitespace-trimmed. Deliberately simple —
 *  substring matching only, per the brief ("do not perform fuzzy
 *  search"). */
function normalize(value: string): string {
  return value.trim().toLowerCase();
}
