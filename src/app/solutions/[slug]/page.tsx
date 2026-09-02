import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ProofSection,
  type ProofSectionHeader,
} from "@/components/sections/Homepage/Proof";
import type { FooterButton } from "@/data/footer";
import type { CaseStudy } from "@/data/proof";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import type {
  CaseStudyFooterCTA,
  CaseStudySectionBlock,
} from "@/types/caseStudyDetail";
import {
  Hero,
  WhatAgentsDo,
  LivePromptDemo,
  SolutionOfferings,
  ImpactTable,
} from "@/components/sections/Solutions/Article";
import {
  getSolutionPage,
  getAllSolutionSlugs,
  type SolutionSection,
} from "@/data/solutionPage";
import { Gradient } from "@/components/effects/Gradient";

export interface SolutionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getAllSolutionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const solutionData = getSolutionPage(slug);
  if (!solutionData) {
    return {};
  }
  return {
    title: solutionData.seo.title ?? `${solutionData.title} | Agivant`,
    description:
      solutionData.seo.description ?? solutionData.hero.summary ?? "",
  };
}

// Fallback image asset mapping for proof cards without live CMS URLs
const PROOF_IMAGES: Record<string, string> = {
  "quote-accelerator": "/images/proof/agentic-quote-accelerator.png",
  "case-quote-accelerator": "/images/proof/agentic-quote-accelerator.png",
  "sre": "/images/proof/ai-native-transformation.png",
  "case-ai-native-sre": "/images/proof/ai-native-transformation.png",
  "markets": "/images/proof/global-market-agentic-network.png",
  "case-global-markets": "/images/proof/global-market-agentic-network.png",
};

export default async function SolutionInnerPage({
  params,
}: SolutionPageProps) {
  const { slug } = await params;
  const solutionData = getSolutionPage(slug);

  if (!solutionData) {
    notFound();
  }

  // 1. Follow the exact same footerCta passing pattern established by Case Study inner page
  const footerCta = solutionData.footerCta as CaseStudyFooterCTA;
  const footerButtons: FooterButton[] = [];
  if (footerCta.primaryCta?.enabled && footerCta.primaryCta.label) {
    footerButtons.push({
      label: footerCta.primaryCta.label,
      href: footerCta.primaryCta.href ?? "/ampd-score",
      variant: "dark",
      icon: "arrow-up-right",
    });
  }
  if (footerCta.secondaryCta?.enabled && footerCta.secondaryCta.label) {
    footerButtons.push({
      label: footerCta.secondaryCta.label,
      href: footerCta.secondaryCta.href ?? "/contact",
      variant: "primary",
      icon: "cube",
    });
  }

  // 2. Extract and adapt client-success section for the existing Proof/Spotlight component
  const clientSuccessSection = solutionData.sections.find(
    (s) => s.id === "client-success"
  );

  let proofHeader: ProofSectionHeader | undefined = undefined;
  if (clientSuccessSection) {
    proofHeader = {
      heading:
        clientSuccessSection.data.heading ??
        "Client success<br>in production, at scale",
      description: clientSuccessSection.data.description ?? "",
      cta: {
        label:
          clientSuccessSection.data.cta?.label ?? "See more client stories",
        href: clientSuccessSection.data.cta?.href ?? "/case-studies",
      },
    };
  }

  const caseStudies: CaseStudy[] = (
    (clientSuccessSection?.blocks as CaseStudySectionBlock[] | undefined) ?? []
  ).map((block) => {
    const imageSrc =
      block.media?.src ||
      (block.media?.assetKey && PROOF_IMAGES[block.media.assetKey]) ||
      PROOF_IMAGES[block.id] ||
      "/images/proof/agentic-quote-accelerator.png";

    const items = block.items ?? [];
    let metric: string | undefined = undefined;
    let metricLabel: string | undefined = undefined;
    let footer: string | undefined = undefined;

    if (items.length >= 3) {
      metric = items[0];
      metricLabel = items[1];
      footer = items[2];
    } else if (items.length === 1) {
      const parts = items[0].split(" ");
      metric = parts[0];
      metricLabel = parts.slice(1).join(" ");
      footer = block.id === "sre" ? "Amp'd infrastructure reliability from day one." : undefined;
    }

    return {
      id: block.id,
      industry: block.eyebrow ?? "",
      title: block.title ?? "",
      description: block.body ?? "",
      href: block.cta?.href ?? `/case-studies/${block.id}`,
      metric,
      metricLabel,
      footer,
      image: {
        src: imageSrc,
        alt: block.media?.alt || block.title || "Case study visual",
      },
    };
  });


  return (
    <GradientLayerProvider>

      
      <Header />
  <Gradient
        top="25%"
        left="-10%"
        size="30rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.39}
        blur="60px"
      />
               <Gradient
        kind="linear"
        angle="90deg"
        top="20%"
        right="25%"
        size="35rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
               <Gradient
        kind="linear"
        angle="90deg"
        top="60%"
        right="25%"
        size="35rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
  <Gradient
        top="42%"
        right="25%"
        size="30rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.39}
        blur="60px"
      />
               <Gradient
        kind="linear"
        angle="90deg"
                top="42%"
        left="-10%"

        size="35rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
      <main id="main-content">
        <Hero
          heading={solutionData.hero.title}
          description={solutionData.hero.summary ?? ""}
          media={solutionData.hero.media}
        />

        {solutionData.sections.map((section: SolutionSection) => {
          if (!section.enabled) return null;

          switch (section.type) {
            case "video_demo":
              return (
                <LivePromptDemo
                  key={section.id}
                  data={section.data}
                />
              );


            case "comparison_table":
              return (
                <ImpactTable
                  key={section.id}
                  data={section.data}
                  blocks={section.blocks}
                />
              );

            case "card_grid":
              if (section.id === "what-agents-do") {
                return (
                  <WhatAgentsDo
                    key={section.id}
                    data={section.data}
                    blocks={section.blocks}
                  />
                );
              }
              if (section.id === "solution-offerings") {
                return (
                  <SolutionOfferings
                    key={section.id}
                    data={section.data}
                    blocks={section.blocks}
                  />
                );
              }
              return null;

            case "list":
              if (section.id === "what-agents-do") {
                return (
                  <WhatAgentsDo
                    key={section.id}
                    data={section.data}
                    blocks={section.blocks}
                  />
                );
              }
              return null;

            case "case_study_grid":
              if (proofHeader && caseStudies.length > 0) {
                return (
                  <ProofSection
                    key={section.id}
                    header={proofHeader}
                    caseStudies={caseStudies}
                    layout="large-right"
                  />
                );
              }
              return null;

            default:
              return null;
          }
        })}
      </main>

      <Footer
        ctaData={
          footerCta?.enabled
            ? {
                heading: (footerCta.heading || "").replace(
                  /<br\s*\/?>/gi,
                  "\n"
                ),
                description: footerCta.subheading ?? undefined,
                buttons: footerButtons,
              }
            : undefined
        }
      />
    </GradientLayerProvider>
  );
}
