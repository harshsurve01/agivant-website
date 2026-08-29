import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Homepage/Hero";
import { Trust } from "@/components/sections/Homepage/Trust";
import { Lifecycle } from "@/components/sections/Homepage/Lifecycle";
import { AIStack } from "@/components/sections/Homepage/AIStack";
import { Environment } from "@/components/sections/Homepage/Environment";
import { AmpTransformation } from "@/components/sections/Homepage/AmpTransformation";
import { Partners } from "@/components/sections/Homepage/Partners";
import { ProofSection } from "@/components/sections/Homepage/Proof";
import { Footer } from "@/components/layout/Footer";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { getProofData } from "@/data/proof";

export default async function Home() {
  const proofData = await getProofData();

  return (
    <GradientLayerProvider>
      {/* <AnnouncementBar /> */}
      <Header />
      <Hero />
      <Trust />
      <AmpTransformation />
      <Lifecycle />
      <AIStack />
      <Environment />
      <Partners />
      <ProofSection
        header={proofData.header}
        caseStudies={proofData.caseStudies}
      />
      <Footer />
    </GradientLayerProvider>
  );
}