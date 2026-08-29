import type { CaseStudyDetailPage } from "@/types/caseStudyDetail";
import type { CaseStudyArticleHeroProps } from "./Hero";
import type { ObjectivesProps } from "./Objectives";
import type { SolutionProps } from "./Solution";
import type { TechnologyProps } from "./Technology";
import type { OutcomeProps } from "./Outcome";
import type { ArchitectureProps } from "./Architecture";

export interface ArticleDataProps {
  data: CaseStudyDetailPage;
}

export type ArticleProps = ArticleDataProps | CaseStudyArticlePageData;

/**
 * Legacy data contract preserved for compatibility.
 */
export interface CaseStudyArticlePageData {
  hero: CaseStudyArticleHeroProps;
  objectives: ObjectivesProps;
  solution: SolutionProps;
  technology: TechnologyProps;
  outcome: OutcomeProps;
  architecture: ArchitectureProps;
}

