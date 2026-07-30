import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Trust } from "@/components/sections/Trust";
import { Lifecycle } from "@/components/sections/Lifecycle";
import { AIStack } from "@/components/sections/AIStack";
import { Environment } from "@/components/sections/Environment";
import { AmpTransformation } from "@/components/sections/AmpTransformation";
import { Partners } from "@/components/sections/Partners";
import { ProofSection } from "@/components/sections/Proof";
import { Footer } from "@/components/layout/Footer";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";

export default function Home() {
  return (
    <GradientLayerProvider>
      <AnnouncementBar />
      <Header />
      <Hero />
      <Trust />
      <AmpTransformation />
      <Lifecycle />
      <AIStack />
      <Environment />
      <Partners/>
      <ProofSection/>
      <Footer />
    </GradientLayerProvider>
  );
}