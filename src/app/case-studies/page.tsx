import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { FooterButton } from "@/data/footer";
import { Hero } from "@/components/sections/CaseStudies/Hero";
import { CaseStudyHub } from "@/components/sections/CaseStudies/CaseStudyHub";
import { PageRibbon } from "@/components/ui/PageRibbon";
import {
  caseStudiesHero,
  caseStudies,
  caseStudyFilterGroups,
  caseStudiesFooterCta,
  getCaseStudiesPage,
} from "@/data/caseStudies";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import styles from "./CaseStudiesPage.module.css";

const pageData = getCaseStudiesPage();

export const metadata: Metadata = {
  title: pageData.seo.title ?? pageData.title,
  description: pageData.seo.description ?? "",
};

/**
 * Case Studies page (/case-studies).
 *
 * Renders:
 * - Header
 * - Page-level decorative ribbon layer spanning across Hero and CaseStudyHub
 * - Hero section (content + interactive particles)
 * - CaseStudyHub (portfolio cards + glass PortfolioFilters panel)
 * - Footer (connected to page-level footerCta)
 */
export default function CaseStudiesPage() {
  const footerButtons: FooterButton[] = [];
  if (
    caseStudiesFooterCta?.primaryCta?.enabled &&
    caseStudiesFooterCta.primaryCta.label
  ) {
    footerButtons.push({
      label: caseStudiesFooterCta.primaryCta.label,
      href: caseStudiesFooterCta.primaryCta.href ?? "/ampd-score",
      variant: "dark",
      icon: "arrow-up-right",
    });
  }
  if (
    caseStudiesFooterCta?.secondaryCta?.enabled &&
    caseStudiesFooterCta.secondaryCta.label
  ) {
    footerButtons.push({
      label: caseStudiesFooterCta.secondaryCta.label,
      href: caseStudiesFooterCta.secondaryCta.href ?? "/contact",
      variant: "primary",
      icon: "cube",
    });
  }

  return (
    <GradientLayerProvider>
      <div className={styles.page}>
        <Header />

        {/* Page-Level Decorative Ribbon Layer */}
        <PageRibbon
          src="/images/case-studies/case-study-landingpage-ribbon.png"
          width={1439}
          height={772}
          className={styles.ribbonWrapper}
          imageClassName={styles.ribbonImage}
          priority
        />

        <main>
          <Hero {...caseStudiesHero} />
          <CaseStudyHub
            heading="Case Studies"
            caseStudies={caseStudies}
            filterGroups={caseStudyFilterGroups}
          />
        </main>

        <Footer
          ctaData={
            caseStudiesFooterCta?.enabled
              ? {
                  heading: caseStudiesFooterCta.heading.replace(/<br\s*\/?>/gi, "\n"),
                  description: caseStudiesFooterCta.subheading ?? undefined,
                  buttons: footerButtons,
                }
              : undefined
          }
        />
      </div>
    </GradientLayerProvider>
  );
}
