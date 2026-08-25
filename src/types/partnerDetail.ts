/**
 * src/types/partnerDetail.ts
 *
 * Types for dedicated Partner Detail Pages (/partners/[partner]).
 * CMS-ready: structured so WordPress / Headless CMS responses map
 * directly into these interfaces without modifying presentation components.
 */

export interface PartnerHeroData {
  headingLine1: string;
  headingLine2: string;
  partnerLogo: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  ribbonSrc: string;
}

export interface LeadershipQuoteData {
  quote: string;
  author: {
    name: string;
    role: string;
    portraitSrc: string;
  };
}

export interface PartnerIntroData {
  heading: {
    highlight: string;
    suffix: string;
  };
  paragraphs: string[];
  leadershipQuote: LeadershipQuoteData;
  cta?: {
    label: string;
    href: string;
  };
}

export interface AgenticEnterpriseMetricsData {
  items: string[];
  closingStatement?: string;
}

export interface AgenticEnterpriseBlockData {
  id: string;
  layout?: "text-image" | "text-metrics" | "image-text";
  heading: {
    prefix?: string;
    highlight?: string;
    suffix?: string;
    text?: string;
  };
  body: string;
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
  agents: AgentTeamMember[];
  proof: AcceleratorProofData;
}

export interface PartnerSolutionsData {
  heading: {
    prefix: string;
    highlight: string;
  };
  description: string;
  accelerators: PartnerAccelerator[];
}

export interface PartnerCTAData {
  heading: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  buttonIcon?: "cube" | "arrow-up-right";
}

export interface ProductionProofCardData {
  id: string;
  badge?: string;
  title: string;
  description: string;
  metric: string;
  ctaLabel?: string;
  caseStudySlug: string;
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
  description: string;
  metric: string;
  ctaLabel?: string;
  solutionId?: string;
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

export interface PartnerDetailData {
  slug: string;
  name: string;
  meta: {
    title: string;
    description: string;
  };
  hero: PartnerHeroData;
  intro: PartnerIntroData;
  agenticEnterprise?: AgenticEnterpriseData;
  solutions?: PartnerSolutionsData;
  productionProof?: PartnerProductionProofData;
  builtOnGemini?: PartnerBuiltOnGeminiData;
  cta?: PartnerCTAData;
}
