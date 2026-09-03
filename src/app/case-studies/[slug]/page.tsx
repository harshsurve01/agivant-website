import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { FooterButton } from "@/data/footer";
import { Article } from "@/components/sections/CaseStudies/Article";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import {
  getCaseStudyDetail,
  getAllCaseStudyDetailSlugs,
} from "@/data/caseStudyDetail";

interface CaseStudyArticlePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-renders all Case Study inner pages defined in the JSON data.
 */
export function generateStaticParams() {
  return getAllCaseStudyDetailSlugs().map((slug) => ({ slug }));
}

/**
 * Generates page metadata dynamically from the Case Study JSON SEO/hero data.
 */
export async function generateMetadata({
  params,
}: CaseStudyArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyDetail(slug);

  if (!caseStudy) {
    return { title: "Case Study Not Found | Agivant" };
  }

  return {
    title: caseStudy.seo.title ?? `${caseStudy.title} | Case Study | Agivant`,
    description: caseStudy.seo.description ?? caseStudy.hero.summary ?? "",
  };
}

export default async function CaseStudyArticlePage({
  params,
}: CaseStudyArticlePageProps) {
  const { slug } = await params;

  const caseStudy = await getCaseStudyDetail(slug);

  if (!caseStudy) {
    notFound();
  }

  const footerButtons: FooterButton[] = [];
  if (
    caseStudy.footerCta.primaryCta?.enabled &&
    caseStudy.footerCta.primaryCta.label
  ) {
    footerButtons.push({
      label: caseStudy.footerCta.primaryCta.label,
      href: caseStudy.footerCta.primaryCta.href ?? "/ampd-score",
      variant: "dark",
      icon: "arrow-up-right",
    });
  }
  if (
    caseStudy.footerCta.secondaryCta?.enabled &&
    caseStudy.footerCta.secondaryCta.label
  ) {
    footerButtons.push({
      label: caseStudy.footerCta.secondaryCta.label,
      href: caseStudy.footerCta.secondaryCta.href ?? "/contact",
      variant: "primary",
      icon: "cube",
    });
  }

  return (
    <GradientLayerProvider>
      <Header />

      <main id="main-content">
        <Article data={caseStudy} />
      </main>

      {caseStudy.showFooter !== false && caseStudy.footerCta?.enabled && (
        <Footer
          ctaData={{
            heading: caseStudy.footerCta.heading.replace(/<br\s*\/?>/gi, "\n"),
            description: caseStudy.footerCta.subheading ?? undefined,
            buttons: footerButtons,
          }}
        />
      )}
    </GradientLayerProvider>
  );
}

