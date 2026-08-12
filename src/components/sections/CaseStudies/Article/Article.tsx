import { Hero } from "./Hero";
import { Objectives } from "./Objectives";
import { Solution } from "./Solution";
import { Technology } from "./Technology";
import { Outcome } from "./Outcome";
import { Architecture } from "./Architecture";
import type { CaseStudyArticlePageData } from "./types";

/**
 * Article (Case Study Inner Page)
 *
 * Orchestrates the Case Study Inner (/case-studies/[slug]) page
 * content, same role the Blogs Article component plays for
 * /blogs/[slug]: it is the only thing app/case-studies/[slug]/
 * page.tsx renders, and it is the only thing that knows which
 * sections make up a case study article and in what order.
 * page.tsx never imports Hero, Objectives, Solution, Technology,
 * Outcome, or any later section directly — everything flows through
 * here.
 *
 * Renders Hero, then Objectives, then Solution, then Technology, then
 * Outcome, then Architecture (the Data Sources workflow diagram) —
 * the final section per this brief's explicit scope. Nothing after
 * Architecture (Conclusion, a closing CTA, etc.) is implemented yet —
 * when it lands, it's added as a sibling here, and as a new field on
 * CaseStudyArticlePageData, with no change required to page.tsx.
 *
 * Also intentionally does NOT implement the Hero/Objectives overlap
 * shown in Figma — Objectives renders as a normal section in document
 * flow, per the brief.
 *
 * Server Component: no "use client", no hooks, no data imports. Data
 * arrives entirely through props from page.tsx.
 */
export function Article({
  hero,
  objectives,
  solution,
  technology,
  outcome,
  architecture,
}: CaseStudyArticlePageData) {
  return (
    
<>
      <Hero {...hero} />
      <Objectives {...objectives} />
      <Solution {...solution} />
      <Technology {...technology} />
      <Outcome {...outcome} />
      <Architecture {...architecture} />

</>
  );
}
