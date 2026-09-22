import clsx from "clsx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageRibbon } from "@/components/ui/PageRibbon";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { PartnerHero } from "@/components/sections/Partners/Detail/PartnerHero";
import { PartnerIntro } from "@/components/sections/Partners/Detail/PartnerIntro";
import { PartnerStoryBanner } from "@/components/sections/Partners/Detail/PartnerStoryBanner";
import { PartnerAgentTeams } from "@/components/sections/Partners/Detail/PartnerAgentTeams";
import { PartnerAlternatingContent } from "@/components/sections/Partners/Detail/PartnerAlternatingContent";
import { AgenticEnterprise } from "@/components/sections/Partners/Detail/AgenticEnterprise";
import { DatabricksAgenticExecution } from "@/components/sections/Partners/Detail/DatabricksAgenticExecution";
import { DatabricksBusinessContext } from "@/components/sections/Partners/Detail/DatabricksBusinessContext";
import { DatabricksControl } from "@/components/sections/Partners/Detail/DatabricksControl";
import { PartnerDeploymentCard } from "@/components/sections/Partners/Detail/PartnerDeploymentCard";
import { ServiceNowWorkflowFamilies } from "@/components/sections/Partners/Detail/ServiceNowWorkflowFamilies";
import { WhatAgentsDo } from "@/components/sections/Solutions/Article/WhatAgentsDo";
import { Solutions } from "@/components/sections/Partners/Detail/Solutions";
import { ProductionProof } from "@/components/sections/Partners/Detail/ProductionProof";
import { BuiltOnGemini } from "@/components/sections/Partners/Detail/BuiltOnGemini";
import { getPartnerDetail, getAllPartnerSlugs } from "@/data/partners";
import styles from "./PartnerDetailPage.module.css";
import { Gradient } from "@/components/effects/Gradient";

interface PartnerDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPartnerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PartnerDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPartnerDetail(slug);

  if (!partner) {
    return { title: "Partner Not Found | Agivant" };
  }

  return {
    title: partner.meta.title,
    description: partner.meta.description,
  };
}

export default async function PartnerDetailPage({
  params,
}: PartnerDetailPageProps) {
  const { slug } = await params;
  const partner = await getPartnerDetail(slug);

  if (!partner) {
    notFound();
  }

  return (
    <GradientLayerProvider>
      <div
        className={clsx(
          styles.page,
          slug === "shopify" && styles.shopifyPage,
          slug === "servicenow" && styles.servicenowPage
        )}
      >
        <Header />

        {partner.hero.ribbonSrc && (
          <PageRibbon
            src={partner.hero.ribbonSrc}
            width={partner.hero.ribbonWidth ?? 1440}
            height={partner.hero.ribbonHeight ?? 696}
            className={clsx(
              styles.ribbonWrapper,
              slug === "databricks" && styles.databricksRibbonWrapper,
              slug === "shopify" && styles.shopifyRibbonWrapper,
              slug === "glean" && styles.gleanRibbonWrapper
            )}
            imageClassName={clsx(
              styles.ribbonImage,
              slug === "shopify" && styles.shopifyRibbonImage,
              slug === "glean" && styles.gleanRibbonImage
            )}
            priority
          />
        )}
      <Gradient
        top="85%"
        left="-5%"
        size="20rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
      <Gradient
        top="50%"
        left="-5%"
        size="30rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
         <Gradient
              top="35%"
              right="25%"
              size="45rem"
              stops={["#8500df 50%", "#edbf79 55%", "transparent 75%"]}
              opacity={0.1}
              blur="80px"
            />
         <Gradient
        kind="linear"
        angle="180deg"
        top="82%"
        right="25%"
        size="35rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
         <Gradient
        kind="linear"
        angle="180deg"
        top="15%"
        right="25%"
        size="35rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
      <Gradient
        top="75%"
        right="25%"
        size="20rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
      <Gradient
        top="23%"
        right="25%"
        size="40rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
         <Gradient
        kind="linear"
        angle="180deg"
        top="72%"
        left="-25%"
        size="35rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
        <main id="main-content">
          <PartnerHero hero={partner.hero} />
          {partner.intro && (
            <PartnerIntro
              intro={partner.intro}
              height={slug === "glean" ? "auto" : undefined}
            />
          )}
          {partner.storyBanner && (
            <PartnerStoryBanner
              data={partner.storyBanner}
              height={slug === "shopify" ? "auto" : undefined}
            />
          )}
          {slug === "shopify" && partner.agentTeams && (
            <PartnerAgentTeams data={partner.agentTeams} height="auto" />
          )}
          {partner.alternatingContent && (
            <PartnerAlternatingContent
              data={partner.alternatingContent}
              height={slug === "shopify" ? "auto" : undefined}
            />
          )}
          {partner.agenticEnterprise && (
            <AgenticEnterprise data={partner.agenticEnterprise} />
          )}
          {slug === "glean" ? (
            <>
              {partner.databricksControlTertiary && (
                <DatabricksControl
                  data={partner.databricksControlTertiary}
                  imagePosition="right"
                  height="auto"
                  id="judgment"
                />
              )}
              {partner.partnerDeploymentCard && (
                <PartnerDeploymentCard
                  data={partner.partnerDeploymentCard}
                  imagePosition={partner.partnerDeploymentCard.imagePosition}
                  height="auto"
                  id="scale-deployment"
                />
              )}
            </>
          ) : (
            <>
              {partner.databricksAgenticExecution && (
                <DatabricksAgenticExecution
                  data={partner.databricksAgenticExecution}
                />
              )}
              {partner.databricksBusinessContext && (
                <DatabricksBusinessContext
                  data={partner.databricksBusinessContext}
                />
              )}
              {partner.databricksControl && (
                <DatabricksControl
                  data={partner.databricksControl}
                />
              )}
              {partner.workflowFamilies && (
                <ServiceNowWorkflowFamilies
                  data={partner.workflowFamilies}
                />
              )}
              {partner.coordinatedAgents && (
                <WhatAgentsDo
                  data={partner.coordinatedAgents.data}
                  blocks={partner.coordinatedAgents.blocks}
                  variant="partner"
                  id="coordinated-agents"
                />
              )}
            </>
          )}
          {partner.solutions && (
            <Solutions
              data={partner.solutions}
              height={slug === "shopify" || slug === "glean" ? "auto" : undefined}
            />
          )}
          {slug === "glean" && (
            <>
              {partner.databricksControl && (
                <DatabricksControl
                  data={partner.databricksControl}
                  imagePosition="right"
                  height="auto"
                  id="domain-decisions"
                />
              )}
              {partner.databricksBusinessContext && (
                <DatabricksBusinessContext
                  data={partner.databricksBusinessContext}
                  height="auto"
                />
              )}
              {partner.databricksControlSecondary && (
                <DatabricksControl
                  data={partner.databricksControlSecondary}
                  imagePosition="left"
                  height="auto"
                  id="control"
                />
              )}
            </>
          )}
          {slug === "servicenow" && partner.partnerDeploymentCard && (
            <PartnerDeploymentCard
              data={partner.partnerDeploymentCard}
              imagePosition={partner.partnerDeploymentCard.imagePosition}
              height="auto"
              id="teams-in-control"
            />
          )}
          {slug === "servicenow" && partner.databricksControlSecondary && (
            <DatabricksControl
              data={partner.databricksControlSecondary}
              imagePosition="left"
              height="auto"
              id="scale-servicenow"
            />
          )}
          {slug !== "shopify" && partner.agentTeams && (
            <PartnerAgentTeams data={partner.agentTeams} />
          )}
          {slug === "shopify" ? (
            <>
              {partner.builtOnGemini && (
                <BuiltOnGemini
                  data={partner.builtOnGemini}
                  height="auto"
                />
              )}
              {partner.productionProof && (
                <ProductionProof data={partner.productionProof} />
              )}
            </>
          ) : (
            <>
              {partner.productionProof && (
                <ProductionProof
                  data={partner.productionProof}
                  height={slug === "glean" || slug === "servicenow" ? "auto" : undefined}
                />
              )}
              {partner.builtOnGemini && (
                <BuiltOnGemini data={partner.builtOnGemini} />
              )}
            </>
          )}
        </main>

        <Footer
          variant={partner.cta?.media ? "partner-card" : "partner-detail"}
          ctaData={
            partner.cta
              ? {
                  heading: partner.cta.heading,
                  description: partner.cta.description,
                  media: partner.cta.media,
                  buttons: [
                    {
                      label: partner.cta.buttonLabel,
                      href: partner.cta.buttonHref,
                      variant:
                        partner.cta.buttonVariant ??
                        (partner.cta.media ? "dark" : "primary"),
                      icon: partner.cta.buttonIcon ?? "cube",
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
