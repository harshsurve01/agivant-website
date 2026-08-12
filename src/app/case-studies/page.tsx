import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/CaseStudies/Hero";
import { CaseStudyHub } from "@/components/sections/CaseStudies/CaseStudyHub";
import {
  caseStudiesHero,
  caseStudies,
  caseStudyFilterGroups,
} from "@/data/caseStudies";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";

/**
 * Case Studies page.
 *
 * Hero + Hub/listing only, per the brief: no dynamic [slug] inner
 * page yet. This file is both the Next.js route entry and the
 * "CaseStudies page component" in the approved data flow —
 * caseStudies.ts -> this file -> CaseStudyHub -> PortfolioFilters +
 * CaseStudyCard[] — there's no separate intermediate component while
 * these are the only two sections that exist.
 *
 * Reuses the project's existing Header and Footer unchanged.
 */
export default function CaseStudiesPage() {
  return (

 <GradientLayerProvider>
      <Header />
      <main>
        <Hero {...caseStudiesHero} />
        <CaseStudyHub
          heading="Case Studies"
          caseStudies={caseStudies}
          filterGroups={caseStudyFilterGroups}
        />
      </main>
      <Footer />
</GradientLayerProvider>
  );
}
