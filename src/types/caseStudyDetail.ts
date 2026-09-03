/**
 * Types for Case Study Detail Pages (/case-studies/[slug]).
 *
 * Represents the JSON schema contract defined by the senior backend developer (case_study_single.json).
 * Content lives exclusively in JSON — this file defines schema types only without duplicated content.
 */

export interface CaseStudyMediaObject {
  kind: "image" | "video" | "diagram" | "logo";
  src: string | null;
  assetKey: string | null;
  alt: string | null;
  caption: string | null;
}

export interface CaseStudyCTAObject {
  enabled: boolean;
  label: string | null;
  href: string | null;
  external: boolean;
}

export interface CaseStudySEO {
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogImage: string | null;
}

export interface CaseStudyHero {
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  summary: string | null;
  authors: string[];
  partner: unknown | null;
  media: CaseStudyMediaObject;
  primaryCta: CaseStudyCTAObject | null;
  secondaryCta: CaseStudyCTAObject | null;
}

export interface CaseStudySectionBlock {
  id: string;
  type: "card" | "richText" | "metric" | "media" | string;
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  media?: CaseStudyMediaObject | null;
  cta?: CaseStudyCTAObject | null;
  items?: string[];
  heading?: string | null;
  value?: string | null;
  label?: string | null;
  detail?: string | null;
  description?: string | null;
}

export interface CaseStudySectionData {
  eyebrow: string | null;
  heading: string | null;
  description: string | null;
  columns: unknown[];
  media: CaseStudyMediaObject | null;
  cta: CaseStudyCTAObject | null;
  primaryCta?: CaseStudyCTAObject | null;
  secondaryCta?: CaseStudyCTAObject | null;
}

export interface CaseStudySection {
  id: string;
  type:
    | "checklist"
    | "card_grid"
    | "rich_text"
    | "stats"
    | "architecture_diagram"
    | string;
  enabled: boolean;
  conditions: Record<string, unknown> | null;
  data: CaseStudySectionData;
  blocks: CaseStudySectionBlock[];
}

export interface CaseStudyFooterCTA {
  enabled: boolean;
  heading: string;
  subheading: string | null;
  partner: unknown | null;
  primaryCta: CaseStudyCTAObject | null;
  secondaryCta: CaseStudyCTAObject | null;
}

export interface CaseStudyThumbnail {
  media: CaseStudyMediaObject;
}

export interface CaseStudyDetailPage {
  schemaVersion: "1.0" | string;
  pageType: "caseStudy";
  slug: string;
  title: string;
  seo: CaseStudySEO;
  hero: CaseStudyHero;
  thumbnail: CaseStudyThumbnail;
  industry: string;
  capability: string;
  techPlatform: string;
  sections: CaseStudySection[];
  footerCta: CaseStudyFooterCTA;
  showFooter?: boolean;
}
