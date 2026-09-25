/**
 * src/types/partnerDetail.ts
 *
 * Types for dedicated Partner Detail Pages (/partners/[slug]).
 * Single source of truth for the data driving the partner detail experiences.
 * CMS-ready: structured so WordPress / Headless CMS responses map
 * directly into these interfaces without modifying presentation components.
 */

import type { RunningTodayMetric } from "@/data/services";
import type { ServiceCapabilityCardsProps } from "@/components/sections/Services/Article/ServiceCapabilityCards";
import type { AmpdTimelineProps } from "@/components/sections/Services/AmpdTimeline";

export interface PartnerHeroData {
  headingLine1: string;
  headingLine2: string;
  headingLines?: string[];
  partnerLogo: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    assetKey?: string;
  };
  ribbonSrc: string;
  ribbonWidth?: number;
  ribbonHeight?: number;
  subtitle?: string | null;
  primaryCta?: {
    enabled?: boolean;
    label: string | null;
    href: string | null;
    icon?: string;
  } | null;
}

export interface LeadershipQuoteData {
  quote: string;
  author: {
    name: string;
    role: string;
    portraitSrc: string;
  };
}

export interface StatementCardData {
  text: string;
}

export interface PartnerIntroData {
  heading?: {
    prefix?: string;
    highlight: string;
    suffix: string;
  };
  paragraphs: string[];
  leadershipQuote?: LeadershipQuoteData;
  statementCard?: StatementCardData;
  supportingStatement?: string;
  ctaAlign?: "left" | "center";
  cta?: {
    label: string;
    href: string;
    icon?: string;
  };
}

export interface AgenticEnterpriseMetricsData {
  items: string[];
  closingStatement?: string;
}

export interface AgenticEnterpriseBlockData {
  id: string;
  layout?: "text-image" | "text-metrics" | "image-text" | "image-stacked" | "stacked";
  eyebrow?: string;
  heading: {
    prefix?: string;
    highlight?: string;
    suffix?: string;
    text?: string;
  };
  supportingStatement?: string;
  body: string;
  paragraphs?: string[];
  closingStatement?: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  metrics?: AgenticEnterpriseMetricsData;
}

export interface AgenticEnterpriseData {
  blocks: AgenticEnterpriseBlockData[];
}

export interface AgentTeamMember {
  name: string;
  role: string;
}

/**
 * One supporting metric shown in an accelerator's proof area, e.g.
 * value: "Days → Minutes", label: "Quoting cycle compression, start to
 * finish". Pre-formatted content, not computed values — matches the
 * project's existing convention (see Episode.duration in techtalk
 * types) of storing display-ready strings rather than raw numbers.
 */
export interface AcceleratorProofMetric {
  value: string;
  label: string;
}

/**
 * Video reference for an accelerator's proof area. Intentionally a
 * plain domain shape — NOT the UI layer's VideoSource type from
 * @/components/ui/VideoPlayer. This file stays independent of any UI
 * component's types; the presentation component that consumes this
 * data is responsible for mapping `provider`/`id` into whatever shape
 * VideoPlayer's props require. Today the only shipped provider is
 * "youtube", mirrored here as a literal rather than a wider `string`
 * so a typo can't silently produce an unplayable video.
 */
export interface AcceleratorProofVideo {
  provider: "youtube";
  /** Provider-specific video identifier (e.g. YouTube video ID). */
  id: string;
  /** Poster/thumbnail image shown before playback starts. */
  poster: string;
  /** Accessible title for the video/player region. */
  title: string;
}

/**
 * Content for an accelerator's "Proof" area: the metric-led narrative
 * and supporting video show beneath the challenge/solution/agent-team
 * panel for the currently active accelerator. Content and media
 * references only — no presentation/layout values.
 */
export interface AcceleratorProofData {
  /** Optional small label above the headline (e.g. "Reported outcomes"). */
  eyebrow?: string;
  headline: string;
  description: string;
  metrics?: AcceleratorProofMetric[];
  highlights?: string[];
  video: AcceleratorProofVideo;
}

export interface PartnerAccelerator {
  id: string;
  title: string;
  category: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  challenge: string;
  solution: string;
  agentTeamTitle?: string;
  agentTeamDescription?: string;
  agents?: AgentTeamMember[];
  proof?: AcceleratorProofData;
  /** Optional list for the panel's first column (from the card's `items`). */
  items?: string[];
  /** Optional highlight statement pill at the bottom of the display panel. */
  highlightStatement?: string;
}

export interface PartnerSolutionsData {
  heading: {
    prefix?: string;
    highlight?: string;
    suffix?: string;
    text?: string;
  };
  /** Optional subheading rendered above the description. */
  subheading?: string;
  description: string;
  accelerators: PartnerAccelerator[];
  /** Optional panel column titles (from the section's `data.columns`). */
  columnLabels?: string[];
  /** Optional closing statement rendered beneath the display panel. */
  closingStatement?: string;
}

export interface PartnerCTAData {
  heading: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  buttonIcon?: "cube" | "arrow-up-right";
  buttonVariant?: "primary" | "dark";
  media?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  buttons?: Array<{
    label: string;
    href: string;
    variant: "primary" | "dark";
    icon?: "cube" | "arrow-up-right";
  }>;
}

export interface ProductionProofCardData {
  id: string;
  badge?: string;
  title: string;
  description: string;
  metric: string;
  ctaLabel?: string;
  caseStudySlug: string;
  /** Card destination (from the block's `cta.href`). Empty/absent: the
   *  card renders without a link and does not navigate. */
  href?: string;
  image: {
    src: string;
    alt: string;
  };
}

export interface PartnerProductionProofData {
  heading: {
    highlight: string;
    rest: string;
  };
  description: string;
  cards: ProductionProofCardData[];
}

export interface BuiltOnGeminiCardData {
  id: string;
  badge?: string;
  title: string;
  slug: string;
  description: string;
  metric: string;
  ctaLabel?: string;
  image: {
    src: string;
    alt: string;
  };
}

export interface PartnerBuiltOnGeminiData {
  heading: {
    highlight: string;
    rest: string;
  };
  description: string;
  cards: BuiltOnGeminiCardData[];
}

export interface PartnerStoryBannerData {
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  heading: {
    highlight?: string;
    text: string;
  };
  description: string;
}

export interface DatabricksAgenticExecutionData {
  eyebrow: string;
  heading: string;
  supportingStatement: string;
  paragraphs: string[];
  closingStatement: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export interface PartnerBusinessContextCard {
  id: string;
  title: string;
  description: string;
}

export interface DatabricksBusinessContextData {
  heading: string;
  description: string;
  cards: PartnerBusinessContextCard[];
  closingStatement: string;
}

export interface DatabricksControlData {
  heading: string;
  description: string;
  closingStatement?: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export interface PartnerAgentTeamsCardData {
  id: string;
  title?: string;
  text: string;
  ribbon: string;
}

export interface PartnerAgentTeamsData {
  heading: string;
  description: string;
  cards: PartnerAgentTeamsCardData[];
  closingStatement?: string;
}

export interface PartnerAlternatingRowData {
  id: string;
  heading: {
    highlight: string;
    text: string;
  };
  description: string;
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  imagePosition: "left" | "right";
  isCard?: boolean;
}

export interface PartnerAlternatingContentData {
  id?: string;
  rows: PartnerAlternatingRowData[];
}

export interface WorkflowFamiliesCardData {
  id: string;
  title: string;
  body: string;
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  imagePosition: "left" | "right";
}

export interface WorkflowFamiliesData {
  heading: string;
  description: string;
  cards: WorkflowFamiliesCardData[];
  closingStatement?: string;
}

export interface PartnerDeploymentCardData {
  heading: {
    highlight?: string;
    text?: string;
    raw?: string;
  };
  description: string;
  closingStatement?: string;
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  imagePosition?: "left" | "right";
}

export interface PartnerWhatAgentsDoData {
  data: {
    heading?: string | null;
    description?: string | null;
    eyebrow?: string | null;
    closingStatement?: string | null;
  };
  /** Optional outcome panel rendered below the card grid (e.g. AWS FinOps). */
  outcome?: {
    label?: string | null;
    value: string;
    text?: string | null;
  };
  blocks: Array<{
    id: string;
    title?: string | null;
    body?: string | null;
  }>;
}

export interface PartnerDetailData {
  slug: string;
  name: string;
  meta: {
    title: string;
    description: string;
  };
  hero: PartnerHeroData;
  intro?: PartnerIntroData;
  storyBanner?: PartnerStoryBannerData;
  agentTeams?: PartnerAgentTeamsData;
  alternatingContent?: PartnerAlternatingContentData;
  /** Second alternating_content section on the same page, if any. */
  alternatingContentSecondary?: PartnerAlternatingContentData;
  agenticEnterprise?: AgenticEnterpriseData;
  databricksAgenticExecution?: DatabricksAgenticExecutionData;
  databricksBusinessContext?: DatabricksBusinessContextData;
  databricksControl?: DatabricksControlData;
  databricksControlSecondary?: DatabricksControlData;
  databricksControlTertiary?: DatabricksControlData;
  partnerDeploymentCard?: PartnerDeploymentCardData;
  workflowFamilies?: WorkflowFamiliesData;
  coordinatedAgents?: PartnerWhatAgentsDoData;
  solutions?: PartnerSolutionsData;
  productionProof?: PartnerProductionProofData;
  builtOnGemini?: PartnerBuiltOnGeminiData;
  keyBenefits?: NvidiaKeyBenefitsData;
  nvidiaAdvantage?: NvidiaAdvantageData;
  industryEvolution?: NvidiaIndustryEvolutionData;
  infrastructurePrinciples?: PartnerInfrastructurePrinciplesData;
  capabilityPortfolio?: ServiceCapabilityCardsProps;
  marketValidation?: PartnerAgentTeamsData;
  aiCapabilities?: PartnerNumberedListData;
  /** Numbered accordion timeline (from an `ampd-timeline` section), rendered with AmpdTimeline. */
  timeline?: AmpdTimelineProps;
  cta?: PartnerCTAData;
}

/**
 * Numbered list section (from a `numbered_list` section with
 * `numberedItem` blocks). Items match the Blogs Phase2Item shape.
 */
export interface PartnerNumberedListData {
  heading: string;
  items: Array<{
    index: string;
    title: string;
    description: string;
  }>;
}

export interface NvidiaBenefitCardData {
  id: string;
  label: string;
  value: string;
  description: string;
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
}

export interface NvidiaKeyBenefitsData {
  heading: string;
  description?: string;
  cards: NvidiaBenefitCardData[];
}

export interface NvidiaAdvantageStageData {
  id: string;
  step: string;
  title: string;
  description: string;
}

export interface NvidiaAdvantageData {
  heading: string;
  description?: string;
  stages: NvidiaAdvantageStageData[];
}

export interface NvidiaIndustryEvolutionItem {
  label: string;
  description: string;
}

export interface NvidiaIndustryEvolutionColumn {
  title: string;
  items: NvidiaIndustryEvolutionItem[];
}

export interface NvidiaIndustryEvolutionData {
  heading: string;
  description?: string;
  legacy: NvidiaIndustryEvolutionColumn;
  modern: NvidiaIndustryEvolutionColumn;
  ribbon?: {
    src: string;
    width: number;
    height: number;
    alt?: string;
  };
}

export interface PartnerInfrastructurePrinciplesData {
  heading: string;
  description?: string;
  metrics: RunningTodayMetric[];
}

