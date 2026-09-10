"use client";

import { useState, useMemo } from "react";
import clsx from "clsx";
import { SearchBar } from "@/components/ui/SearchBar";
import { SolutionCard } from "../SolutionCard";
import {
  SOLUTION_CATEGORIES,
  SOLUTION_DOMAINS,
  type SolutionHubItem,
} from "@/data/solutions";
import type { SolutionsHubProps } from "./types";
import styles from "./SolutionsHub.module.css";

/**
 * SolutionsHub
 *
 * Section 2 of the Solutions Landing Page matching Figma:
 * 1. SearchBar: full-width pill with search icon, dark search button,
 *    and placeholder "Search by name, description or domain".
 * 2. Solution Cards: 2-column grid in a dedicated vertically scrollable
 *    container with custom thin scrollbar.
 * 3. Sticky Filters Panel: sticky right-side card with "Filters", "Reset",
 *    purple "Categories" and "Domains" sections, and rounded checkboxes.
 */
export function SolutionsHub({
  solutions,
  categories = SOLUTION_CATEGORIES,
  domains = SOLUTION_DOMAINS,
  className,
}: SolutionsHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set()
  );
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(
    () => new Set()
  );

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const toggleDomain = (dom: string) => {
    setSelectedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(dom)) {
        next.delete(dom);
      } else {
        next.add(dom);
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setSelectedCategories(new Set());
    setSelectedDomains(new Set());
  };

  const handleResetAll = () => {
    setSearchQuery("");
    setSelectedCategories(new Set());
    setSelectedDomains(new Set());
  };

  const filteredSolutions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return solutions.filter((sol) => {
      // 1. Text Search: matches title, description, or domain metadata
      if (query) {
        const matchesTitle = sol.title.toLowerCase().includes(query);
        const matchesDesc = sol.description.toLowerCase().includes(query);
        const matchesDomain = sol.domain
          ? sol.domain.toLowerCase().includes(query)
          : false;
        const matchesDomainsList = sol.domains
          ? sol.domains.some((d) => d.toLowerCase().includes(query))
          : false;

        if (!matchesTitle && !matchesDesc && !matchesDomain && !matchesDomainsList) {
          return false;
        }
      }

      // 2. Category Filter: OR within category selection
      if (selectedCategories.size > 0) {
        if (!sol.category || !selectedCategories.has(sol.category)) {
          return false;
        }
      }

      // 3. Domain Filter: OR within domain selection
      if (selectedDomains.size > 0) {
        const hasMatchingDomain = sol.domain && selectedDomains.has(sol.domain);
        const hasMatchingDomainsList =
          sol.domains && sol.domains.some((d) => selectedDomains.has(d));

        if (!hasMatchingDomain && !hasMatchingDomainsList) {
          return false;
        }
      }

      return true;
    });
  }, [solutions, searchQuery, selectedCategories, selectedDomains]);

  return (
    <section className={clsx(styles.hubSection, className)}>
      {/* 1. Full-width Search Bar */}
      <div className={styles.searchWrap}>
        <SearchBar
          placeholder="Search by name, description or domain"
          buttonLabel="Search"
          showSearchIcon
          buttonVariant="dark"
          variant="solid"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSubmit={(e) => e.preventDefault()}
        />
      </div>

      {/* 2. Main Area: Scrollable Cards Grid + Sticky Filters */}
      <div className={styles.mainLayout}>
        <div
          className={styles.cardsContainer}
          role="region"
          aria-label="Solutions Listing"
          tabIndex={0}
        >
          <div className={styles.cardsGrid}>
            {filteredSolutions.length === 0 ? (
              <div className={styles.emptyState}>
                <h4 className={styles.emptyTitle}>No solutions found</h4>
                <p className={styles.emptyText}>
                  Try adjusting your search query or clearing active filters.
                </p>
                <button
                  type="button"
                  className={styles.emptyResetBtn}
                  onClick={handleResetAll}
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredSolutions.map((solution) => (
                <SolutionCard key={solution.id} solution={solution} />
              ))
            )}
          </div>
        </div>

        {/* 3. Sticky Right-Side Filters Panel */}
        <aside className={styles.filterPanel} aria-label="Filters">
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>Filters</h3>
            <button
              type="button"
              className={styles.resetButton}
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>

          <div className={styles.filterGroup}>
            <h4 className={styles.groupHeading}>Categories</h4>
            <div className={styles.optionsList}>
              {categories.map((cat) => (
                <label key={cat} className={styles.optionLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={selectedCategories.has(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span className={styles.optionText}>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.filterGroup}>
            <h4 className={styles.groupHeading}>Domains</h4>
            <div className={styles.optionsList}>
              {domains.map((dom) => (
                <label key={dom} className={styles.optionLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={selectedDomains.has(dom)}
                    onChange={() => toggleDomain(dom)}
                  />
                  <span className={styles.optionText}>{dom}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
