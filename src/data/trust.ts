/**
 * data/trust.ts
 *
 * CMS-ready data access layer for the Homepage Trust section.
 * Content resides exclusively in `src/data/homepage.json` under `trust-enterprise-grade`.
 * No hardcoded copy belongs in this file.
 */

import homepageJson from "./homepage.json";

export interface TrustCardData {
  id: string;
  title: string;
  description: string;
  badge: string;
  accentColor: string;
}

// Runtime animation accent colors for GSAP ambient glow interpolation in TrustAnimation
const TRUST_ANIMATION_ACCENT_COLORS: Record<string, string> = {
  "global-enterprise-trust": "#7C3AED",
  "ai-native-since-day-1": "#2563EB",
  "hyperscaler-partner-ecosystem": "#0D9488",
};

/**
 * Returns the ordered set of cards in the Trust stack.
 */
export async function getTrustCards(): Promise<TrustCardData[]> {
  const section = homepageJson.sections.find(
    (s) => s.id === "trust-enterprise-grade"
  );
  if (!section) return [];

  return (section.blocks as any[]).map((block) => ({
    id: block.id,
    title: block.title ?? "",
    description: block.body ?? "",
    badge: block.eyebrow ?? "",
    accentColor:
      TRUST_ANIMATION_ACCENT_COLORS[block.id] ?? "#7C3AED",
  }));
}