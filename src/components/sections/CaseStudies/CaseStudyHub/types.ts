import type { CaseStudy, FilterGroupConfig } from "@/data/caseStudies";

export interface CaseStudyHubProps {
  /** Section heading — Figma shows "Case Studies". */
  heading: string;
  /** Full case study dataset. All filtering happens inside this
   * component, not upstream — CaseStudyHub is the one place allowed
   * to import types from data/caseStudies.ts (via app/case-studies/page.tsx
   * passing the actual array through as a prop, per the approved data
   * flow: caseStudies.ts -> page.tsx -> CaseStudyHub). */
  caseStudies: CaseStudy[];
  /** Static filter group/option labels. Result counts are NOT part of
   * this config — CaseStudyHub computes those from `caseStudies`. */
  filterGroups: FilterGroupConfig[];
  /**
   * Optional search term. Clean integration point for the Hero's
   * SearchBar (see Hero.tsx) — the Hero doesn't currently lift its
   * input value up to the page, so this stays unwired/undefined for
   * now rather than duplicating search state. Once the page wires the
   * Hero's SearchBar to a value it owns, pass that value straight
   * through here with no change to this component's filtering logic.
   */
  searchQuery?: string;
}
