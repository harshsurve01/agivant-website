/**
 * data/hero.ts
 *
 * CMS-ready data access layer for the Homepage Hero section.
 * Content resides exclusively in `src/data/homepage.json` under `hero` following AGIVANT_JSON_DATA_RULEBOOK.md.
 * No hardcoded copy or mock data belongs in this file.
 */

import homepageJson from "./homepage.json";

export interface HeroBackgroundData {
  kind: "image" | "video";
  src: string;
  assetKey?: string | null;
  poster?: string;
  alt?: string;
  caption?: string | null;
}

export interface AmpdAnimationData {
  kind?: string;
  src?: string | null;
  assetKey?: string | null;
  fallbackImage?: string;
  alt: string;
  caption?: string | null;
}

export interface HeroCtaData {
  enabled: boolean;
  label: string;
  href: string;
  external?: boolean;
}

export interface HeroAnnouncementData {
  text: string;
  media: AmpdAnimationData;
}

export interface HeroData {
  heading: string;
  announcement: HeroAnnouncementData;
  background: HeroBackgroundData;
  primaryCta: HeroCtaData;
  secondaryCta: HeroCtaData;
}

/**
 * Returns the current hero content from homepage.json.
 */
export async function getHero(): Promise<HeroData> {
  const { hero } = homepageJson;
  return {
    heading: hero.heading,
    announcement: {
      text: hero.announcement.text,
      media: {
        kind: hero.announcement.media.kind,
        src: hero.announcement.media.src,
        assetKey: hero.announcement.media.assetKey,
        fallbackImage: hero.announcement.media.fallbackImage,
        alt: hero.announcement.media.alt,
        caption: hero.announcement.media.caption,
      },
    },
    background: {
      kind: hero.background.kind as "image" | "video",
      src: hero.background.src,
      assetKey: hero.background.assetKey,
      alt: hero.background.alt,
      caption: hero.background.caption,
    },
    primaryCta: {
      enabled: hero.primaryCta.enabled,
      label: hero.primaryCta.label,
      href: hero.primaryCta.href,
      external: hero.primaryCta.external,
    },
    secondaryCta: {
      enabled: hero.secondaryCta.enabled,
      label: hero.secondaryCta.label,
      href: hero.secondaryCta.href,
      external: hero.secondaryCta.external,
    },
  };
}