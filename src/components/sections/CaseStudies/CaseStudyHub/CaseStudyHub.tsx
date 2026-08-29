"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { CaseStudyCard } from "@/components/sections/CaseStudies/CaseStudyCard";
import { PortfolioFilters } from "@/components/sections/CaseStudies/PortfolioFilters";
import type {
  FilterGroupId,
  FilterGroupState,
} from "@/components/sections/CaseStudies/PortfolioFilters";
import styles from "./CaseStudyHub.module.css";
import type { CaseStudyHubProps } from "./types";
import { Gradient } from "@/components/effects/Gradient";

/**
 * Maps each filter group to the CaseStudy field it filters against.
 * The single place in the codebase that has to know PortfolioFilters'
 * FilterGroupId union lines up with data/caseStudies.ts's CaseStudy
 * field names — both leaf components stay decoupled from each other.
 */
const FIELD_BY_GROUP: Record<
  FilterGroupId,
  "industry" | "capability" | "techPlatform"
> = {
  industry: "industry",
  capability: "capability",
  techPlatform: "techPlatform",
};

const EMPTY_SELECTION: Record<FilterGroupId, Set<string>> = {
  industry: new Set(),
  capability: new Set(),
  techPlatform: new Set(),
};

/**
 * CaseStudyHub
 *
 * Owns all filtering state for the Case Studies listing, per the
 * approved architecture:
 *
 *   CaseStudyHub -> PortfolioFilters -> selected filters ->
 *   filtered case studies -> CaseStudyCard[]
 *
 * CaseStudyCard and PortfolioFilters both stay presentation-only and
 * never import data/caseStudies.ts or compute anything themselves —
 * every option's count, every checked state, and the filtered list
 * itself is computed here and passed down as plain props/callbacks.
 * Filtering IS wired up and functional (multi-select within a group
 * is OR, across groups is AND — e.g. selecting two Industries shows
 * cards matching either, but also requires matching any selected
 * Capability), not left as scaffolding, since the project's existing
 * conventions (plain useState + derived values, no extra state
 * library) support it cleanly at this scale.
 *
 * `searchQuery` is a clean integration point for the Hero's search
 * field — see types.ts for why it stays unwired/optional for now
 * rather than duplicating state the Hero doesn't yet expose.
 *
 * "use client": needs useState for the filter selection.
 */
export function CaseStudyHub({
  heading,
  caseStudies,
  filterGroups,
  searchQuery,
}: CaseStudyHubProps) {
  const [selected, setSelected] =
    useState<Record<FilterGroupId, Set<string>>>(EMPTY_SELECTION);

  function toggleOption(groupId: FilterGroupId, value: string) {
    setSelected((prev) => {
      const next = new Set(prev[groupId]);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return { ...prev, [groupId]: next };
    });
  }

  function resetAll() {
    setSelected({
      industry: new Set(),
      capability: new Set(),
      techPlatform: new Set(),
    });
  }

  const filteredCaseStudies = useMemo(() => {
    const trimmedQuery = searchQuery?.trim().toLowerCase();

    return caseStudies.filter((caseStudy) => {
      const matchesEveryGroup = (
        Object.keys(selected) as FilterGroupId[]
      ).every((groupId) => {
        const activeValues = selected[groupId];
        if (activeValues.size === 0) return true;
        return activeValues.has(caseStudy[FIELD_BY_GROUP[groupId]]);
      });
      if (!matchesEveryGroup) return false;

      if (trimmedQuery) {
        return caseStudy.title.toLowerCase().includes(trimmedQuery);
      }

      return true;
    });
  }, [caseStudies, selected, searchQuery]);

  const isFilteredOrSearched = useMemo(() => {
    const hasActiveFilter = (
      Object.keys(selected) as FilterGroupId[]
    ).some((groupId) => selected[groupId].size > 0);
    const hasActiveSearch = Boolean(
      searchQuery && searchQuery.trim().length > 0
    );

    return hasActiveFilter || hasActiveSearch;
  }, [selected, searchQuery]);

  const visibleCaseStudies = useMemo(() => {
    if (isFilteredOrSearched) {
      return filteredCaseStudies;
    }
    return filteredCaseStudies.slice(0, 6);
  }, [filteredCaseStudies, isFilteredOrSearched]);

  const groupsWithState: FilterGroupState[] = useMemo(() => {
    return filterGroups.map((group) => {
      const field = FIELD_BY_GROUP[group.id];
      const activeValues = selected[group.id];

      return {
        id: group.id,
        title: group.title,
        activeCount: activeValues.size,
        options: group.options.map((option) => ({
          value: option.value,
          label: option.label,
          checked: activeValues.has(option.value),
          // Computed from the full dataset, not narrowed by other
          // active filters — a simpler v1 than cross-filtered counts.
          // See the chat report for why this diverges from Figma's
          // static mock numbers.
          count: caseStudies.filter((cs) => cs[field] === option.value)
            .length,
        })),
      };
    });
  }, [filterGroups, selected, caseStudies]);

  return (
    <section className={styles.hub}>
               <Gradient
                   top="45%"
                   right="25%"
                   size="45rem"
                   stops={["#8500df 50%", "#edbf79 55%", "transparent 75%"]}
                   opacity={0.15}
                   blur="80px"
                 /> 
                       <Gradient
        kind="linear"
        angle="180deg"
        top="58%"
        left="-5%"
        size="25rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
        <Gradient
        top="25%"
        left="-18%"
        size="32rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
      <Container>
        <h2 className={styles.heading}>{heading}</h2>

        <div className={styles.layout}>
          <div className={styles.grid}>
            {visibleCaseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
            ))}
          </div>

          <PortfolioFilters
            groups={groupsWithState}
            onToggleOption={toggleOption}
            onResetAll={resetAll}
          />
        </div>
      </Container>
    </section>
  );
}
