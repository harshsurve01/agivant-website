import { PageRibbon } from "@/components/ui/PageRibbon";
import { Hero } from "./Hero";
import { Objectives } from "./Objectives";
import { Solution } from "./Solution";
import { Technology } from "./Technology";
import { Outcome } from "./Outcome";
import { Architecture } from "./Architecture";
import type { CaseStudyArticlePageData } from "./types";
import styles from "./Article.module.css";

/**
 * Article (Case Study Inner Page)
 *
 * Orchestrates the Case Study Inner (/case-studies/[slug]) page content:
 * - PageRibbon in the page-level decorative visual layer
 * - Hero
 * - Objectives (with frosted-glass Objectives and Challenges cards)
 * - Solution (with sequential solution ribbons)
 * - Technology
 * - Outcome
 * - Architecture (interactive embed viewport)
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
    <div className={styles.article}>
      {/* Page-Level Decorative Ribbon Layer */}
      <PageRibbon
        src="/images/case-studies/case-study-ribbon.png"
        width={1920}
        height={860}
        className={styles.ribbonWrapper}
        imageClassName={styles.ribbonImage}
        priority
      />

      <Hero {...hero} />
      <Objectives {...objectives} />
      <Solution {...solution} />
      <Technology {...technology} />
      <Outcome {...outcome} />
      <Architecture {...architecture} />
    </div>
  );
}
