import Image from "next/image";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Homepage/Hero";
import { Trust } from "@/components/sections/Homepage/Trust";
import { Lifecycle } from "@/components/sections/Homepage/Lifecycle";
import { AIStack } from "@/components/sections/Homepage/AIStack";
import { AmpTransformation } from "@/components/sections/Homepage/AmpTransformation";
import { Partners } from "@/components/sections/Homepage/Partners";
import { Testimonials } from "@/components/sections/Homepage/Testimonials";
import { ProofSection } from "@/components/sections/Homepage/Proof";
import { Footer } from "@/components/layout/Footer";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { getProofData } from "@/data/proof";
import { getTestimonialsData } from "@/data/testimonials";
import styles from "./page.module.css";

export default async function Home() {
  const [proofData, testimonialsData] = await Promise.all([
    getProofData(),
    getTestimonialsData(),
  ]);

  return (
    <GradientLayerProvider>
      {/* <AnnouncementBar /> */}
      <Header />
      <Hero />
      <Trust />
      <AmpTransformation />
      <Lifecycle />
      <AIStack />
      <Partners />
      <ProofSection
        header={proofData.header}
        caseStudies={proofData.caseStudies}
      />
      <div className={styles.bottomGroup}>
        {/* Continuous decorative ribbon artwork spanning Client Testimonials into Footer */}
        <Image
          src="/images/techtalk/talktech-ribbon.png"
          alt=""
          width={1400}
          height={875}
          className={styles.sharedRibbon}
          priority={false}
          aria-hidden="true"
        />
        <Testimonials data={testimonialsData} />
        <Footer />
      </div>
    </GradientLayerProvider>
  );
}