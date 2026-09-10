import { getAllSolutionPages, type SolutionPage } from "./solutionPage";
import solutionsData from "./solutions.json";
import type { SolutionHeroProps } from "@/components/sections/Solutions/Article/Hero/types";

export interface SolutionsLandingPageDocument {
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
  hero: {
    eyebrow: string | null;
    title: string;
    subtitle: string | null;
    summary: string | null;
    authors: unknown[];
    partner: unknown | null;
    media: {
      kind: string;
      src: string;
      assetKey: string | null;
      alt: string | null;
      caption: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
    primaryCta: unknown | null;
    secondaryCta: unknown | null;
  };
  sections: unknown[];
  footerCta: {
    enabled: boolean;
    heading: string;
    subheading: string | null;
    partner: unknown | null;
    primaryCta: {
      enabled: boolean;
      label: string;
      href: string;
      external: boolean;
    } | null;
    secondaryCta: {
      enabled: boolean;
      label: string;
      href: string;
      external: boolean;
    } | null;
  };
}

const pageData = solutionsData as SolutionsLandingPageDocument;

export const solutionsHero: SolutionHeroProps = {
  heading: pageData.hero.title,
  description: pageData.hero.summary ?? "",
  media: pageData.hero.media,
};

export const solutionsFooterCta = pageData.footerCta;

export function getSolutionsPage(): SolutionsLandingPageDocument {
  return pageData;
}

export interface SolutionHubItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  expectedThumbnail: string;
  category?: string | null;
  domain?: string | null;
  domains?: string[];
  href: string;
}

export const SOLUTION_CATEGORIES = [
  "Sales Acceleration",
  "Client Platforms",
  "Partner-Led IP",
] as const;

export const SOLUTION_DOMAINS = [
  "AI Governance",
  "Hardware & Silicon Engineering",
  "Contracts & Legal Intelligence",
  "Underwriting & Claims",
  "Fraud, Risk & Compliance",
  "Commerce",
  "Customer Intelligence & Acquisition",
  "Marketing Intelligence",
  "Sales & CPQ",
  "Procurement, Sourcing & FinOps",
  "Data Annotation & AI Alignment",
  "Delivery & Portfolio Governance",
] as const;

/**
 * Normalizes title to expected thumbnail filename using the first two words:
 * firstword-secondword-image.png
 */
export function getThumbnailFilename(title: string): string {
  const words = title.trim().split(/\s+/);
  const twoWords = words.slice(0, 2);
  const cleaned = twoWords
    .map((w) => w.toLowerCase().replace(/[^a-z0-9-]/g, ""))
    .filter(Boolean);
  const base = cleaned.join("-");
  return `${base}-image.png`;
}

/**
 * Maps all existing Solution Single Pages into lightweight Hub cards.
 */
export function getSolutionHubItems(): SolutionHubItem[] {
  const pages = getAllSolutionPages();
  return pages.map((page) => {
    const cardTitle = page.cardTitle || page.title;
    const filename = getThumbnailFilename(cardTitle);
    const expectedPath = `/images/solutions/${filename}`;
    const fallbackPath = "/images/solutions/thumbnail.png";
    const customThumbnail = page.cardThumbnail;

    return {
      id: page.slug,
      slug: page.slug,
      title: cardTitle,
      description: page.hero.summary ?? "",
      thumbnail: customThumbnail || fallbackPath,
      expectedThumbnail: expectedPath,
      category: page.category ?? null,
      domain: page.domain ?? null,
      domains: page.domain ? [page.domain] : [],
      href: `/solutions/${page.slug}`,
    };
  });
}
