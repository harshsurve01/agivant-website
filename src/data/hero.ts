/**
 * data/hero.ts
 *
 * Mock data source for the Hero section. Shaped as an async getter —
 * not a static export — for the same reason as getAnnouncement() and
 * getNavigation(): swapping this file's internals for a real Headless
 * WordPress fetch later requires zero changes to Hero.tsx.
 *
 * Today: resolves instantly with hardcoded mock data.
 * Later:  will `fetch()` a WordPress REST/GraphQL endpoint (e.g. an
 *         ACF page-builder field group) and return the same shape.
 */

export interface HeroData {
  title: {
    /** Text before the highlighted asset (e.g. "Agivant launches"). */
    prefix: string;
    /** Accessible label for the inline brand asset — not an image path. */
    highlightedAsset: string;
    /** Text after the highlighted asset, before the rotating word. */
    suffix: string;
  };
  /**
   * Candidate words/phrases for the bolded final line of the heading.
   * Only rotatingWords[0] is rendered in this iteration — word rotation
   * itself is a future GSAP feature, not implemented here.
   */
  rotatingWords: string[];
  /** Bold lead-in line above the description (Figma: Poppins Medium, 40px). */
  tagline: string;
  /** Regular-weight supporting line (Figma: Poppins Regular, 24px). */
  description: string;
  primaryCTA: {
    label: string;
    href: string;
  };
  secondaryCTA: {
    label: string;
    href: string;
  };
}

const mockHero: HeroData = {
  title: {
    prefix: "Agivant launches",
    highlightedAsset: "Amp'd",
    suffix: "to make enterprise AI deliver",
  },
  rotatingWords: [
    "real business value",
    "measurable ROI",
    "faster time to market",
    "seamless automation",
  ],
  tagline: "Architecting the autonomous agentic enterprise",
  description:
    "Engineering the systems that make your data, cloud, AI, and agents work as one.",
  primaryCTA: {
    label: "How Amp'd delivers real value",
    href: "/amp-d",
  },
  secondaryCTA: {
    label: "See client success in action",
    href: "/client-success",
  },
};

/**
 * Returns the current hero content.
 *
 * Async by design: Hero already awaits this, so replacing the body
 * below with a real WordPress fetch is a change confined entirely to
 * this file.
 */
export async function getHero(): Promise<HeroData> {
  return mockHero;
}