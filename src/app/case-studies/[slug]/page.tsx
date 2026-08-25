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
 * needs. Selection (matching the slug, handling a miss) lives here:
 *   caseStudies.ts -> this file -> Article orchestrator -> Hero/Objectives/Solution/Technology/Outcome/Architecture -> props
 */

interface CaseStudyArticlePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-renders one path per case study that currently has Inner Page
 * content (i.e. `heroHeading`/`heroDescription` populated — see
 * caseStudies.ts).
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
        (item.architecture ||
          (item.architectureImage &&
            item.architectureImageWidth &&
            item.architectureImageHeight)),
    )
    .map((item) => ({ slug: item.slug }));
}

export default async function CaseStudyArticlePage({
  params,
}: CaseStudyArticlePageProps) {
  const { slug } = await params;

  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const architectureProp = caseStudy.architecture ?? {
    type: "image" as const,
    image: caseStudy.architectureImage!,
    imageWidth: caseStudy.architectureImageWidth!,
    imageHeight: caseStudy.architectureImageHeight!,
  };

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
          architecture={architectureProp}
        />
      </main>

      <Footer />
    </GradientLayerProvider>
  );
}
