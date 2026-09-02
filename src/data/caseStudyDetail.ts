import caseStudyJson from "./case-study.json";
import dummyCaseStudyJson from "./case-study-dummy.json";
import multiBrandCaseStudyJson from "./case-study-multi-brand.json";
import type { CaseStudyDetailPage } from "@/types/caseStudyDetail";

const realCaseStudy: CaseStudyDetailPage = caseStudyJson as unknown as CaseStudyDetailPage;
const dummyCaseStudy: CaseStudyDetailPage = dummyCaseStudyJson as unknown as CaseStudyDetailPage;
const multiBrandCaseStudy: CaseStudyDetailPage = multiBrandCaseStudyJson as unknown as CaseStudyDetailPage;

/**
 * Single source of truth collection of all individual Case Studies.
 */
export const allCaseStudies: CaseStudyDetailPage[] = [
  realCaseStudy,
  dummyCaseStudy,
  multiBrandCaseStudy,
];

/**
 * Case Study detail registry by canonical slug.
 */
const CASE_STUDIES_DATA: Record<string, CaseStudyDetailPage> = {
  [realCaseStudy.slug]: realCaseStudy,
  [dummyCaseStudy.slug]: dummyCaseStudy,
  [multiBrandCaseStudy.slug]: multiBrandCaseStudy,
};

/**
 * Resolves a Case Study by its canonical slug.
 */
export async function getCaseStudyDetail(
  slug: string
): Promise<CaseStudyDetailPage | null> {
  return CASE_STUDIES_DATA[slug] ?? null;
}

/**
 * Returns all available Case Study canonical slugs for static generation.
 */
export function getAllCaseStudyDetailSlugs(): string[] {
  return Object.keys(CASE_STUDIES_DATA);
}

/**
 * Returns the complete collection of all individual Case Studies.
 */
export function getAllCaseStudies(): CaseStudyDetailPage[] {
  return allCaseStudies;
}
