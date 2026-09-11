import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Solutions/Article/Hero";
import { SolutionsHub } from "@/components/sections/Solutions/SolutionsHub";
import { FinalCTA } from "@/components/sections/CaseStudies/Article/FinalCTA";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import {
  solutionsHero,
  solutionsFooterCta,
  getSolutionsPage,
  getSolutionHubItems,
} from "@/data/solutions";
import styles from "./SolutionsPage.module.css";

const pageData = getSolutionsPage();

export const metadata: Metadata = {
  title: pageData.seo.title ?? pageData.title,
  description: pageData.seo.description ?? "",
};

/**
 * Solutions Landing Page (/solutions).
 *
 * Renders:
 * - Universal Header
 * - Solutions Landing Hero (reusing shared Hero component and shared HeroBackground)
 * - SolutionsHub: SearchBar, 2-column scrollable Solution cards, and sticky Filters panel
 * - FinalCTA (Footer3): Reused from Case Study Single Page with Amp'd highlight and CTA buttons
 * - Footer: Minimal brandmark + copyright layout footer
 */
export default function SolutionsPage() {
  const solutionItems = getSolutionHubItems();

  return (
    <GradientLayerProvider>
      <div className={styles.page}>
        <Header />

        <main className={styles.main}>
          <Hero {...solutionsHero} className={styles.hero} />
          <SolutionsHub solutions={solutionItems} />
          {solutionsFooterCta?.enabled && (
            <FinalCTA
              heading={solutionsFooterCta.heading}
              description={
                solutionsFooterCta.description ??
                solutionsFooterCta.subheading ??
                undefined
              }
              primaryCta={solutionsFooterCta.primaryCta ?? undefined}
              secondaryCta={solutionsFooterCta.secondaryCta ?? undefined}
            />
          )}
        </main>

        <Footer variant="minimal" className={styles.footer} />
      </div>
    </GradientLayerProvider>
  );
}
