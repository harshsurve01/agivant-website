import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { Gradient } from "@/components/effects/Gradient";
import { Hero } from "@/components/sections/Contact/Hero/Hero";
import { ContactContent } from "@/components/sections/Contact/ContactContent/ContactContent";
import styles from "./ContactPage.module.css";

export const metadata: Metadata = {
  title: "Contact | Agivant",
  description:
    "Connect with Agivant to bring enterprise AI into production with measurable business impact.",
};

const HERO = {
  heading: "Get in Touch",
  description:
    "See how Agivant engineers enterprise AI into production across several industries.",
};

export default function ContactPage() {
  return (
    <GradientLayerProvider>
      <div className={styles.page}>
        <Header />

        <Gradient
          top="8%"
          left="-2%"
          size="22rem"
          stops={[
            "color-mix(in srgb, #EDBF79 68%, transparent) 0%",
            "transparent 100%",
          ]}
          opacity={0.35}
          blur="75px"
        />
        <Gradient
          kind="linear"
          angle="180deg"
          top="28%"
          right="-5%"
          size="34rem"
          stops={["#b31aef33 0%", "#f6048d 36%", "#f88c54 76%", "transparent 100%"]}
          opacity={0.15}
          blur="90px"
        />

        <main id="main-content">
          <Hero {...HERO} />
          <ContactContent />
        </main>

        <Footer variant="default" />
      </div>
    </GradientLayerProvider>
  );
}
