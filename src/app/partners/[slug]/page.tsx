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
import { AmpdTimeline } from "@/components/sections/Services/AmpdTimeline";
import { Solutions } from "@/components/sections/Partners/Detail/Solutions";
import { ProductionProof } from "@/components/sections/Partners/Detail/ProductionProof";
import { BuiltOnGemini } from "@/components/sections/Partners/Detail/BuiltOnGemini";
import { PartnerKeyBenefits } from "@/components/sections/Partners/Detail/PartnerKeyBenefits";
import { NvidiaAdvantage } from "@/components/sections/Partners/Detail/NvidiaAdvantage";
import { NvidiaIndustryEvolution } from "@/components/sections/Partners/Detail/NvidiaIndustryEvolution";
import { RunningToday } from "@/components/sections/Services/RunningToday";
import { ServiceCapabilityCards } from "@/components/sections/Services/Article/ServiceCapabilityCards";
import { Phase2 } from "@/components/sections/Blogs/Article/Phase2";
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
          slug === "servicenow" && styles.servicenowPage,
          slug === "salesforce" && styles.salesforcePage,
          slug === "tigergraph" && styles.tigergraphPage,
          slug === "aws" && styles.awsPage
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
              slug === "glean" && styles.gleanRibbonWrapper,
              slug === "nvidia" && styles.nvidiaRibbonWrapper,
              slug === "salesforce" && styles.salesforceRibbonWrapper,
              slug === "tigergraph" && styles.tigergraphRibbonWrapper,
              slug === "aws" && styles.awsRibbonWrapper
            )}
            imageClassName={clsx(
              styles.ribbonImage,
              slug === "shopify" && styles.shopifyRibbonImage,
              slug === "glean" && styles.gleanRibbonImage,
              slug === "nvidia" && styles.nvidiaRibbonImage,
              slug === "tigergraph" && styles.tigergraphRibbonImage,
              slug === "aws" && styles.awsRibbonImage
            )}
            priority
          />
        )}
        {slug !== "nvidia" && (
          <>
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
          </>
        )}
        <main id="main-content">
          <PartnerHero hero={partner.hero} />
          {partner.keyBenefits && (
            <PartnerKeyBenefits data={partner.keyBenefits} />
          )}
          {partner.nvidiaAdvantage && (
            <NvidiaAdvantage data={partner.nvidiaAdvantage} />
          )}
          {partner.industryEvolution && (
            <NvidiaIndustryEvolution data={partner.industryEvolution} />
          )}
          {partner.infrastructurePrinciples && (
            <RunningToday
              heading={partner.infrastructurePrinciples.heading}
              description={partner.infrastructurePrinciples.description}
              metrics={partner.infrastructurePrinciples.metrics}
              columns={4}
              align="left"
              highlightPhrase="Infrastructure"
              tintLastCard={false}
              id="infrastructure-design-principles"
              className={styles.nvidiaInfrastructureSection}
            />
          )}
          {partner.intro && (
            <PartnerIntro
              intro={partner.intro}
              height={slug === "glean" || slug === "aws" ? "auto" : undefined}
            />
          )}
          {slug !== "aws" && partner.storyBanner && (
            <PartnerStoryBanner
              data={partner.storyBanner}
              height={slug === "shopify" ? "auto" : undefined}
            />
          )}
          {slug === "shopify" && partner.agentTeams && (
            <PartnerAgentTeams data={partner.agentTeams} height="auto" />
          )}
          {slug === "salesforce" && partner.agentTeams && (
            <PartnerAgentTeams
              data={partner.agentTeams}
              columns={3}
              align="center"
              hoverable
            />
          )}
          {slug !== "salesforce" && slug !== "tigergraph" && partner.alternatingContent && (
            <PartnerAlternatingContent
              data={partner.alternatingContent}
              height={slug === "shopify" || slug === "aws" ? "auto" : undefined}
            />
          )}
          {slug === "aws" && partner.partnerDeploymentCard && (
            <PartnerDeploymentCard
              data={partner.partnerDeploymentCard}
              imagePosition={partner.partnerDeploymentCard.imagePosition}
              height="auto"
              id="aws-data-ai-stack"
              accentHeading
              largeBodyText
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
              {slug !== "tigergraph" && partner.databricksBusinessContext && (
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
              {slug !== "aws" && partner.coordinatedAgents && (
                <WhatAgentsDo
                  data={partner.coordinatedAgents.data}
                  blocks={partner.coordinatedAgents.blocks}
                  variant="partner"
                  id="coordinated-agents"
                  showAccentBar={slug === "tigergraph"}
                />
              )}
            </>
          )}
          {slug !== "aws" && partner.solutions && (
            <Solutions
              data={partner.solutions}
              height={
                slug === "shopify" || slug === "glean" || slug === "nvidia" || slug === "tigergraph"
                  ? "auto"
                  : undefined
              }
              align={slug === "salesforce" ? "center" : undefined}
              columnDivider={slug === "salesforce" || slug === "nvidia" || slug === "tigergraph"}
              reverseArrows={slug === "salesforce" || slug === "nvidia"}
              accentInactiveTitles={slug === "salesforce" || slug === "nvidia"}
              largeBodyText={slug === "salesforce"}
              nvidiaTypography={slug === "nvidia"}
              variant={slug === "tigergraph" ? "tigergraph" : undefined}
            />
          )}
          {partner.capabilityPortfolio && (
            <ServiceCapabilityCards
              {...partner.capabilityPortfolio}
              id="capability-portfolio"
              className={styles.nvidiaCapabilityPortfolioSection}
            />
          )}
          {partner.marketValidation && (
            <PartnerAgentTeams
              data={partner.marketValidation}
              columns={3}
              align="center"
              hoverable
              height={slug === "nvidia" ? "viewport" : "auto"}
              nvidiaTypography={slug === "nvidia"}
              id="market-validation"
              className={
                slug === "nvidia"
                  ? styles.nvidiaMarketValidationSection
                  : undefined
              }
            />
          )}
          {slug === "salesforce" && partner.aiCapabilities && (
            <Phase2
              id="ai-data-capabilities"
              title={partner.aiCapabilities.heading}
              items={partner.aiCapabilities.items}
              highlightPosition="start"
              highlightCount={3}
              dividerVariant="accent"
            />
          )}
          {slug === "salesforce" && partner.alternatingContent && (
            <PartnerAlternatingContent
              data={partner.alternatingContent}
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
          {slug !== "shopify" && slug !== "salesforce" && partner.agentTeams && (
            <PartnerAgentTeams
              data={partner.agentTeams}
              columns={slug === "tigergraph" || slug === "aws" ? 3 : undefined}
              height={slug === "tigergraph" || slug === "aws" ? "auto" : undefined}
              hoverable={slug === "tigergraph" ? true : undefined}
              id={slug === "tigergraph" ? "connected-data-use-cases" : undefined}
              hideAccentBar={slug === "aws" ? true : undefined}
              headingHighlightWords={slug === "aws" ? 2 : undefined}
            />
          )}
          {/* AWS FinOps: ribbon + heading/description, then capability cards
              with the reported-outcomes panel, placed after "What Agivant brings". */}
          {slug === "aws" && partner.storyBanner && (
            <PartnerStoryBanner
              data={partner.storyBanner}
              height="auto"
              align="center"
            />
          )}
          {slug === "aws" && partner.coordinatedAgents && (
            <WhatAgentsDo
              data={partner.coordinatedAgents.data}
              blocks={partner.coordinatedAgents.blocks}
              variant="partner"
              id="aws-finops"
              outcome={partner.coordinatedAgents.outcome}
            />
          )}
          {slug === "aws" && partner.timeline && (
            <AmpdTimeline {...partner.timeline} />
          )}
          {slug === "aws" && partner.alternatingContentSecondary && (
            <PartnerAlternatingContent
              data={partner.alternatingContentSecondary}
              height="auto"
              id={partner.alternatingContentSecondary.id}
            />
          )}
          {slug === "aws" && partner.solutions && (
            <Solutions
              data={partner.solutions}
              height="auto"
              align="center"
              columnDivider
            />
          )}
          {slug === "aws" && partner.aiCapabilities && (
            <Phase2
              id="how-engagement-runs"
              title={partner.aiCapabilities.heading}
              items={partner.aiCapabilities.items}
              highlightPosition="start"
              highlightCount={2}
              dividerVariant="accent"
            />
          )}
          {slug === "tigergraph" && partner.databricksBusinessContext && (
            <DatabricksBusinessContext
              data={partner.databricksBusinessContext}
              height="auto"
              id="engineering-depth"
            />
          )}
          {slug === "tigergraph" && partner.alternatingContent && (
            <PartnerAlternatingContent
              data={partner.alternatingContent}
              variant="tigergraph"
              height="auto"
              id="get-ampd"
            />
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
                  height={slug === "glean" || slug === "servicenow" || slug === "tigergraph" ? "auto" : undefined}
                />
              )}
              {partner.builtOnGemini && (
                <BuiltOnGemini data={partner.builtOnGemini} />
              )}
            </>
          )}
        </main>

        <Footer
          variant={
            slug === "nvidia"
              ? "default"
              : partner.cta?.media
              ? "partner-card"
              : "partner-detail"
          }
          ctaData={
            partner.cta
              ? {
                  heading: partner.cta.heading,
                  description: partner.cta.description,
                  media: partner.cta.media,
                  buttons:
                    partner.cta.buttons && partner.cta.buttons.length > 0
                      ? partner.cta.buttons
                      : [
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
