import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/CaseStudies/Hero";
import { CaseStudyHub } from "@/components/sections/CaseStudies/CaseStudyHub";
import { PageRibbon } from "@/components/ui/PageRibbon";
import {
  caseStudiesHero,
  caseStudies,
  caseStudyFilterGroups,
} from "@/data/caseStudies";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import styles from "./CaseStudiesPage.module.css";

/**
 * Case Studies page (/case-studies).
 *
 * Renders:
 * - Header
 * - Page-level decorative ribbon layer spanning across Hero and CaseStudyHub
 * - Hero section (content + interactive particles)
 * - CaseStudyHub (portfolio cards + glass PortfolioFilters panel)
 * - Footer
 */
export default function CaseStudiesPage() {
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

        <Footer />
      </div>
    </GradientLayerProvider>
  );
}
