"use client";

import type { ChangeEvent } from "react";
import type { EpisodesToolbarProps } from "../types";
import styles from "./EpisodesToolbar.module.css";

/**
 * EpisodesToolbar
 *
 * The top toolbar of the TechTalk Episodes section: search input,
 * Subject Depth dropdown, and a result count.
 *
 * Styled with full transparency and 10px backdrop blur sampling the
 * page ribbon layer beneath.
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

  const resultCountLabel = content.resultCountTemplate
    .replace("{shown}", String(resultCount.shown))
    .replace("{total}", String(resultCount.total));

  return (
    <div
      className={styles.toolbar}
      style={{
        background: "rgba(217, 217, 217, 0)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* -----------------------------------------------------------
          LEFT — search
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
          ----------------------------------------------------------- */}
      <p className={styles.resultCount}>{resultCountLabel}</p>
    </div>
  );
}