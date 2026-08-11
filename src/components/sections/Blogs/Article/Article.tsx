import { Hero } from "./Hero";
import { ExecutiveBrief } from "./ExecutiveBrief";
import { Phase1 } from "./Phase1";
import { Phase2 } from "./Phase2";
import { Phase3 } from "./Phase3";
import { Phase4 } from "./Phase4";
import { Conclusion } from "./Conclusion";
import type { ArticlePageData } from "./types";

/**
 * Article
 *
 * Orchestrates the Blog Inner (/blogs/[slug]) page content, same
 * role Blogs.tsx plays for the Blogs page: it is the only thing
 * app/blogs/[slug]/page.tsx renders, and it is the only thing that
 * knows which sections make up an article and in what order.
 * page.tsx never imports Hero, ExecutiveBrief, Phase1, Phase2,
 * Phase3, Phase4, or any later section directly — everything flows
 * through here.
 *
 * Currently renders Hero, ExecutiveBrief, Phase1, Phase2, Phase3,
 * Phase4, and Conclusion. Conclusion is the final Article section —
 * per the task that added it, no further sections follow.
 *
 * Server Component: no "use client", no hooks, no state, no data
 * imports. Data arrives entirely through props from page.tsx.
 */
export function Article({
  hero,
  executiveBrief,
  phase1,
  phase2,
  phase3,
  phase4,
  conclusion,
}: ArticlePageData) {
  return (
    <>
      <Hero {...hero} />
      <ExecutiveBrief {...executiveBrief} />
      <Phase1 {...phase1} />
      <Phase2 {...phase2} />
      <Phase3 {...phase3} />
      <Phase4 {...phase4} />
      <Conclusion {...conclusion} />
    </>
  );
}
