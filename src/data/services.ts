import servicesPageJson from "./servicesPage.json";
import serviceCloudPlatformEngineeringJson from "./service-cloud-platform-engineering.json";
import serviceDataEngineeringAdvancedAnalyticsJson from "./service-data-engineering-advanced-analytics.json";
import serviceAiMlEngineeringJson from "./service-ai-ml-engineering.json";
import serviceAgenticAiAgentopsJson from "./service-agentic-ai-agentops.json";
import serviceMlopsScalableMlPlatformsJson from "./service-mlops-scalable-ml-platforms.json";

export interface StandardizedSEO {
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogImage: string | null;
}

export interface StandardizedMediaObject {
  kind: string;
  src: string;
  assetKey: string | null;
  alt: string | null;
  caption: string | null;
  width?: number | null;
  height?: number | null;
}

export interface StandardizedCTAObject {
  enabled: boolean;
  label: string;
  href: string;
  external?: boolean;
  icon?: string;
  variant?: string;
}

export interface ServicesHeroData {
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  summary: string;
  authors: unknown[];
  partner: unknown | null;
  media: StandardizedMediaObject | null;
  primaryCta: StandardizedCTAObject | null;
  secondaryCta: StandardizedCTAObject | null;
}

export interface RunningTodayMetric {
  id: string;
  type: "metric" | string;
  value: string;
  label: string;
  detail: string | null;
  eyebrow?: string | null;
  description?: string | null;
}

export interface RunningTodaySectionData {
  id: string;
  heading: string;
  description: string;
  metrics: RunningTodayMetric[];
}

export interface ServicesFooterCTA {
  enabled: boolean;
  heading: string | null;
  subheading: string | null;
  partner: unknown | null;
  media?: StandardizedMediaObject | null;
  primaryCta: StandardizedCTAObject | null;
  secondaryCta: StandardizedCTAObject | null;
}

export interface ServicesPageDocument {
  schemaVersion: string;
  pageType: string;
  slug: string;
  title: string;
  seo: StandardizedSEO;
  hero: ServicesHeroData;
  sections: unknown[];
  footerCta: ServicesFooterCTA;
}

const pageData = servicesPageJson as ServicesPageDocument;

/**
 * Returns the full normalized Services Landing Page document.
 */
export function getServicesPage(): ServicesPageDocument {
  return pageData;
}

/**
 * Returns the Hero section content for the Services Landing Page.
 */
export function getServicesHero(): ServicesHeroData {
  return pageData.hero;
}

/**
 * Returns the Running Today, Across Enterprises section content.
 */
export function getRunningTodaySection(): RunningTodaySectionData {
  const section = (pageData.sections as any[]).find(
    (s) => s.id === "running-today-across-enterprises"
  );
  if (!section) {
    throw new Error(
      "Section running-today-across-enterprises not found in servicesPage.json"
    );
  }
  return {
    id: section.id,
    heading: section.data.heading ?? "Running Today, Across Enterprises",
    description: section.data.description ?? "",
    metrics: section.blocks ?? [],
  };
}

export interface HowAgivantWorksWithYouStage {
  id: string;
  title: string;
  description: string;
  callout: string;
  media: StandardizedMediaObject;
  cta?: StandardizedCTAObject | null;
}

export interface HowAgivantWorksWithYouData {
  id: string;
  heading: string;
  description: string;
  stages: HowAgivantWorksWithYouStage[];
}

/**
 * Returns the How Agivant Works With You section content.
 */
export function getHowAgivantWorksWithYouSection(): HowAgivantWorksWithYouData {
  const section = (pageData.sections as any[]).find(
    (s) => s.id === "how-agivant-works-with-you"
  );
  if (!section) {
    throw new Error(
      "Section how-agivant-works-with-you not found in servicesPage.json"
    );
  }
  return {
    id: section.id,
    heading: section.data.heading ?? "How Agivant Works With You",
    description: section.data.description ?? "",
    stages: (section.blocks ?? []).map((b: any) => ({
      id: b.id,
      title: b.title ?? "",
      description: b.body ?? "",
      callout: Array.isArray(b.items) && b.items.length > 0 ? b.items[0] : "",
      media: {
        kind: b.media?.kind ?? "image",
        src: b.media?.src ?? "",
        alt: b.media?.alt ?? "",
        assetKey: b.media?.assetKey ?? null,
        caption: null,
      },
      cta: b.cta ?? null,
    })),
  };
}

export interface AmpdStepData {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface HowYourEnterpriseGetsAmpdSectionData {
  id: string;
  heading: string;
  description?: string | null;
  steps: AmpdStepData[];
  media?: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  } | null;
}

/**
 * Returns the How your enterprise gets Amp'd section content.
 */
export function getHowYourEnterpriseGetsAmpdSection(): HowYourEnterpriseGetsAmpdSectionData {
  const section = (pageData.sections as any[]).find(
    (s) => s.id === "how-your-enterprise-gets-ampd"
  );
  if (!section) {
    throw new Error(
      "Section how-your-enterprise-gets-ampd not found in servicesPage.json"
    );
  }
  return {
    id: section.id,
    heading: section.data.heading ?? "How your enterprise gets Amp'd",
    description: section.data.description ?? "",
    steps: (section.blocks ?? []).map((b: any) => ({
      id: b.id,
      number: String(b.number ?? "").padStart(2, "0"),
      title: b.title ?? "",
      description: b.body ?? "",
    })),
  };
}

export interface WhyAgivantSectionData {
  id: string;
  data: any;
  blocks: any[];
}

/**
 * Returns the Why Agivant comparison table section content.
 */
export function getWhyAgivantSection(): WhyAgivantSectionData {
  const section = (pageData.sections as any[]).find(
    (s) => s.id === "why-agivant"
  );
  if (!section) {
    throw new Error("Section why-agivant not found in servicesPage.json");
  }
  return {
    id: section.id,
    data: section.data,
    blocks: section.blocks ?? [],
  };
}

export const servicesHeroData = pageData.hero;
export const servicesFooterCta = pageData.footerCta;

import type {
  ServiceDetailHeroData,
  ServiceDetailPageDocument,
} from "@/types/serviceDetail";

export type { ServiceDetailHeroData, ServiceDetailPageDocument };

const SERVICE_PAGES: Record<string, ServiceDetailPageDocument> = {
  "cloud-platform-engineering": serviceCloudPlatformEngineeringJson as ServiceDetailPageDocument,
  "data-engineering-advanced-analytics": serviceDataEngineeringAdvancedAnalyticsJson as ServiceDetailPageDocument,
  "ai-ml-engineering": serviceAiMlEngineeringJson as ServiceDetailPageDocument,
  "agentic-ai-agentops": serviceAgenticAiAgentopsJson as ServiceDetailPageDocument,
  "mlops-scalable-ml-platforms": serviceMlopsScalableMlPlatformsJson as ServiceDetailPageDocument,
};

export function getServicePage(slug: string): ServiceDetailPageDocument | null {
  return SERVICE_PAGES[slug] ?? null;
}

export function getAllServiceSlugs(): string[] {
  return Object.keys(SERVICE_PAGES);
}

export const canonicalServiceProofSection = (
  serviceCloudPlatformEngineeringJson.sections as any[]
).find((s) => s.id === "client-success-production");



