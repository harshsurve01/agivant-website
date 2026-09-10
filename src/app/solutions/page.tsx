import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { FooterButton } from "@/data/footer";
import { Hero } from "@/components/sections/Solutions/Article/Hero";
import { SolutionsHub } from "@/components/sections/Solutions/SolutionsHub";
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
 * - Solutions Landing Hero (reusing the shared Hero component and shared HeroBackground)
 * - SolutionsHub: SearchBar, 2-column scrollable Solution cards, and sticky Filters panel
 * - Footer (connected to page-level footerCta)
 */
export default function SolutionsPage() {
  const solutionItems = getSolutionHubItems();
  const footerButtons: FooterButton[] = [];
  if (
    solutionsFooterCta?.primaryCta?.enabled &&
    solutionsFooterCta.primaryCta.label
  ) {
    footerButtons.push({
      label: solutionsFooterCta.primaryCta.label,
      href: solutionsFooterCta.primaryCta.href ?? "/ampd-score",
      variant: "dark",
      icon: "arrow-up-right",
    });
  }
  if (
    solutionsFooterCta?.secondaryCta?.enabled &&
    solutionsFooterCta.secondaryCta.label
  ) {
    footerButtons.push({
      label: solutionsFooterCta.secondaryCta.label,
      href: solutionsFooterCta.secondaryCta.href ?? "/contact",
      variant: "primary",
      icon: "cube",
    });
  }

  return (
    <GradientLayerProvider>
      <div className={styles.page}>
        <Header />

        <main className={styles.main}>
          <Hero {...solutionsHero} className={styles.hero} />
          <SolutionsHub solutions={solutionItems} />
        </main>

        <Footer
          ctaData={
            solutionsFooterCta?.enabled
              ? {
                  heading: solutionsFooterCta.heading.replace(
                    /<br\s*\/?>/gi,
                    "\n"
                  ),
                  description: solutionsFooterCta.subheading ?? undefined,
                  buttons: footerButtons,
                }
              : undefined
          }
        />
      </div>
    </GradientLayerProvider>
  );
}
