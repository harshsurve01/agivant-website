import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Techtalk/Hero";
import { Episodes } from "@/components/sections/Techtalk/Episodes";
import { CTA } from "@/components/sections/Techtalk/CTA";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { techTalkData } from "@/data/techtalk";

export default function TechTalkPage() {
  const { hero, episodes, cta } = techTalkData;
  const { toolbar, player, playlist, list } = episodes;

  return (
    <GradientLayerProvider>
      <Header />

      <main>
        <Hero {...hero} />
        <Episodes content={{ toolbar, player, playlist }} episodes={list} />
        <CTA {...cta} />
      </main>
    </GradientLayerProvider>
  );
}