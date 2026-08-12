import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Article } from "@/components/sections/CaseStudies/Article";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { caseStudies, getCaseStudyBySlug } from "@/data/caseStudies";

/**
 * Case Study Inner page (/case-studies/[slug]).
 *
 * Same role app/blogs/[slug]/page.tsx plays for the Blog Inner page:
 * this is the only thing that renders for this route, and the only
 * thing that knows how to go from a URL slug to the data <Article />
 * needs. <Article /> itself has no slug-selection logic of its own —
 * it only knows how to render whatever CaseStudyArticlePageData it's
 * handed. Selection (matching the slug, handling a miss) lives here,
 * one level up, matching the approved data flow:
 *   caseStudies.ts -> this file -> Article orchestrator -> Hero -> props
 *
 * Preserves the same GradientLayerProvider -> Header -> main -> Footer
 * shell app/case-studies/page.tsx and app/blogs/[slug]/page.tsx both
 * use, so this route shares the same visual shell/background
 * architecture rather than inventing its own.
 *
 * Scope: renders Hero, Objectives, Solution, Technology, Outcome, and
 * Architecture/Data Sources, per the brief. This page does not
 * implement the Hero/next-section overlap shown in Figma, and nothing
 * after Architecture is implemented yet.
 */

interface CaseStudyArticlePageProps {
  // Next.js 16: `params` is a Promise in Server Component page props —
  // synchronous access is no longer supported and throws at request
  // time. Must be awaited before use, same as searchParams/cookies/headers.
  params: Promise<{ slug: string }>;
}

/**
 * Pre-renders one path per case study that currently has Inner Page
 * content (i.e. `heroHeading`/`heroDescription` populated — see
 * caseStudies.ts). Falls out naturally once real per-case-study
 * Figma/WordPress content lands for the rest — this function's shape
 * doesn't change, only how many of the 6 records qualify does.
 */
export function generateStaticParams() {
  return caseStudies
    .filter(
      (item) =>
        item.heroHeading &&
        item.heroDescription &&
        item.objectivesTitle &&
        item.challengesTitle &&
        item.challenges?.length &&
        item.solutionTitle &&
        item.solutionItems?.length &&
        item.technologyTitle &&
        item.technologies &&
        item.technologyNote &&
        item.outcomeTitle &&
        item.outcomeItems?.length &&
        item.architectureImage &&
        item.architectureImageWidth &&
        item.architectureImageHeight,
    )
    .map((item) => ({ slug: item.slug }));
}

export default async function CaseStudyArticlePage({
  params,
}: CaseStudyArticlePageProps) {
  const { slug } = await params;

  const caseStudy = getCaseStudyBySlug(slug);

  // Unknown slug, or a known slug whose record has no Inner Page
  // content yet (the other 5 mock Hub cards — see caseStudies.ts) —
  // defer to Next's 404 rather than rendering a partial page.
  if (!caseStudy) {
    notFound();
  }

  return (
    <GradientLayerProvider>
      <Header />

      <main>
        <Article
          hero={{
            heading: caseStudy.heroHeading!,
            description: caseStudy.heroDescription!,
          }}
          objectives={{
            title: caseStudy.objectivesTitle!,
            challengesTitle: caseStudy.challengesTitle!,
            challenges: caseStudy.challenges!,
          }}
          solution={{
            title: caseStudy.solutionTitle!,
            items: caseStudy.solutionItems!,
          }}
          technology={{
            title: caseStudy.technologyTitle!,
            technologies: caseStudy.technologies!,
            additionalText: caseStudy.technologyNote!,
          }}
          outcome={{
            title: caseStudy.outcomeTitle!,
            items: caseStudy.outcomeItems!,
          }}
          architecture={{
            image: caseStudy.architectureImage!,
            imageWidth: caseStudy.architectureImageWidth!,
            imageHeight: caseStudy.architectureImageHeight!,
          }}
        />
      </main>

      <Footer />
    </GradientLayerProvider>
  );
}
