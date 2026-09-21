import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { Hero } from "@/components/sections/Services/Hero";
import { RunningToday } from "@/components/sections/Services/RunningToday";
import { HowAgivantWorksWithYou } from "@/components/sections/Services/HowAgivantWorksWithYou";
import { HowYourEnterpriseGetsAmpd } from "@/components/sections/Services/HowYourEnterpriseGetsAmpd";
import { ProofSection } from "@/components/sections/Homepage/Proof";
import { ImpactTable } from "@/components/sections/Solutions/Article/ImpactTable";
import {
  getServicesPage,
  getRunningTodaySection,
  getHowAgivantWorksWithYouSection,
  getHowYourEnterpriseGetsAmpdSection,
  getWhyAgivantSection,
} from "@/data/services";
import { getProofData } from "@/data/proof";
import styles from "./ServicesPage.module.css";

const pageData = getServicesPage();

export const metadata: Metadata = {
  title: pageData.seo.title ?? pageData.title,
  description: pageData.seo.description ?? "",
};

/**
 * Services Landing Page (/services)
 *
 * Implemented Sections:
 * 1. Hero:
 *    - Ambient glows + mouse-reactive particle field
 *    - Centered purple headline with semantic breaks
 *    - Supporting copy & primary CTA button
 *    - Flowing ribbon artwork
 * 2. Running Today, Across Enterprises:
 *    - Centered heading with purple highlight
 *    - Centered supporting description
 *    - 3x2 responsive statistics card grid (with lavender tint on Card 6)
 * 3. How Agivant Works With You:
 *    - Reused Homepage Lifecycle card carousel/system
 *    - 5 cards with callouts ("START HERE IF → ...")
 *    - Initial active state: Card 1 ("Cloud & Platform Engineering")
 *    - Numbered pagination track indicator (① --- 2 --- 3 --- 4 --- 5)
 * 4. How your enterprise gets Amp'd:
 *    - Left-aligned heading: "How your " (black) + "enterprise gets Amp'd" (purple)
 *    - Supporting subtitle: "Four moves, whichever pillar the work starts in."
 *    - 5 vertical steps with number circles (58px) and purple horizontal dividers
 * 5. Proof Beyond The Pilot (Client Success in Production, at Scale):
 *    - Reused exact Homepage ProofSection and getProofData()
 * 6. Why Agivant?:
 *    - Reused existing ImpactTable component with translucent glass styling,
 *      purple header row, 6 comparison rows, and decorative landing-page-hero ribbon
 * 7. Final CTA + Footer:
 *    - Reused existing Footer component with custom ctaData
 *    - Centered two-line heading ("Ready To Get Your" / "Enterprises" + Amp'd GIF)
 *    - Existing animated GIF (/videos/ampd-Logo-Animation.gif)
 *    - Existing Button component (variant="primary", "Talk to an Amp'd specialist")
 *    - Existing faint liquid Agivant brandmark and dynamic copyright
 */
export default async function ServicesPage() {
  const proofData = await getProofData();
  const { hero, footerCta } = pageData;
  const runningTodayData = getRunningTodaySection();
  const howAgivantWorksWithYouData = getHowAgivantWorksWithYouSection();
  const howYourEnterpriseGetsAmpdData = getHowYourEnterpriseGetsAmpdSection();
  const whyAgivantData = getWhyAgivantSection();

  return (
    <GradientLayerProvider>
      <div className={styles.page}>
        <Header />

        <main className={styles.main}>
          <Hero
            title={hero.title}
            summary={hero.summary}
            primaryCta={hero.primaryCta}
            media={hero.media}
          />

          <RunningToday
            heading={runningTodayData.heading}
            description={runningTodayData.description}
            metrics={runningTodayData.metrics}
          />

          <HowAgivantWorksWithYou data={howAgivantWorksWithYouData} />

          <HowYourEnterpriseGetsAmpd data={howYourEnterpriseGetsAmpdData} />

          <ProofSection
            header={proofData.header}
            caseStudies={proofData.caseStudies}
          />

          <ImpactTable
            data={whyAgivantData.data}
            blocks={whyAgivantData.blocks}
            variant="glass"
          />
        </main>

        <Footer
          ctaData={
            footerCta?.enabled
              ? {
                  heading: {
                    line1: "Ready To Get Your",
                    line2: "Enterprises",
                  },
                  brandMedia: footerCta.media?.src
                    ? {
                        kind:
                          (footerCta.media.kind as
                            | "animation"
                            | "gif"
                            | "image"
                            | "video") ?? "animation",
                        src: footerCta.media.src,
                        alt: footerCta.media.alt ?? "Amp'd",
                        width: 240,
                        height: 80,
                      }
                    : undefined,
                  buttons: [
                    {
                      label:
                        footerCta.primaryCta?.label ??
                        "Talk to an Amp'd specialist",
                      href: footerCta.primaryCta?.href ?? "/contact",
                      variant: "primary",
                      icon: "cube",
                    },
                  ],
                }
              : undefined
          }
        />
      </div>
    </GradientLayerProvider>
  );
}
