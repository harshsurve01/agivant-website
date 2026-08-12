/**
 * The three filter groups Figma shows. Declared independently here
 * (not imported from data/caseStudies.ts) so this component has zero
 * dependency on that data module, per the brief. CaseStudyHub is the
 * one place that knows this union matches CaseStudy's field names and
 * FilterGroupConfig's `id` in data/caseStudies.ts.
 */
export type FilterGroupId = "industry" | "capability" | "techPlatform";

export interface FilterOptionState {
  value: string;
  label: string;
  /** Result count for this option, computed upstream in CaseStudyHub. */
  count: number;
  /** Whether this option is currently selected. */
  checked: boolean;
}

export interface FilterGroupState {
  id: FilterGroupId;
  title: string;
  /** How many options in this group are currently selected. */
  activeCount: number;
  options: FilterOptionState[];
}

export interface PortfolioFiltersProps {
  /** Panel heading. Defaults to "Portfolio Filters". */
  heading?: string;
  /** Reset-all action label. Defaults to "Reset All". */
  resetLabel?: string;
  /** Fully-computed group/option state — this component never
   * computes counts, active state, or filtering itself. */
  groups: FilterGroupState[];
  /** Called when a checkbox is toggled, with the group and option value. */
  onToggleOption: (groupId: FilterGroupId, value: string) => void;
  /** Called when "Reset All" is clicked. */
  onResetAll: () => void;
}
