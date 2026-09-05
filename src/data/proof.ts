/**
 * data/proof.ts
 *
 * CMS-ready data access layer for the "Proof Beyond The Pilot" section.
 * Content resides exclusively in `src/data/proof.json`.
 * No hardcoded copy or mock data belongs in this file.
 */

import homepageJson from "./homepage.json";

const proofSection = homepageJson.sections.find(
  (s) => s.id === "proof-beyond-the-pilot"
)!;

export interface CaseStudy {
  id: string;
  industry: string;
  title: string;
  description: string;
  metric?: string;
  metricLabel?: string;
  footer?: string;
  href?: string;
  image: {
    src: string;
    alt: string;
  };
  theme?: string;
}

export interface ProofHeaderContent {
  heading: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
}

export interface ProofSectionData {
  header: ProofHeaderContent;
  caseStudies: CaseStudy[];
}

/**
 * Returns header data for the Homepage Proof section.
 */
export async function getProofHeader(): Promise<ProofHeaderContent> {
  return {
    heading: proofSection.data.heading ?? "",
    description: proofSection.data.description ?? "",
    cta: {
      label: proofSection.data.cta?.label ?? "",
      href: proofSection.data.cta?.href ?? "",
    },
  };
}

/**
 * Returns all Case Studies configured in `homepage.json`.
 */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  return (proofSection.blocks ?? []).map((block: any) => {
    const items = block.items ?? [];
    return {
      id: block.id,
      industry: block.eyebrow,
      title: block.title,
      description: block.body,
      metric: items[0] || undefined,
      metricLabel: items[1] || undefined,
      footer: items[2] || undefined,
      href: block.cta?.href,
      image: {
        src: block.media?.src,
        alt: block.media?.alt,
      },
      theme: "default",
    };
  });
}

/**
 * Returns both header and case studies bundle for the Proof section.
 */
export async function getProofData(): Promise<ProofSectionData> {
  const [header, caseStudies] = await Promise.all([
    getProofHeader(),
    getCaseStudies(),
  ]);
  return { header, caseStudies };
}
