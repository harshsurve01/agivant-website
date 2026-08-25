import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Partners/Hero";
import { Ecosystem } from "@/components/sections/Partners/Ecosystem";
import { PageRibbon } from "@/components/ui/PageRibbon";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { partnersHeroData, ecosystemSectionData } from "@/data/partners";
import styles from "./PartnersPage.module.css";

/**
 * Partners / Our Partners page (/partners).
 *
 * Renders Header, page-level decorative ribbon layer, Hero section,
 * Ecosystem grid section, and the simplified Partners Footer variant.
 */
export default function PartnersPage() {
  return (
    <GradientLayerProvider>
      <div className={styles.page}>
        <Header />

        {/* Page-Level Decorative Ribbon Layer */}
        <PageRibbon
          src="/images/partners/partners-landingpage-ribbon.png"
          width={1920}
          height={860}
          className={styles.ribbonWrapper}
          imageClassName={styles.ribbonImage}
          priority
        />

        <main>
          <Hero {...partnersHeroData} />
          <Ecosystem {...ecosystemSectionData} />
        </main>

        <Footer variant="partners" />
      </div>
    </GradientLayerProvider>
  );
}
