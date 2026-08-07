/* ==========================================================================
   Episodes/types.ts
   Shared interfaces for the Episodes section: toolbar, player,
   playlist, card, and the section's own top-level props. One file per
   the project's existing convention (see EpisodesToolbarContent
   below, added in the previous pass) rather than one types file per
   component.
   ========================================================================== */

/**
 * Sentinel Subject Depth value meaning "match every depth". Shared
 * between data/techtalk.ts (as depthOptions[].value / defaultDepthValue)
 * and Episodes/lib/filterEpisodes.ts (as the "don't filter by depth"
 * check) so the two never drift out of sync with a duplicated literal.
 */
export const ALL_DEPTHS_VALUE = "all";

/** One entry in the Subject Depth dropdown. */
export interface EpisodesDepthOption {
  /** Visible label, e.g. "All Levels", "Beginner". */
  label: string;
  /** Value used for filtering — matched against Episode.depth, or
   *  ALL_DEPTHS_VALUE to match every episode regardless of depth. */
  value: string;
}

/**
 * All toolbar copy and option data, shaped for a future Headless
 * WordPress source. Nothing here is component-specific presentation
 * (no className, no style) — it's content only, so the same shape can
 * later be returned by a WP query with zero changes on the component
 * side.
 *
 * resultCountTemplate replaces the old static resultCountLabel: the
 * *copy* ("Showing {shown} of {total} episodes") is still content
 * from data/techtalk.ts, but the {shown}/{total} numbers themselves
 * are computed by Episodes.tsx from the filtered episode list and
 * passed down as `resultCount` — EpisodesToolbar only interpolates
 * the template, it never counts or filters anything itself.
 */
export interface EpisodesToolbarContent {
  /** Accessible label for the search input (not necessarily visible —
   *  the Figma shows placeholder text only, so this backs a visually
   *  hidden <label> rather than duplicating the placeholder on screen). */
  searchLabel: string;
  /** Placeholder text shown inside the empty search input. */
  searchPlaceholder: string;
  /** Visible label to the left of the Subject Depth dropdown. */
  depthLabel: string;
  /** Options rendered inside the Subject Depth dropdown. Add more
   *  entries here (e.g. "Beginner"/"Intermediate"/"Advanced") to
   *  support future depths — no component code changes required. */
  depthOptions: EpisodesDepthOption[];
  /** Which option's value is selected by default. */
  defaultDepthValue: string;
  /** Template for the result count copy. EpisodesToolbar replaces the
   *  literal substrings "{shown}" and "{total}" — nothing fancier —
   *  e.g. "Showing {shown} of {total} episodes". */
  resultCountTemplate: string;
}

/** Filtered vs total episode counts, computed by Episodes.tsx. */
export interface EpisodesResultCount {
  /** Number of episodes remaining after search + depth filtering. */
  shown: number;
  /** Total number of episodes Episodes.tsx received via props. */
  total: number;
}

export interface EpisodesToolbarProps {
  /** All toolbar copy/options — see EpisodesToolbarContent. Sourced
   *  from data/techtalk.ts and threaded down through page.tsx →
   *  Episodes → EpisodesToolbar; never imported directly here. */
  content: EpisodesToolbarContent;
  /** Current search input value. Owned by Episodes.tsx — this makes
   *  the input controlled instead of the previous uncontrolled/inert
   *  version, since search now actually drives filtering upstream. */
  searchValue: string;
  /** Currently selected Subject Depth value. Owned by Episodes.tsx,
   *  same reasoning as searchValue above. */
  selectedDepth: string;
  /** Filtered/total counts to interpolate into
   *  content.resultCountTemplate. Computed by Episodes.tsx. */
  resultCount: EpisodesResultCount;
  /** Fires on every keystroke in the search input. This component
   *  still performs no filtering itself — Episodes.tsx owns
   *  searchQuery and decides what happens with the value. */
  onSearchChange: (value: string) => void;
  /** Fires when the Subject Depth selection changes. Same
   *  presentation-only contract as onSearchChange above. */
  onDepthChange: (value: string) => void;
}

/* ==========================================================================
   Episode domain data — player + playlist + card
   ========================================================================== */

/** The presenter/speaker of an episode. */
export interface EpisodeSpeaker {
  name: string;
  /** e.g. "Digital Platform Engineer - AI/ML". */
  role: string;
  /** Shown in the avatar badge, e.g. "SJ". Kept as explicit content
   *  rather than derived from `name` at render time — a future WP
   *  field can supply this directly, which also sidesteps auto-
   *  derivation reading oddly for non-Latin or multi-part names. */
  initials: string;
}

/**
 * One TechTalk episode — the full record used by EpisodePlayer and
 * held in the page-level episodes list. EpisodeCard does NOT receive
 * this type directly (see EpisodeCardProps below): it takes a flatter,
 * card-specific prop set per the brief, so it stays reusable outside
 * the Episodes section without dragging in fields (description,
 * takeaways) it never renders.
 */
export interface Episode {
  id: string;
  title: string;
  /** Topic/category tag, e.g. "AI Agents & NLP". Shown on the card;
   *  not rendered in the player itself. Also searched by
   *  filterEpisodes. */
  category: string;
  speaker: EpisodeSpeaker;
  /** Paragraph shown under the episode title in the player. */
  description: string;
  /** Bulleted list under "Key Takeaways & Technical Assets". */
  takeaways: string[];
  /** Thumbnail/poster image src. */
  thumbnail: string;
  youtubeId: string;
  /** Pre-formatted display duration, e.g. "2:17" — content, not
   *  seconds, matching this file's "content, not computed values"
   *  convention elsewhere (see resultCountTemplate above). */
  duration: string;
  /** Subject Depth this episode belongs to. Matched against
   *  EpisodesToolbarContent.depthOptions[].value by filterEpisodes —
   *  every episode has one (today they're all ALL_DEPTHS_VALUE) so
   *  filtering never has to special-case a missing field. */
  depth: string;
  /** Free-form keywords searched alongside title/category/speaker
   *  name. Empty today — no tags exist in the current mock data — but
   *  present on every episode so tag search already works the moment
   *  a CMS starts sending real values, with no component change. */
  tags: string[];
}

/** Copy owned by EpisodePlayer beyond the episode data itself. */
export interface EpisodePlayerContent {
  /** Heading above the bulleted takeaways, e.g.
   *  "Key Takeaways & Technical Assets". */
  keyTakeawaysLabel: string;
  /** Shown in place of the player when filtering leaves zero
   *  episodes, e.g. "No episodes match your search." */
  emptyStateLabel: string;
}

export interface EpisodePlayerProps {
  /** The currently selected episode. Undefined when search/depth
   *  filtering has removed every episode from the list — EpisodePlayer
   *  renders content.emptyStateLabel instead of crashing in that case. */
  episode?: Episode;
  content: EpisodePlayerContent;
}

/** Copy shared by EpisodePlaylist and EpisodeCard. */
export interface EpisodePlaylistContent {
  /** Badge text on the active card, e.g. "Now Streaming". */
  nowStreamingLabel: string;
  /** Prefix before the speaker name on each card, e.g. "Speaker:". */
  speakerLabel: string;
}

export interface EpisodePlaylistProps {
  /** The list to render — already filtered by Episodes.tsx. The
   *  playlist still doesn't know about search or filtering itself; it
   *  renders exactly the list it's given. */
  episodes: Episode[];
  /** id of the episode currently playing, used to mark that card
   *  active/"Now Streaming" and to drive its visual highlight. */
  currentEpisodeId: string;
  content: EpisodePlaylistContent;
  /** Fires when a card is chosen. No selection state lives here —
   *  Episodes.tsx (owner of `currentEpisodeId`) decides what happens
   *  next. Optional so the list still renders, inert, before that
   *  wiring exists. */
  onSelectEpisode?: (id: string) => void;
}

/**
 * Deliberately flat, not `episode: Episode` — per the brief, so this
 * card can be reused anywhere else in the site (a "related episodes"
 * widget, a search results grid, etc.) without requiring a caller to
 * assemble a full Episode record (description/takeaways included)
 * just to render a thumbnail and a title.
 */
export interface EpisodeCardProps {
  id: string;
  title: string;
  /** Speaker's display name only — the card doesn't show role. */
  speaker: string;
  thumbnail: string;
  category: string;
  youtubeId: string;
  duration: string;
  /** Whether this card represents the episode currently playing.
   *  Drives the highlighted border and the "Now Streaming" badge. */
  isActive: boolean;
  /** Same shared copy as EpisodePlaylistContent — passed straight
   *  through by EpisodePlaylist rather than duplicated per-card in
   *  data/techtalk.ts. */
  content: EpisodePlaylistContent;
  onSelect?: (id: string) => void;
}

/* ==========================================================================
   Episodes (section) — composes toolbar + player + playlist
   ========================================================================== */

export interface EpisodesContent {
  toolbar: EpisodesToolbarContent;
  player: EpisodePlayerContent;
  playlist: EpisodePlaylistContent;
}

export interface EpisodesProps {
  content: EpisodesContent;
  /** Full, unfiltered episode list — Episodes.tsx derives
   *  filteredEpisodes from this via filterEpisodes(); no other
   *  component receives the unfiltered list. */
  episodes: Episode[];
  /** Which episode plays first. Falls back to episodes[0] if omitted —
   *  see Episodes.tsx. */
  defaultEpisodeId?: string;
}