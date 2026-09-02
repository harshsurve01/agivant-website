/**
 * data/hero.ts
 *
 * Single source of truth for Hero content following AGIVANT_JSON_DATA_RULEBOOK.md.
 * Async getter signature for seamless future Headless WordPress fetch integration.
 */

export interface HeroBackgroundData {
  kind: "image" | "video";
  src: string;
  poster?: string;
  alt?: string;
}

export interface AmpdAnimationData {
  src?: string | null;
  alt: string;
  fallbackImage?: string;
}

export interface HeroCtaData {
  enabled: boolean;
  label: string;
  href: string;
  external?: boolean;
}

export interface HeroData {
  heading: string;
  announcement: {
    prefix: string;
    ampdAnimation: AmpdAnimationData;
    suffix: string;
  };
  background: HeroBackgroundData;
  primaryCta: HeroCtaData;
  secondaryCta: HeroCtaData;
}

const mockHero: HeroData = {
  heading: "Architecting the autonomous agentic enterprise",
  announcement: {
    prefix: "Agivant launches",
    ampdAnimation: {
      src: null,
      alt: "Amp'd",
      fallbackImage: "/images/hero/ampd-wordmark.svg",
    },
    suffix: "to accelerate enterprise AI value",
  },
  background: {
    kind: "image",
    src: "/images/hero/hero-vid-img.png",
    alt: "Abstract translucent glass wave background",
  },
  primaryCta: {
    enabled: true,
    label: "See client success in action",
    href: "/client-success",
    external: false,
  },
  secondaryCta: {
    enabled: true,
    label: "How Amp'd delivers real value",
    href: "/amp-d",
    external: false,
  },
};

/**
 * Returns the current hero content.
 */
export async function getHero(): Promise<HeroData> {
  return mockHero;
}