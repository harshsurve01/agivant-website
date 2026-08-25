"use client";

import styles from "./PortfolioFilters.module.css";
import type { PortfolioFiltersProps } from "./types";

/**
 * PortfolioFilters
 *
 * Presentation + local event wiring only. It never computes option
 * counts, never decides what's checked, never touches
 * data/caseStudies.ts, and never filters anything itself — CaseStudyHub
 * computes all of that and passes it down as `groups`, then receives
 * `onToggleOption`/`onResetAll` callbacks back up, per the approved
 * architecture:
 *
 *   CaseStudyHub -> PortfolioFilters -> selected filters ->
 *   filtered case studies -> CaseStudyCard[]
 *
 * "use client" only because the checkboxes need onChange handlers.
 * Explicit inline backdropFilter is passed to ensure Next.js/Turbopack
 * does not drop standard backdrop-filter during CSS minification.
 */
export function PortfolioFilters({
  heading = "Portfolio Filters",
  resetLabel = "Reset All",
  groups,
  onToggleOption,
  onResetAll,
}: PortfolioFiltersProps) {
  return (
    <aside
      className={styles.panel}
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
      aria-label={heading}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>{heading}</h2>
        <button
          type="button"
          className={styles.resetButton}
          onClick={onResetAll}
        >
          {resetLabel}
        </button>
      </div>

      {groups.map((group, index) => (
        <div key={group.id} className={styles.group}>
          {index > 0 && <hr className={styles.divider} />}

          <div className={styles.groupHeader}>
            <span className={styles.groupTitle}>{group.title}</span>
            <span className={styles.groupActiveCount}>
              {group.activeCount} Active
            </span>
          </div>

          <ul className={styles.optionList}>
            {group.options.map((option) => (
              <li key={option.value} className={styles.option}>
                <label className={styles.optionLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={option.checked}
                    onChange={() => onToggleOption(group.id, option.value)}
                  />
                  <span className={styles.optionText}>{option.label}</span>
                </label>
                <span className={styles.optionCount}>{option.count}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
