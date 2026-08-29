import solutionPageData from "./solutionPage.json";

export interface SolutionMedia {
  kind: string;
  src: string | null;
  assetKey: string | null;
  alt: string | null;
  caption: string | null;
}

export interface SolutionHero {
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  summary: string | null;
  authors: string[];
  partner: unknown | null;
  media: SolutionMedia | null;
  primaryCta: unknown | null;
  secondaryCta: unknown | null;
}

export interface SolutionSectionBlock {
  id: string;
  type: string;
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  media?: SolutionMedia | null;
  cta?: { label?: string; href?: string } | null;
  items?: string[];
  cells?: string[];
}

export interface SolutionSectionData {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  closingStatement?: string | null;
  columns?: string[];
  media?: SolutionMedia | null;
  cta?: { label?: string; href?: string } | null;
}

export interface SolutionSection {
  id: string;
  type: string;
  enabled: boolean;
  conditions: Record<string, unknown> | null;
  data: SolutionSectionData;
  blocks: SolutionSectionBlock[];
  closingStatement?: string | null;
}

export interface SolutionPage {
  schemaVersion: string;
  pageType: string;
  slug: string;
  title: string;
  seo: {
    title: string | null;
    description: string | null;
    canonical: string | null;
    ogImage: string | null;
  };
  hero: SolutionHero;
  sections: SolutionSection[];
  footerCta: unknown;
}

const solutionPages: SolutionPage[] = (
  Array.isArray(solutionPageData) ? solutionPageData : [solutionPageData]
) as unknown as SolutionPage[];

export function getAllSolutionPages(): SolutionPage[] {
  return solutionPages;
}

export function getAllSolutionSlugs(): string[] {
  return solutionPages.map((page) => page.slug);
}

export function getSolutionPage(slug: string): SolutionPage | null {
  return solutionPages.find((page) => page.slug === slug) ?? null;
}

export function getSolutionSection(
  sectionId: string,
  slug?: string
): SolutionSection | undefined {
  const page = slug ? getSolutionPage(slug) : solutionPages[0];
  return page?.sections.find(
    (section) => section.id === sectionId && section.enabled
  );
}

export { solutionPages as solutionPageData };
export default solutionPages;
