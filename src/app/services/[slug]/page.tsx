import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { Hero, CleanData, ServiceCapabilityCards } from "@/components/sections/Services/Article";
import { RunningToday } from "@/components/sections/Services/RunningToday";
import { AIStack } from "@/components/sections/Homepage/AIStack";
import { HowYourEnterpriseGetsAmpd } from "@/components/sections/Services/HowYourEnterpriseGetsAmpd";
import { Lifecycle } from "@/components/sections/Homepage/Lifecycle";
import { ProofSection } from "@/components/sections/Homepage/Proof";
import {
  getServicePage,
  getAllServiceSlugs,
  canonicalServiceProofSection,
} from "@/data/services";
import type {
  ServiceDetailPageDocument,
  ServiceDetailSection,
} from "@/types/serviceDetail";

export interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const serviceData = getServicePage(slug);
  if (!serviceData) {
    return {};
  }
  return {
    title: serviceData.seo.title ?? `${serviceData.title} | Agivant`,
    description: serviceData.seo.description ?? serviceData.hero.summary ?? "",
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const serviceData = getServicePage(slug);

  if (!serviceData) {
    notFound();
  }

  return (
    <GradientLayerProvider>
      <Header />
      <main id="main-content">
        <Hero
          heading={serviceData.hero.title}
          description={serviceData.hero.summary}
          media={serviceData.hero.media}
        />

        {serviceData.sections.map((section: ServiceDetailSection) => {
          if (!section.enabled) return null;

          switch (section.type) {
            case "stats":
              return (
                <RunningToday
                  key={section.id}
                  description={section.data.description}
                  metrics={section.blocks ?? []}
                  tags={section.data.tags ?? []}
                />
              );

            case "clean-data":
            case "editorial-bento":
              return (
                <CleanData
                  key={section.id}
                  heading={section.data.heading ?? undefined}
                  cards={(section.blocks ?? []) as any}
                />
              );

            case "ai-stack":
              return (
                <AIStack
                  key={section.id}
                  variant="service"
                  heading={section.data.heading ?? undefined}
                  description={section.data.description ?? undefined}
                  showCta={false}
                  cards={(section.blocks ?? []).map((block: any) => ({
                    id: block.id,
                    title: block.title ?? "",
                    description: block.description ?? "",
                    bullets: block.bullets ?? [],
                    badge: block.badge ?? undefined,
                    backgroundImage: block.media?.src ?? "",
                    accentColor: "var(--color-brand-primary, #8500DF)",
                    layout: block.layout ?? "data",
                  }))}
                />
              );

            case "numbered_list":
            case "how-your-enterprise-gets-ampd":
            case "process":
              return (
                <HowYourEnterpriseGetsAmpd
                  key={section.id}
                  data={{
                    id: section.id,
                    heading: section.data.heading ?? "The Amp'd Way",
                    description: section.data.description ?? "",
                    steps: (section.blocks ?? []).map((b: any, index: number) => ({
                      id: b.id || `step-${index}`,
                      number: String(b.number ?? index + 1).padStart(2, "0"),
                      title: b.title ?? "",
                      description: b.body ?? b.description ?? "",
                    })),
                    media: section.data.media
                      ? {
                          src: section.data.media.src,
                          alt: section.data.media.alt ?? "",
                        }
                      : null,
                  }}
                  ribbon={
                    section.data.media
                      ? {
                          src: section.data.media.src,
                          alt: section.data.media.alt ?? "",
                        }
                      : null
                  }
                />
              );

            case "lifecycle":
            case "ampd-way":
              return (
                <Lifecycle
                  key={section.id}
                  heading={section.data.heading ?? "The Amp'd Way"}
                  eyebrow={section.data.eyebrow ?? null}
                  description={section.data.description ?? null}
                  stages={(section.blocks ?? []).map((b: any) => ({
                    id: b.id,
                    title: b.title ?? "",
                    description: b.body ?? b.description ?? "",
                    media: {
                      src: b.media?.src ?? "/images/lifecycle/architect.png",
                      alt: b.media?.alt ?? b.title,
                    },
                  }))}
                  initialActiveIndex={section.data.initialActiveIndex ?? 2}
                  autoRotate={false}
                  enableModal={false}
                  showLearnMore={false}
                  indicatorVariant="numbered"
                  showConnector={false}
                  showSummary={false}
                  ribbon={
                    section.data.media
                      ? {
                          src: section.data.media.src,
                          alt: section.data.media.alt ?? "",
                          width: section.data.media.width ?? 1440,
                          height: section.data.media.height ?? 1834,
                        }
                      : null
                  }
                />
              );

            case "case_study_grid":
            case "proof":
            case "client-success": {
              let blocks = (section.blocks ?? []) as any[];
              if (!blocks || blocks.length === 0) {
                blocks = (canonicalServiceProofSection?.blocks ?? []) as any[];
              }
              const topLeft = blocks.find((b) => b.slot === "top-left") ?? blocks[0];
              const tallRight =
                blocks.find(
                  (b) =>
                    b.slot === "tall-right" ||
                    b.slot === "large" ||
                    b.slot === "large-right"
                ) ?? blocks[1];
              const bottomLeft =
                blocks.find((b) => b.slot === "bottom-left") ?? blocks[2];

              const sortedBlocks = [topLeft, tallRight, bottomLeft].filter(Boolean);

              return (
                <ProofSection
                  key={section.id}
                  header={{
                    heading:
                      section.data?.heading ??
                      canonicalServiceProofSection?.data?.heading ??
                      "Client success<br>in production, at scale",
                    description:
                      section.data?.description ??
                      canonicalServiceProofSection?.data?.description ??
                      "",
                    cta: {
                      label:
                        section.data?.cta?.label ??
                        canonicalServiceProofSection?.data?.cta?.label ??
                        "See more client stories",
                      href:
                        section.data?.cta?.href ??
                        canonicalServiceProofSection?.data?.cta?.href ??
                        "/case-studies",
                    },
                  }}
                  caseStudies={sortedBlocks.map((block: any) => {
                    const items = block.items ?? [];
                    return {
                      id: block.id,
                      industry: block.eyebrow ?? "Global technology leader",
                      title: block.title ?? "",
                      description: block.body ?? block.description ?? "",
                      metric:
                        block.metric || (items.length >= 3 ? items[0] : undefined),
                      metricLabel:
                        block.metricLabel ||
                        (items.length >= 3 ? items[1] : undefined),
                      footer:
                        block.footer ||
                        (items.length === 1 ? items[0] : items[2] || undefined),
                      href: block.cta?.href ?? `/case-studies/${block.id}`,
                      image: {
                        src:
                          block.media?.src ??
                          "/images/proof/agentic-quote-accelerator.png",
                        alt: block.media?.alt ?? block.title ?? "Case study visual",
                      },
                      theme: "default",
                    };
                  })}
                  layout="large-right"
                />
              );
            }

            case "service-capability-cards":
            case "capability-cards":
            case "impact-cards":
              return (
                <ServiceCapabilityCards
                  key={section.id}
                  heading={section.data.heading ?? undefined}
                  cards={(section.blocks ?? []) as any}
                />
              );

            default:
              return null;
          }
        })}
      </main>
      <Footer
        variant="service-detail"
        ctaData={
          serviceData.footerCta?.enabled
            ? {
                heading: serviceData.footerCta.heading || "",
                description: serviceData.footerCta.subheading ?? undefined,
                buttons: [
                  ...(serviceData.footerCta.primaryCta?.enabled
                    ? [
                        {
                          label: serviceData.footerCta.primaryCta.label,
                          href: serviceData.footerCta.primaryCta.href,
                          variant:
                            (serviceData.footerCta.primaryCta.variant as
                              | "primary"
                              | "dark") ?? "primary",
                          icon:
                            (serviceData.footerCta.primaryCta.icon as
                              | "cube"
                              | "arrow-up-right") ?? "cube",
                        },
                      ]
                    : []),
                  ...(serviceData.footerCta.secondaryCta?.enabled
                    ? [
                        {
                          label: serviceData.footerCta.secondaryCta.label,
                          href: serviceData.footerCta.secondaryCta.href,
                          variant:
                            (serviceData.footerCta.secondaryCta.variant as
                              | "primary"
                              | "dark") ?? "dark",
                          icon: serviceData.footerCta.secondaryCta.icon as
                            | "cube"
                            | "arrow-up-right"
                            | undefined,
                        },
                      ]
                    : []),
                ],
              }
            : undefined
        }
      />
    </GradientLayerProvider>
  );
}
