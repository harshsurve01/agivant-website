import type { ArticleHeroProps } from "./Hero";
import type { ExecutiveBriefProps } from "./ExecutiveBrief";
import type { Phase1Props } from "./Phase1";
import type { Phase2Props } from "./Phase2";
import type { Phase3Props } from "./Phase3";
import type { Phase4Props } from "./Phase4";
import type { ConclusionProps } from "./Conclusion";

/**
 * Full data contract for one Blog Inner article, owned by the
 * Article section wrapper — not by any individual section inside
 * it. Same role BlogsPageData plays for the Blogs page. Conclusion
 * is the final section in this contract, per the task that added it.
 */
export interface ArticlePageData {
  hero: ArticleHeroProps;
  executiveBrief: ExecutiveBriefProps;
  phase1: Phase1Props;
  phase2: Phase2Props;
  phase3: Phase3Props;
  phase4: Phase4Props;
  conclusion: ConclusionProps;
}
