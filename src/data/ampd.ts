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
    description: string | null;
    columns: unknown[];
    media: (StandardizedMediaObject & { poster?: string | null }) | null;
    cta: StandardizedCTAObject | null;
  };
  blocks: unknown[];
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
