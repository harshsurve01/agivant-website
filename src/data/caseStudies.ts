import type { CaseStudiesHeroProps } from "@/components/sections/CaseStudies/Hero";
import caseStudiesData from "./caseStudies.json";
import { allCaseStudies } from "./caseStudyDetail";

export const caseStudiesHero: CaseStudiesHeroProps = {
  heading: caseStudiesData.hero.title.replace(/<br\s*\/?>/gi, "\n"),
  description: caseStudiesData.hero.summary ?? "",
  search: {
    placeholder: "Search by industry, capability or platform",
    buttonLabel: "Search",
  },
};

/* ==========================================================================
   CaseStudyHub data & Page-Level Access
   Content is sourced from `src/data/caseStudies.json`.
   Inner page data belongs exclusively to `case-study.json` via `caseStudyDetail.ts`.
   ========================================================================== */

export interface CaseStudyMedia {
  kind: string;
  src: string | null;
  assetKey: string | null;
  alt: string | null;
  caption: string | null;
}

export interface CaseStudyCTA {
  enabled: boolean;
  label: string | null;
  href: string | null;
  external: boolean;
}

export interface CaseStudyRecord {
  id: string;
  type: string;
  slug: string;
  title: string;
  body: string | null;
  media: CaseStudyMedia;
  industry: string;
  capability: string;
  techPlatform: string;
  cta?: CaseStudyCTA;
  items?: string[];
}

export interface CaseStudyImage {
  src: string;
  alt: string;
}

/**
 * Full case-study record for the Hub presentation layer.
 * Deliberately minimal — every field here is one visibly required by the
 * Figma card or filter panel:
 *  - slug/title/image/industry/capability: rendered on the card
 *  - techPlatform: required for the Tech Platform filter
 */
export interface CaseStudy {
  id?: string;
  slug: string;
  title: string;
  thumbnail?: {
    media: CaseStudyMedia;
  };
  image: CaseStudyImage;
  industry: string;
  capability: string;
  techPlatform: string;
  cta?: CaseStudyCTA;
}

export interface FilterOptionConfig {
  value: string;
  label: string;
}

export interface FilterGroupConfig {
  id: "industry" | "capability" | "techPlatform";
  title: string;
  options: FilterOptionConfig[];
}

export interface CaseStudiesFooterCTA {
  enabled: boolean;
  heading: string;
  subheading: string | null;
  partner: unknown | null;
  primaryCta: CaseStudyCTA | null;
  secondaryCta: CaseStudyCTA | null;
}

export const caseStudiesFooterCta: CaseStudiesFooterCTA =
  caseStudiesData.footerCta;

/**
 * Adapts individual Case Study JSON records from the single-source-of-truth
 * collection to the presentation model consumed by CaseStudyCard and CaseStudyHub.
 */
export const caseStudies: CaseStudy[] = allCaseStudies.map((cs) => ({
  id: cs.slug,
  slug: cs.slug,
  title: cs.title,
  thumbnail: cs.thumbnail,
  image: {
    src: cs.thumbnail?.media?.src ?? "",
    alt: cs.thumbnail?.media?.alt ?? cs.title,
  },
  industry: cs.industry,
  capability: cs.capability,
  techPlatform: cs.techPlatform,
  cta: {
    enabled: true,
    label: "Read case study",
    href: `/case-studies/${cs.slug}`,
    external: false,
  },
}));

/**
 * Filter group + option labels — exact per the brief. Options carry
 * no counts here: CaseStudyHub computes real counts from whatever
 * `caseStudies` array it's given, rather than hardcoding Figma's mock
 * counts (2, 3, 2, 3, 2...), which are static design-file numbers
 * that don't correspond to the 6 identical mock records above and
 * would go stale the moment real WordPress data replaces them.
 */
export const caseStudyFilterGroups: FilterGroupConfig[] = [
  {
    id: "industry",
    title: "Industry Segment",
    options: [
      { value: "BFSI", label: "BFSI" },
      { value: "Healthcare", label: "Healthcare" },
      { value: "Retail & E-commerce", label: "Retail & E-commerce" },
      { value: "Logistics", label: "Logistics" },
      { value: "Manufacturing", label: "Manufacturing" },
    ],
  },
  {
    id: "capability",
    title: "Core Capability",
    options: [
      { value: "Agentic AI Systems", label: "Agentic AI Systems" },
      { value: "Physical AI & Automation", label: "Physical AI & Automation" },
      {
        value: "UX Strategy & Design Systems",
        label: "UX Strategy & Design Systems",
      },
      { value: "AIOps & Cloud", label: "AIOps & Cloud" },
      { value: "MLOps & Data Engineering", label: "MLOps & Data Engineering" },
    ],
  },
  {
    id: "techPlatform",
    title: "Tech Platform",
    options: [
      { value: "Python", label: "Python" },
      { value: "OpenAI/Anthropic APIs", label: "OpenAI/Anthropic APIs" },
      { value: "React/Node.js", label: "React/Node.js" },
      { value: "PyTorch/TensorFlow", label: "PyTorch/TensorFlow" },
      { value: "AWS/Azure/GCP", label: "AWS/Azure/GCP" },
    ],
  },
];

/**
 * Returns all Case Studies for the Hub.
 */
export function getCaseStudies(): CaseStudy[] {
  return caseStudies;
}

/**
 * Looks up one Case Study by its canonical slug from the Hub dataset.
 */
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((item) => item.slug === slug);
}

/**
 * Returns the complete Case Studies landing page document.
 */
export function getCaseStudiesPage() {
  return caseStudiesData;
}
