import ampdPageJson from "./ampdPage.json";
import type {
  StandardizedSEO,
  StandardizedMediaObject,
  StandardizedCTAObject,
  ServicesFooterCTA,
} from "./services";

/**
 * data/ampd.ts
 *
 * Loader for the Amp'd landing page (/ampd). Content lives in
 * `ampdPage.json`, which follows the same standardized page envelope as
 * `servicesPage.json` (seo / hero / sections / footerCta); the shared
 * contract types are reused from `data/services.ts`.
 */

export interface AmpdHeroData {
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  summary: string | null;
  authors: unknown[];
  partner: unknown | null;
  media: StandardizedMediaObject | null;
  primaryCta: StandardizedCTAObject | null;
  secondaryCta: StandardizedCTAObject | null;
}

/** Standard section envelope (id / type / enabled / data / blocks). */
export interface AmpdSection {
  id: string;
  type: string;
  enabled: boolean;
  conditions: unknown | null;
  data: {
    eyebrow: string | null;
    heading: string | null;
    /** Optional line under the heading. */
    subheading?: string | null;
    description: string | null;
    columns: unknown[];
    media: (StandardizedMediaObject & { poster?: string | null }) | null;
    cta: StandardizedCTAObject | null;
  };
  blocks: unknown[];
}

/** Media object whose `src` may be empty until the asset is supplied. */
export type AmpdOptionalMedia = Omit<StandardizedMediaObject, "src"> & {
  src: string | null;
};

/**
 * One item inside a `tab` block (section type `tabs`). `type` decides the
 * renderer: numberedItem → spec cards, tag → role pills, card → image cards,
 * embed → same-origin HTML embed, section → another page section by `id`,
 * image → panel illustration, feature → icon cards.
 */
export interface AmpdTabItem {
  id: string;
  type: "numberedItem" | "tag" | "card" | "embed" | "section" | "image" | "feature";
  number?: number;
  title: string | null;
  body?: string | null;
  media?: AmpdOptionalMedia | null;
}

/** One tab of a `tabs` section: tab card (title + media) and its panel content. */
export interface AmpdTabBlock {
  id: string;
  type: "tab";
  eyebrow: string | null;
  title: string;
  heading: string | null;
  body: string | null;
  media: AmpdOptionalMedia | null;
  cta: StandardizedCTAObject | null;
  items: AmpdTabItem[];
}

export interface AmpdPageDocument {
  schemaVersion: string;
  pageType: string;
  slug: string;
  title: string;
  seo: StandardizedSEO;
  hero: AmpdHeroData;
  sections: AmpdSection[];
  footerCta: ServicesFooterCTA;
}

export function getAmpdPage(): AmpdPageDocument {
  return ampdPageJson as unknown as AmpdPageDocument;
}

/** Returns an enabled section by id, if present. */
export function getAmpdSection(id: string): AmpdSection | undefined {
  return getAmpdPage().sections.find((s) => s.id === id && s.enabled);
}
