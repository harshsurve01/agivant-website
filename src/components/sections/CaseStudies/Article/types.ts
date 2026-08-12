import type { CaseStudyArticleHeroProps } from "./Hero";
import type { ObjectivesProps } from "./Objectives";
import type { SolutionProps } from "./Solution";
import type { TechnologyProps } from "./Technology";
import type { OutcomeProps } from "./Outcome";
import type { ArchitectureProps } from "./Architecture";

/**
 * Full data contract for one Case Study Inner page, owned by the
 * Article section wrapper — not by any individual section inside it.
 * Same role ArticlePageData plays for the Blog Inner page.
 *
 * `hero`, `objectives`, `solution`, `technology`, `outcome`, and
 * `architecture` exist now, per this pass's explicit scope (Hero,
 * then Objectives, then Solution, then Technology, then Outcome, then
 * Architecture — nothing after Architecture yet). Adding the next
 * section later means adding a field here and a child render in
 * Article.tsx, not touching app/case-studies/[slug]/page.tsx.
 */
export interface CaseStudyArticlePageData {
  hero: CaseStudyArticleHeroProps;
  objectives: ObjectivesProps;
  solution: SolutionProps;
  technology: TechnologyProps;
  outcome: OutcomeProps;
  architecture: ArchitectureProps;
}
