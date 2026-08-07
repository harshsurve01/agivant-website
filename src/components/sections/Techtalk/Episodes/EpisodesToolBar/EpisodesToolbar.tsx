"use client";

import type { ChangeEvent } from "react";
import type { EpisodesToolbarProps } from "../types";
import styles from "./EpisodesToolbar.module.css";

/**
 * EpisodesToolbar
 *
 * The top toolbar of the TechTalk Episodes section: search input,
 * Subject Depth dropdown, and a result count. Presentation only — it
 * still performs no search/filter logic and holds no state of its
 * own. As of this pass it's fully controlled: `searchValue`,
 * `selectedDepth`, and `resultCount` all come from Episodes.tsx (the
 * component that owns filtering), and `onSearchChange`/`onDepthChange`
 * are required — Episodes.tsx always wires them, since the whole
 * point of this pass is that they now drive real filtering upstream.
 *
 * Client Component: the input/select need real onChange handlers,
 * which requires a client boundary. Everything above this in the tree
 * (Episodes, page.tsx) can stay a Server Component were it not for
 * Episodes.tsx's own filtering state — the same split already used
 * for Button/ButtonMotion and ShineHighlight elsewhere in this
 * project.
 *
 * Does not import mock/page data itself — all copy and options arrive
 * via `content`, sourced from data/techtalk.ts through page.tsx →
 * Episodes → here. This keeps the component WordPress-ready: a future
 * headless data source only has to match EpisodesToolbarContent's
 * shape, no changes required in this file.
 */
export function EpisodesToolbar({
  content,
  searchValue,
  selectedDepth,
  resultCount,
  onSearchChange,
  onDepthChange,
}: EpisodesToolbarProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleDepthChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onDepthChange(event.target.value);
  };

  // Interpolation only — no counting, no filtering. The numbers
  // themselves are computed upstream by Episodes.tsx from the
  // filtered episode list; this just fills in the copy's template.
  const resultCountLabel = content.resultCountTemplate
    .replace("{shown}", String(resultCount.shown))
    .replace("{total}", String(resultCount.total));

  return (
    <div className={styles.toolbar}>
      {/* -----------------------------------------------------------
          LEFT — search
          Now a controlled input (`value={searchValue}`) since real
          filtering exists upstream — previously uncontrolled/inert.
          `searchLabel` backs an accessible name without duplicating
          the placeholder visibly, matching the Figma (placeholder-
          only, no separate on-screen label).
          ----------------------------------------------------------- */}
      <div className={styles.searchGroup}>
        <label htmlFor="episodes-search" className={styles.visuallyHidden}>
          {content.searchLabel}
        </label>
        <input
          id="episodes-search"
          type="search"
          className={styles.searchInput}
          placeholder={content.searchPlaceholder}
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      {/* -----------------------------------------------------------
          CENTER — Subject Depth
          Now a controlled select (`value={selectedDepth}`), same
          reasoning as search above. Options still come entirely from
          `content.depthOptions` — adding future depths (Beginner/
          Intermediate/Advanced) is a data change in data/techtalk.ts,
          not a code change here. Native <select>: no reusable Select
          component exists yet elsewhere in the project.
          ----------------------------------------------------------- */}
      <div className={styles.depthGroup}>
        <label htmlFor="episodes-depth" className={styles.depthLabel}>
          {content.depthLabel}
        </label>
        <div className={styles.selectWrapper}>
          <select
            id="episodes-depth"
            className={styles.depthSelect}
            value={selectedDepth}
            onChange={handleDepthChange}
          >
            {content.depthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Decorative chevron — no icon component reused here since
              none of the icons seen so far in this project (cube,
              arrow-up-right, arrow-right) fit a dropdown chevron.
              Swap for a shared Icon if/when a chevron variant exists. */}
          <svg
            className={styles.selectChevron}
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* -----------------------------------------------------------
          RIGHT — result count
          Now dynamic: content.resultCountTemplate supplies the copy
          shape ("Showing {shown} of {total} episodes"), and
          `resultCount` (computed by Episodes.tsx from the filtered
          array) fills in the two numbers. No hardcoded count string
          remains anywhere in this component.
          ----------------------------------------------------------- */}
      <p className={styles.resultCount}>{resultCountLabel}</p>
    </div>
  );
}