"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Gradient } from "@/components/effects/Gradient";
import { EpisodesToolbar } from "./EpisodesToolBar";
import { EpisodePlayer } from "./EpisodePlayer";
import { EpisodePlaylist } from "./EpisodePlaylist";
import { filterEpisodes } from "./lib/filterEpisodes";
import type { EpisodesProps } from "./types";
import styles from "./Episodes.module.css";

/**
 * Episodes
 *
 * Owns layout AND, as of this pass, all filtering state: `searchQuery`,
 * `selectedDepth`, the derived `filteredEpisodes`, and which episode is
 * currently selected. EpisodesToolbar, EpisodePlayer, and
 * EpisodePlaylist remain presentation-only — none of them filter data
 * or hold their own copy of this state; they receive values + callbacks
 * as props and report interactions back up.
 *
 * Ambient background: the same two soft purple/peach <Gradient/> blobs
 * used by AmpTransformation ("What Changes When Your Enterprise Gets
 * Amp'd?"), same primitive and same color stops — not a new background
 * treatment invented for this section. Purely decorative (aria-hidden
 * is handled inside Gradient itself, same as AmpTransformation), so
 * they're placed first, ahead of the real content.
 *
 * Filtering: `filteredEpisodes` is derived via useMemo from the raw
 * `episodes` prop plus `searchQuery`/`selectedDepth`, using the pure
 * `filterEpisodes` helper in ./lib — no component (this one included)
 * imports data/techtalk.ts directly, and the helper itself has no idea
 * where `episodes` came from, so the exact same filtering behavior
 * applies once page.tsx swaps in a real WordPress response.
 *
 * Selection after filtering: if the currently selected episode drops
 * out of `filteredEpisodes` (search/depth no longer match it), an
 * effect below falls back to the first remaining episode — done as a
 * real state update (not just a render-time fallback) so
 * `currentEpisodeId` — the single source of truth EpisodePlaylist
 * reads for its "active" highlight — never points at an episode that
 * isn't even in the rendered list. If filtering leaves nothing at all,
 * `currentEpisode` is undefined and EpisodePlayer renders its own
 * empty state instead of this component bailing out with `return null`
 * — the toolbar (search box, depth select, "Showing 0 of N") stays on
 * screen so the person can adjust their filters.
 */
export function Episodes({ content, episodes, defaultEpisodeId }: EpisodesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepth, setSelectedDepth] = useState(
    content.toolbar.defaultDepthValue
  );
  const [currentEpisodeId, setCurrentEpisodeId] = useState(
    defaultEpisodeId ?? episodes[0]?.id
  );

  const filteredEpisodes = useMemo(
    () => filterEpisodes(episodes, { searchQuery, depth: selectedDepth }),
    [episodes, searchQuery, selectedDepth]
  );

  useEffect(() => {
    if (filteredEpisodes.length === 0) return;

    const stillPresent = filteredEpisodes.some(
      (episode) => episode.id === currentEpisodeId
    );
    if (!stillPresent) {
      setCurrentEpisodeId(filteredEpisodes[0].id);
    }
  }, [filteredEpisodes, currentEpisodeId]);

  // Render-time fallback mirrors the effect above for the one frame
  // before it runs (e.g. right after a keystroke that removes the
  // active episode) — keeps the player from ever pointing at an
  // episode that's no longer in filteredEpisodes, without waiting a
  // tick for state to catch up.
  const currentEpisode =
    filteredEpisodes.find((episode) => episode.id === currentEpisodeId) ??
    filteredEpisodes[0];

  return (
    <section className={styles.episodes}>
      <Gradient
        kind="linear"
        angle="180deg"
        top="60%"
        left="-20%"
        size="45rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
      <Gradient
        top="25%"
        left="-18%"
        size="42rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
      <Gradient
        top="65%"
        right="20%"
        size="42rem"
        stops={[
          "color-mix(in srgb, #8500df 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.2}
        blur="60px"
      />

      <Container>
        <div className={styles.toolbarRow}>
          <EpisodesToolbar
            content={content.toolbar}
            searchValue={searchQuery}
            selectedDepth={selectedDepth}
            resultCount={{
              shown: filteredEpisodes.length,
              total: episodes.length,
            }}
            onSearchChange={setSearchQuery}
            onDepthChange={setSelectedDepth}
          />
        </div>

        <div className={styles.mainRow}>
          <EpisodePlayer episode={currentEpisode} content={content.player} />
          <EpisodePlaylist
            episodes={filteredEpisodes}
            currentEpisodeId={currentEpisode?.id ?? ""}
            content={content.playlist}
            onSelectEpisode={setCurrentEpisodeId}
          />
        </div>
      </Container>
    </section>
  );
}