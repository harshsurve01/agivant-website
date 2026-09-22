import type {
  StandardizedSEO,
  StandardizedMediaObject,
  StandardizedCTAObject,
  ServicesFooterCTA,
  RunningTodayMetric,
} from "@/data/services";

export interface ServiceDetailHeroData {
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

export type ServiceDetailMetricBlock = RunningTodayMetric;

export interface ServiceDetailSectionData {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  columns?: unknown[];
  media?: StandardizedMediaObject | null;
  cta?: StandardizedCTAObject | null;
  tags?: string[];
}

export interface ServiceDetailSection {
  id: string;
  type: string;
  enabled: boolean;
  conditions?: unknown | null;
  data: ServiceDetailSectionData;
  blocks?: ServiceDetailMetricBlock[];
}

export interface ServiceDetailPageDocument {
  schemaVersion: string;
  pageType: string;
  slug: string;
  title: string;
  seo: StandardizedSEO;
  hero: ServiceDetailHeroData;
  sections: ServiceDetailSection[];
  footerCta: ServicesFooterCTA;
}
