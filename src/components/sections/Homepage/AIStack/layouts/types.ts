/**
 * layouts/types.ts
 *
 * Shared prop shape for every AIStack layout component. Split into its
 * own file (rather than living in layouts/index.ts) specifically to
 * avoid a circular import: index.ts imports every layout component,
 * and every layout component needs this type — if the type lived in
 * index.ts, each layout would have to import back from the file that
 * imports it.
 *
 * This is the ONLY thing layouts receive. No hover state, no pointer
 * data, no ref — those belong to AIStackCardShell and never cross
 * into layout territory.
 */
export interface AIStackLayoutProps {
  title: string;
  description: string;
  backgroundImage: string;
  accentColor: string;
  /**
   * CSS object-position value (e.g. "bottom", "top right"). Optional —
   * each layout defines its own sensible default for where its ribbon
   * art sits, and this only overrides that default.
   */
  ribbonPosition?: string;
}
