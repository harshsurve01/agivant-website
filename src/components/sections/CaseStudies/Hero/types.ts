/**
 * Search copy + optional controlled-input wiring for the Case Studies
 * Hero's SearchBar. Mirrors SearchBar's own API 1:1 (value/onChange/
 * onSubmit all optional) rather than inventing a second shape — this
 * Hero never implements filtering itself, it just forwards whatever
 * the page above eventually wires up (CaseStudyHub, later).
 */
export interface CaseStudiesHeroSearch {
  /** Placeholder copy shown inside the search input. */
  placeholder: string;
  /** Label rendered on the search button. */
  buttonLabel: string;
  /** Controlled input value. Omit for an uncontrolled/static input. */
  value?: string;
  /** Change handler for a controlled input. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Submit handler for the surrounding form. */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export interface CaseStudiesHeroProps {
  /**
   * Main hero heading. May contain a line break (`\n`) to separate
   * the two visual lines Figma shows ("Client success," /
   * "in production") — kept as one string, not two props, so a
   * future CMS-sourced heading maps onto this prop with no shape
   * changes. Both lines render with identical styling (no eyebrow/
   * headline distinction here, unlike Blogs' "Blogs" category tag).
   */
  heading: string;
  /** Supporting description copy beneath the heading. */
  description: string;
  /** Search bar copy + optional controlled wiring. No filtering logic lives here or in SearchBar. */
  search: CaseStudiesHeroSearch;
}
