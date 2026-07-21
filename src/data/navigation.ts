/**
 * data/navigation.ts
 *
 * Mock data source for the Header's primary navigation. Shaped as an
 * async getter — not a static export — for the same reason as
 * getAnnouncement(): swapping this file's internals for a real
 * Headless WordPress menu fetch later requires zero changes to Header.tsx.
 *
 * Today: resolves instantly with hardcoded mock data.
 * Later:  will `fetch()` a WordPress REST/GraphQL endpoint (e.g. the
 *         WP menus API) and return the same shape.
 */

export interface NavigationItem {
  /** Stable unique key for list rendering. */
  id: string;
  /** Visible link text. */
  label: string;
  /** Link destination. */
  href: string;
}

const mockNavigation: NavigationItem[] = [
  { id: "what-we-build", label: "What We Build", href: "/what-we-build" },
  { id: "client-success", label: "Client Success", href: "/client-success" },
  { id: "agent-library", label: "Agent Library", href: "/agent-library" },
  { id: "resources", label: "Resources", href: "/resources" },
  { id: "careers", label: "Careers", href: "/careers" },
  { id: "about-us", label: "About Us", href: "/about" },
];

/**
 * Returns the current primary navigation items.
 *
 * Async by design: Header already awaits this, so replacing the body
 * below with a real WordPress menu fetch is a change confined entirely
 * to this file.
 */
export async function getNavigation(): Promise<NavigationItem[]> {
  return mockNavigation;
}
