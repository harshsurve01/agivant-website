import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Techtalk/Hero";
import { Episodes } from "@/components/sections/Techtalk/Episodes";
import { CTA } from "@/components/sections/Techtalk/CTA";
import { PageRibbon } from "@/components/ui/PageRibbon";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { techTalkData } from "@/data/techtalk";
import styles from "./TechTalkPage.module.css";

/**
 * TalkTech Landing Page (/talktech).
 *
 * Renders Header, page-level decorative ribbon layer, Hero section,
 * Episodes player/playlist, closing CTA section, and the minimal Footer.
 */
export default function TechTalkPage() {
  const { hero, episodes, cta } = techTalkData;
  const { toolbar, player, playlist, list } = episodes;

  return (
    <GradientLayerProvider>
      <div className={styles.page}>
        <Header />

        {/* Page-Level Decorative Ribbon Layer */}
        <PageRibbon
          src="/images/techtalk/talktech-ribbon.png"
          width={1920}
          height={860}
          className={styles.ribbonWrapper}
          imageClassName={styles.ribbonImage}
          priority
        />

        <main>
          <Hero {...hero} />
          <Episodes content={{ toolbar, player, playlist }} episodes={list} />
          <CTA {...cta} />
        </main>

        <Footer variant="minimal" />
      </div>
    </GradientLayerProvider>
  );
}