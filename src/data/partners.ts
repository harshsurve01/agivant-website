// data/partners.ts
import { existsSync } from "fs";
import path from "path";

/**
 * data/partners.ts
 *
 * CMS-ready data layer for the Partners section.
 */

export interface PartnerLogo {
  id: string;
  name: string;
  image: {
    src: string;
    alt: string;
  };
  website?: string;
}

interface PartnersHeaderContent {
  heading: {
    line1: string;
    line2: string;
  };
  description: string;
}

interface PartnersCTA {
  label: string;
  href: string;
}

async function getPartnersHeaderContent(): Promise<PartnersHeaderContent> {
  return {
    heading: {
      line1: "Agivant Is Trusted By",
      line2: "Global Partners",
    },
    description:
      "Agivant works across global hyperscaler, data, AI & workflow platforms enterprises depend on.",
  };
}

export const getPartnersHeader = getPartnersHeaderContent;

/**
 * The full partner roster, in a fixed display order. Add/remove
 * partners here only; getPartnerLogoPairs() below adapts
 * automatically to whichever of these actually have a real asset
 * file on disk, and chunks them into the 4 card slots' pairs.
 */
const ALL_PARTNER_LOGOS: PartnerLogo[] = [
  {
    id: "glean",
    name: "Glean",
    image: { src: "/images/partners/glean.png", alt: "Glean" },
    website: "https://www.glean.com",
  },
  {
    id: "servicenow",
    name: "ServiceNow",
    image: { src: "/images/partners/servicenow.png", alt: "ServiceNow" },
    website: "https://www.servicenow.com",
  },
 
  
   {
     id: "gemini",
     name: "GEMINI",
     image: { src: "/images/partners/gemini.png", alt: "GEMINI" },
     website: "https://www.gemini.com",
   },
  {
    id: "nvidia",
    name: "NVIDIA",
    image: { src: "/images/partners/nvidia.png", alt: "NVIDIA" },
    website: "https://www.nvidia.com",
  },
  {
    id: "aws",
    name: "AWS",
    image: { src: "/images/partners/aws.png", alt: "AWS" },
    website: "https://aws.amazon.com",
  },
  {
    id: "azure",
    name: "Azure",
    image: { src: "/images/partners/azure.png", alt: "Azure" },
    website: "https://azure.microsoft.com",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    image: { src: "/images/partners/salesforce.png", alt: "Salesforce" },
    website: "https://www.salesforce.com",
  },
  
  {
    id: "databricks",
    name: "Databricks",
    image: { src: "/images/partners/databricks.png", alt: "Databricks" },
    website: "https://www.databricks.com",
  },
  {
    id: "shopify",
    name: "Shopify",
    image: { src: "/images/partners/shopify.png", alt: "Shopify" },
    website: "https://www.shopify.com",
  },
  {
    id: "tigergraph",
    name: "TigerGraph",
    image: { src: "/images/partners/tigergraph.png", alt: "TigerGraph" },
    website: "https://www.tigergraph.com",
  },
];

/**
 * Whether a logo's asset actually exists under /public. Filtering on
 * this — rather than trusting ALL_PARTNER_LOGOS blindly — guarantees
 * "never use placeholder logos": only assets that are actually
 * present ever enter a slot's sequence.
 */
function assetExists(publicSrc: string): boolean {
  const absolutePath = path.join(process.cwd(), "public", publicSrc);
  return existsSync(absolutePath);
}

/** Group of logos assigned to one slot. */
export type PartnerLogoGroup = PartnerLogo[];

/** 4 slots with 3 + 3 + 2 + 2 capacity for the 10-partner roster. */
const SLOT_CAPACITIES = [3, 3, 2, 2];

/**
 * Builds the 4 slot groups consumed by the 4 LogoShift instances:
 * - Slot 0 (3): Glean, ServiceNow, GEMINI
 * - Slot 1 (3): NVIDIA, AWS, Azure
 * - Slot 2 (2): Salesforce, Databricks
 * - Slot 3 (2): Shopify, TigerGraph
 *
 * Deterministic, never randomized, all 10 partners represented with zero duplicates.
 */
async function getPartnerLogoPairsContent(): Promise<PartnerLogoGroup[]> {
  const availableLogos = ALL_PARTNER_LOGOS.filter((logo) =>
    assetExists(logo.image.src)
  );

  const slots: PartnerLogoGroup[] = [];
  let offset = 0;
  for (const capacity of SLOT_CAPACITIES) {
    const group = availableLogos.slice(offset, offset + capacity);
    if (group.length > 0) {
      slots.push(group);
    }
    offset += capacity;
  }

  return slots;
}

export const getPartnerLogoPairs = getPartnerLogoPairsContent;

async function getPartnersCTAContent(): Promise<PartnersCTA> {
  return {
    label: "See our ecosystem partnerships",
    href: "/partners",
  };
}

export const getPartnersCTA = getPartnersCTAContent;

/* ==========================================================================
   Partners Page (/partners) Inner Hero & Ecosystem Data
   ========================================================================== */

export interface PartnersHeroData {
  heading: string;
  description: string;
}

export const partnersHeroData: PartnersHeroData = {
  heading: "Ecosystem partnerships",
  description: "Built around the platforms enterprises already run",
};

export interface PartnerCardItem {
  name: string;
  slug: string;
  logo: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  description: string;
  href: string;
  hoverColor?: string;
  hoverAccent?: string;
}

export interface EcosystemSectionData {
  heading: string;
  description: string;
  partners: PartnerCardItem[];
}

export const ecosystemSectionData: EcosystemSectionData = {
  heading: "Explore the ecosystem",
  description:
    "Agivant engineers agentic AI into production across the cloud, data, AI, and workflow platforms enterprises depend on.",
  partners: [
    {
      name: "AWS",
      slug: "aws",
      logo: { src: "/images/partners/aws.png", alt: "AWS" },
      description: "Well-Architected practice for every migration",
      href: "/partners/aws",
      hoverColor: "#ff990118",
      hoverAccent: "#ff9901",
    },
    {
      name: "Azure",
      slug: "azure",
      logo: { src: "/images/partners/azure.png", alt: "Azure" },
      description: "Optimization practice, built on Agivant's own AOAF",
      href: "/partners/azure",
      hoverColor: "rgba(0, 120, 212, 0.12)",
      hoverAccent: "#0078D4",
    },
    {
      name: "Databricks",
      slug: "databricks",
      logo: { src: "/images/partners/databricks.png", alt: "Databricks" },
      description: "Bronze Partner, building agents on the Lakehouse",
      href: "/partners/databricks",
      hoverColor: "rgba(255, 54, 33, 0.12)",
      hoverAccent: "#FF3621",
    },
    {
      name: "Gemini Enterprise",
      slug: "gemini-enterprise",
      logo: { src: "/images/partners/gemini.png", alt: "Gemini Enterprise" },
      description:
        "Dedicated practice, built on Google's Agent Development Kit",
      href: "/partners/gemini-enterprise",
      hoverColor: "#3385ff16",
      hoverAccent: "#3385ff",
    },
    {
      name: "Glean",
      slug: "glean",
      logo: { src: "/images/partners/glean.png", alt: "Glean" },
      description: "Work AI collaboration, built on domain accelerators",
      href: "/partners/glean",
      hoverColor: "rgba(37, 99, 235, 0.12)",
      hoverAccent: "#2563EB",
    },
    {
      name: "NVIDIA",
      slug: "nvidia",
      logo: { src: "/images/partners/nvidia.png", alt: "NVIDIA" },
      description: "GPU-native AI practice on the full CUDA stack",
      href: "/partners/nvidia",
      hoverColor: "rgba(118, 185, 0, 0.14)",
      hoverAccent: "#76B900",
    },
    {
      name: "Salesforce",
      slug: "salesforce",
      logo: { src: "/images/partners/salesforce.png", alt: "Salesforce" },
      description: "AI practice across Data Cloud, Einstein, and Agentforce",
      href: "/partners/salesforce",
      hoverColor: "rgba(0, 161, 224, 0.14)",
      hoverAccent: "#00A1E0",
    },
    {
      name: "ServiceNow",
      slug: "servicenow",
      logo: { src: "/images/partners/servicenow.png", alt: "ServiceNow" },
      description: "AI-first migration and automation practice",
      href: "/partners/servicenow",
      hoverColor: "#60d25316",
      hoverAccent: "#60d253",
    },
    {
      name: "Shopify",
      slug: "shopify",
      logo: { src: "/images/partners/shopify.png", alt: "Shopify" },
      description: "Agentic commerce practice on the Shopify platform",
      href: "/partners/shopify",
      hoverColor: "rgba(149, 191, 71, 0.15)",
      hoverAccent: "#5E8E3E",
    },
    {
      name: "TigerGraph",
      slug: "tigergraph",
      logo: { src: "/images/partners/tigergraph.png", alt: "TigerGraph" },
      description: "Named Global Engineering Center partner",
      href: "/partners/tigergraph",
      hoverColor: "rgba(244, 124, 32, 0.14)",
      hoverAccent: "#F47C20",
    },
  ],
};

/* ==========================================================================
   Partner Detail Pages Data (/partners/[slug])
   CMS-ready structure for dynamic routing
   ========================================================================== */

import type {
  PartnerDetailData,
  PartnerHeroData,
  PartnerIntroData,
  AgenticEnterpriseData,
  PartnerSolutionsData,
  PartnerProductionProofData,
  PartnerBuiltOnGeminiData,
  PartnerCTAData,
} from "@/types/partnerDetail";

/* ==========================================================================
   Standardized Partner Detail Data Schema
   Conforms to senior developer's backend reference JSON (partnership_single.json)
   ========================================================================== */

export interface StandardizedMediaObject {
  kind: "image" | "video" | "logo" | "diagram";
  src: string | null;
  assetKey: string | null;
  alt: string | null;
  caption: string | null;
  /** Frontend-specific dimensions & metadata preserved for Next.js <Image> */
  width?: number;
  height?: number;
  provider?: "youtube";
  id?: string;
  poster?: string;
}

export interface StandardizedCTAObject {
  enabled: boolean;
  label: string | null;
  href: string | null;
  external: boolean;
  /** Frontend-specific CTA visual icon */
  icon?: "cube" | "arrow-up-right";
}

export interface StandardizedPartnerRef {
  name: string;
  logo: StandardizedMediaObject;
}

export interface StandardizedSEO {
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogImage: string | null;
}

export interface StandardizedHero {
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  summary: string | null;
  authors: string[];
  partner: StandardizedPartnerRef;
  media: StandardizedMediaObject;
  primaryCta: StandardizedCTAObject | null;
  secondaryCta: StandardizedCTAObject | null;
  /** Frontend-only: multi-line split heading required by PartnerHero layout */
  headingLine1?: string;
  headingLine2?: string;
  /** Frontend-only: ribbon asset path for decorative PageRibbon */
  ribbonSrc?: string;
}

export interface StandardizedSectionBlock {
  id: string;
  type: string;
  heading?: string | null;
  body?: string | null;
  eyebrow?: string | null;
  title?: string | null;
  quote?: string | null;
  authorName?: string | null;
  authorRole?: string | null;
  authorImage?: StandardizedMediaObject | null;
  media?: StandardizedMediaObject | null;
  cta?: StandardizedCTAObject | null;
  items?: string[];
  description?: string;
  /** Frontend-only preserved fields */
  paragraphs?: string[];
  metric?: string;
  badge?: string;
  caseStudySlug?: string;
  slug?: string;
  isTall?: boolean;
  challenge?: string;
  solution?: string;
  agentTeamTitle?: string;
  agents?: Array<{ name: string; role: string }>;
  proof?: {
    headline: string;
    description: string;
    metrics?: Array<{ value: string; label: string }>;
    highlights?: string[];
    video: {
      provider: "youtube";
      id: string;
      poster: string;
      title: string;
    };
  };
}

export interface StandardizedSectionData {
  eyebrow: string | null;
  heading: string | null;
  description: string | null;
  columns: unknown[];
  media: StandardizedMediaObject | null;
  cta: StandardizedCTAObject | null;
  /** Frontend-only preserved structural / layout metadata */
  layout?: "text-image" | "text-metrics" | "image-text";
  closingStatement?: string;
  highlights?: string[];
  metrics?: Array<{ value: string; label: string }>;
  headingStructure?: {
    highlight?: string;
    suffix?: string;
    prefix?: string;
    text?: string;
    rest?: string;
  };
}

export interface StandardizedSection {
  id: string;
  type:
    | "rich_text"
    | "quote"
    | "split_content"
    | "checklist"
    | "card_grid"
    | "media"
    | "case_study_grid";
  enabled: boolean;
  conditions: Record<string, unknown> | null;
  data: StandardizedSectionData;
  blocks: StandardizedSectionBlock[];
}

export interface StandardizedFooterCTA {
  enabled: boolean;
  heading: string;
  subheading: string | null;
  partner: StandardizedPartnerRef;
  primaryCta: StandardizedCTAObject | null;
  secondaryCta: StandardizedCTAObject | null;
  /** Frontend-only: draft banner text */
  rawHeading?: string;
}

export interface StandardizedPartnerDetailPage {
  schemaVersion: "1.0";
  pageType: "partnershipLanding";
  slug: string;
  title: string;
  name?: string;
  seo: StandardizedSEO;
  hero: StandardizedHero;
  sections: StandardizedSection[];
  footerCta: StandardizedFooterCTA;
}

export const PARTNERS_DETAIL_DATA: Record<string, StandardizedPartnerDetailPage> = {
  "gemini-enterprise": {
    schemaVersion: "1.0",
    pageType: "partnershipLanding",
    slug: "gemini-enterprise",
    title: "Turn AI pilots into enterprise-wide business value with Gemini Enterprise",
    name: "Gemini Enterprise",
    seo: {
      title: "Gemini Enterprise Partnership | Agivant",
      description:
        "Turn AI pilots into enterprise-wide business value with Gemini Enterprise and Agivant Technologies.",
      canonical: null,
      ogImage: null,
    },
    hero: {
      eyebrow: null,
      title: "Turn AI pilots into enterprise-wide business value with Gemini Enterprise",
      subtitle: null,
      summary: null,
      authors: [],
      partner: {
        name: "Gemini Enterprise",
        logo: {
          kind: "logo",
          src: "/images/partners/gemini.png",
          assetKey: "gemini-enterprise-logo",
          alt: "Gemini Enterprise logo",
          caption: null,
          width: 567,
          height: 67,
        },
      },
      media: {
        kind: "image",
        src: "/images/partners/gemini/gemini-hero-ribbon.png",
        assetKey: "hero-ribbon",
        alt: "Abstract blue ribbon graphic",
        caption: null,
      },
      primaryCta: null,
      secondaryCta: null,
      headingLine1: "Turn AI pilots into enterprise-wide",
      headingLine2: "business value with",
      ribbonSrc: "/images/partners/gemini/gemini-hero-ribbon.png",
    },
    sections: [
      {
        id: "production-value",
        type: "rich_text",
        enabled: true,
        conditions: null,
        data: {
          eyebrow: null,
          heading: "From Gemini Enterprise to production value",
          description: null,
          columns: [],
          media: null,
          cta: null,
          headingStructure: {
            highlight: "From Gemini Enterprise",
            suffix: "to production value",
          },
        },
        blocks: [
          {
            id: "production-value-copy",
            type: "richText",
            heading: null,
            body: "Agivant Technologies launches a dedicated Gemini Enterprise practice with Google Cloud, turning ambitious AI pilots into production-grade agents that deliver real business outcomes every day.\n\nBuilt on the Gemini Enterprise Agent Platform, Google's Agent Development Kit (ADK), and production-grade architectures, we help organizations advance from early prototypes to resilient, self-orchestrating agentic environments in days and weeks.",
            paragraphs: [
              "Agivant Technologies launches a dedicated Gemini Enterprise practice with Google Cloud, turning ambitious AI pilots into production-grade agents that deliver real business outcomes every day.",
              "Built on the Gemini Enterprise Agent Platform, Google's Agent Development Kit (ADK), and production-grade architectures, we help organizations advance from early prototypes to resilient, self-orchestrating agentic environments in days and weeks.",
            ],
          },
        ],
      },
      {
        id: "customer-quote",
        type: "quote",
        enabled: true,
        conditions: null,
        data: {
          eyebrow: null,
          heading: null,
          description: null,
          columns: [],
          media: null,
          cta: {
            enabled: true,
            label: "See the accelerators in action",
            href: "#accelerators",
            external: false,
          },
        },
        blocks: [
          {
            id: "quote-1",
            type: "quote",
            quote:
              "The shift to the agentic enterprise is redefining how businesses operate, innovate, and grow. Our dedicated Gemini Enterprise practice helps organizations move beyond experimentation and into real, enterprise-wide impact.",
            authorName: "Ajay Malgaonkar",
            authorRole: "Chief Digital Delivery Officer, Agivant Technologies",
            authorImage: {
              kind: "image",
              src: "/images/partners/gemini/intro/ajay-malgaonkar.png",
              assetKey: "partnership-quote-author",
              alt: "Ajay Malgaonkar",
              caption: null,
            },
          },
        ],
      },
      {
        id: "autonomous-workflows",
        type: "split_content",
        enabled: true,
        conditions: null,
        data: {
          eyebrow: null,
          heading: "Get Amp'd to move from AI ambition to autonomous workflows.",
          description: null,
          columns: [],
          media: {
            kind: "image",
            src: "/images/partners/gemini/agentic-enterprise/agentic-enterprise-ambition.png",
            assetKey: "autonomous-workflows",
            alt: "AI ambition to autonomous workflows",
            caption: null,
            width: 437,
            height: 251,
          },
          cta: null,
          layout: "text-image",
          headingStructure: {
            highlight: "Get Amp’d",
            text: "to move from AI ambition to autonomous workflows.",
          },
        },
        blocks: [
          {
            id: "autonomous-copy",
            type: "richText",
            heading: null,
            body: "Enterprise AI proves its worth in production, not in the pilot. Amp’d is how Agivant delivers real business value for every enterprise, bringing together Agivant’s AI Engineering toolkit: Bolt, forward-deployed engineers, production-grade AI agents, and reusable engineering assets. Together, they move AI from ambition to autonomous workflows. Every Build amplifies the next.",
          },
        ],
      },
      {
        id: "agent-teams",
        type: "checklist",
        enabled: true,
        conditions: null,
        data: {
          eyebrow: null,
          heading:
            "Put coordinated agent teams to work across core enterprise systems.",
          description:
            "On Gemini Enterprise, Agivant builds multi-agent teams that connect directly with existing CRM, ITSM, and ERP systems. One agent orchestrates the workflow while specialist agents parse, research, build, and validate. Work moves continuously, and speed is the first change an enterprise feels. The proof is measurable:",
          columns: [],
          media: null,
          cta: null,
          layout: "text-metrics",
          closingStatement: "Speed matters most when the enterprise stays in control.",
          headingStructure: {
            prefix: "Put coordinated agent teams to work across",
            highlight: "core enterprise systems.",
          },
        },
        blocks: [
          {
            id: "agent-team-items",
            type: "card",
            eyebrow: null,
            title: "Core capabilities",
            body: null,
            media: null,
            cta: null,
            items: [
              "Quoting cycles compress from days to minutes",
              "Sourcing cycles fall by 50% end-to-end",
              "Engineering teams reach 2x productivity as the queue runs itself",
              "PQ migrations move at 2x speed with lower risk",
            ],
          },
        ],
      },
      {
        id: "control",
        type: "split_content",
        enabled: true,
        conditions: null,
        data: {
          eyebrow: null,
          heading: "Keep teams in control while agents run the work.",
          description: null,
          columns: [],
          media: {
            kind: "image",
            src: "/images/partners/gemini/agentic-enterprise/agentic-enterprise-control.png",
            assetKey: "agents-control",
            alt: "Keep teams in control while agents run the work",
            caption: null,
            width: 437,
            height: 279,
          },
          cta: null,
          layout: "image-text",
          closingStatement: "Control matters most where enterprise data already lives.",
          headingStructure: {
            prefix: "Keep teams in control\n",
            highlight: "while agents run the work.",
          },
        },
        blocks: [
          {
            id: "control-copy",
            type: "richText",
            heading: null,
            body: "Every Agivant agent is production-ready from day one, observable and always on, with a human in the loop wherever judgment matters. Revenue and engineering teams continue to lead the business while agents run the process. Reusable assets built on Bolt and Google’s Agent Development Kit strengthen each engagement and accelerate what comes next.",
          },
        ],
      },
      {
        id: "google-cloud-scale",
        type: "split_content",
        enabled: true,
        conditions: null,
        data: {
          eyebrow: null,
          heading:
            "Scale securely on Google Cloud with Marketplace-ready accelerators.",
          description: null,
          columns: [],
          media: {
            kind: "image",
            src: "/images/partners/gemini/agentic-enterprise/agentic-enterprise-marketplace.png",
            assetKey: "google-cloud-scale",
            alt: "Scale securely on Google Cloud with Marketplace-ready accelerators",
            caption: null,
            width: 437,
            height: 279,
          },
          cta: null,
          layout: "text-image",
          headingStructure: {
            highlight: "Scale securely on Google Cloud\n",
            text: "with Marketplace-ready accelerators.",
          },
        },
        blocks: [
          {
            id: "google-cloud-copy",
            type: "richText",
            heading: null,
            body: "Certified Gemini Enterprise engineers deploy on secure Google Cloud infrastructure, and Agivant’s industry-validated accelerators are available directly through Google Cloud Marketplace. Standardized 90-day sprints turn ambition into measurable ROI, while enterprise-grade governance scales with every new workload. This is what an Amp’d enterprise looks like in production.",
          },
        ],
      },
      {
        id: "gemini-solutions",
        type: "card_grid",
        enabled: true,
        conditions: null,
        data: {
          eyebrow: null,
          heading:
            "Accelerate business outcomes with production-ready Gemini Enterprise solutions.",
          description:
            "Explore Agivant’s industry-validated Gemini Enterprise agent accelerators, live on Google Cloud Marketplace.",
          columns: [],
          media: null,
          cta: null,
          headingStructure: {
            prefix: "Accelerate business outcomes with production-ready\n",
            highlight: "Gemini Enterprise solutions.",
          },
        },
        blocks: [
          {
            id: "quote-accelerator",
            type: "card",
            eyebrow: "CPQ & REVENUE OPERATIONS",
            title: "Agentic Quote\nAccelerator",
            body: "Compress complex quoting cycles from days to minutes.",
            media: {
              kind: "image",
              src: "/images/partners/gemini/solutions/agentic-quote-accelerator.png",
              assetKey: "gemini-solution-1",
              alt: "Agentic Quote Accelerator",
              caption: null,
            },
            cta: null,
            items: [],
            challenge:
              "Salesforce CPQ and Oracle CPQ environments often rely heavily on rules-based logic. Complex quote cycles can stretch from 3 to 7 business days and depend on scarce SME time, quietly wearing down margin along the way.",
            solution:
              "Multi-agent teams connect directly with the existing CRM. Revenue teams lead the business while agents run the process, compressing quoting cycles from days to minutes.",
            agentTeamTitle: "Meet the agent team",
            agents: [
              {
                name: "Deal Manager",
                role: "Orchestrates the full workflow and invokes every specialist agent.",
              },
              {
                name: "Requirement Parser",
                role: "Extracts structured requirements from RFQs, transcripts, and emails.",
              },
              {
                name: "Catalog Scout",
                role: "Runs semantic product discovery across SKUs and provides product recommendations.",
              },
              {
                name: "Quote Builder",
                role: "Assembles quotes from products, pricing, discounts, and accounts.",
              },
              {
                name: "Quote Analyser",
                role: "Delivers win-rate analysis for every quote.",
              },
              {
                name: "Twin Hunter",
                role: "Analyzes across the industry to surface look-alike accounts.",
              },
            ],
            proof: {
              headline: "Days → Minutes",
              description: "Quoting cycle compression, start to finish",
              highlights: [
                "10% win-rate uplift",
                "30% more active selling time",
                "Stronger first-time quote quality",
              ],
              metrics: [
                {
                  value: "3–7 days → Minutes",
                  label:
                    "Quote cycles that once stretched 3 to 7 business days now compress to minutes.",
                },
              ],
              video: {
                provider: "youtube",
                id: "sFzmpcG6RkY",
                poster: "/images/techtalk/episodes/image1.jpg",
                title: "Agentic Quote Accelerator — Quoting cycle compression",
              },
            },
          },
          {
            id: "sourcex",
            type: "card",
            eyebrow: "PROCUREMENT & VENDOR INTELLIGENCE",
            title: "Agivant\nSourceX",
            body: "Turn fragmented procurement data into faster, smarter decisions.",
            media: {
              kind: "image",
              src: "/images/partners/gemini/solutions/sourcex.png",
              assetKey: "gemini-solution-2",
              alt: "Agivant SourceX",
              caption: null,
            },
            cta: null,
            items: [],
            challenge:
              "Procurement teams grapple with siloed spend data, fragmented vendor contracts, and slow RFx cycles. Lack of real-time supplier intelligence leads to missed savings and high operational overhead.",
            solution:
              "Autonomous procurement agent networks continuously aggregate supplier data, automate price discovery, and streamline vendor scoring, enabling data-driven negotiations and 50% faster sourcing cycles.",
            agentTeamTitle: "Meet the agent team",
            agents: [
              {
                name: "Sourcing Orchestrator",
                role: "Directs category discovery and aligns supplier benchmarks.",
              },
              {
                name: "Contract Parser",
                role: "Extracts obligations, renewal terms, and pricing clauses across legacy MSAs.",
              },
              {
                name: "Spend Analyzer",
                role: "Identifies aggregate spend anomalies and volume discount opportunities.",
              },
              {
                name: "Supplier Evaluator",
                role: "Scores vendor performance, compliance history, and supply chain risk.",
              },
              {
                name: "Negotiation Copilot",
                role: "Generates optimal counter-proposals based on historical win terms.",
              },
              {
                name: "Compliance Auditor",
                role: "Validates supplier certifications and ESG standards against enterprise policy.",
              },
            ],
            proof: {
              headline: "50% Faster Sourcing",
              description: "Sourcing cycles fall by 50% end-to-end",
              highlights: [
                "50% faster sourcing cycle",
                "Automated price discovery",
                "Data-driven supplier negotiations",
              ],
              metrics: [
                {
                  value: "50%",
                  label: "Reduction in end-to-end sourcing cycle time.",
                },
              ],
              video: {
                provider: "youtube",
                id: "roJW0VTxCIA",
                poster: "/images/techtalk/episodes/image2.jpg",
                title: "Agivant SourceX — Procurement & Vendor Intelligence",
              },
            },
          },
          {
            id: "zeroqueue",
            type: "card",
            eyebrow: "IT SERVICE MANAGEMENT",
            title: "Agentic\nZeroQueue",
            body: "Run IT service operations with a governed, self-managing queue.",
            media: {
              kind: "image",
              src: "/images/partners/gemini/solutions/zeroqueue.png",
              assetKey: "gemini-solution-3",
              alt: "Agentic ZeroQueue",
              caption: null,
            },
            cta: null,
            items: [],
            challenge:
              "Enterprise IT service desks are overwhelmed by Tier 1 and Tier 2 ticket volume. High mean time to resolution (MTTR) burns engineering bandwidth and delays critical system access.",
            solution:
              "Agentic ZeroQueue introduces self-resolving incident workflows that triage, reproduce, debug, and resolve routine IT issues autonomously while maintaining strict human-in-the-loop oversight for escalations.",
            agentTeamTitle: "Meet the agent team",
            agents: [
              {
                name: "Queue Dispatcher",
                role: "Performs real-time sentiment analysis and routes critical incidents.",
              },
              {
                name: "Diagnostic Agent",
                role: "Collects system logs, telemetry traces, and environment metrics instantly.",
              },
              {
                name: "Remediation Engine",
                role: "Executes approved runbooks and infrastructure scripts safely.",
              },
              {
                name: "Knowledge Synthesizer",
                role: "Indexes past post-mortems to suggest resolution paths for novel errors.",
              },
              {
                name: "Policy Guard",
                role: "Ensures change tickets comply with ITIL change management guidelines.",
              },
              {
                name: "SLA Sentinel",
                role: "Monitors ticket velocity and proactively triggers automated escalation.",
              },
            ],
            proof: {
              headline: "2x Productivity",
              description:
                "Engineering teams reach 2x productivity as the queue runs itself",
              highlights: [
                "2x engineering productivity",
                "Self-resolving Tier 1/2 tickets",
                "Zero SLA breaches",
              ],
              metrics: [
                {
                  value: "2x",
                  label: "Engineering productivity gain as the queue runs itself.",
                },
              ],
              video: {
                provider: "youtube",
                id: "sFzmpcG6RkY",
                poster: "/images/techtalk/episodes/image3.png",
                title: "Agentic ZeroQueue — IT Service Management",
              },
            },
          },
          {
            id: "cpq-lens",
            type: "card",
            eyebrow: "AGENTIC CPQ RULES MIGRATOR & AUDITOR",
            title: "CPQ Lens",
            body: "Accelerate CPQ migration while reducing pricing and revenue risk.",
            media: {
              kind: "image",
              src: "/images/partners/gemini/solutions/cpq-lens.png",
              assetKey: "gemini-solution-4",
              alt: "CPQ Lens",
              caption: null,
            },
            cta: null,
            items: [],
            challenge:
              "Migrating legacy CPQ rule bases to modern platforms is notoriously error-prone, requiring months of manual reverse-engineering and risking costly pricing mismatches in production.",
            solution:
              "CPQ Lens reverse-engineers legacy pricing rules, validates product constraints via graph reasoning, and automatically converts rule sets into certified target schemas with zero regression.",
            agentTeamTitle: "Meet the agent team",
            agents: [
              {
                name: "Rule Decompiler",
                role: "Parses legacy apex, formulas, and pricing matrices into abstract syntax trees.",
              },
              {
                name: "Constraint Verifier",
                role: "Validates product bundling and dependency logic with formal verification.",
              },
              {
                name: "Schema Converter",
                role: "Translates legacy rules into target Gemini Enterprise and Salesforce CPQ schemas.",
              },
              {
                name: "Regression Simulator",
                role: "Simulates millions of historical quote scenarios to guarantee zero price drift.",
              },
              {
                name: "Audit Reporter",
                role: "Generates comprehensive compliance matrices and migration audit trails.",
              },
              {
                name: "Deployment Sync",
                role: "Pushes verified rules directly to sandbox and staging environments.",
              },
            ],
            proof: {
              headline: "2x Faster, Lower Risk",
              description: "PQ migrations move at 2x speed with lower risk",
              highlights: [
                "2x faster rule migration",
                "Zero price drift",
                "Automated constraint verification",
              ],
              metrics: [
                {
                  value: "2x",
                  label: "Faster CPQ rule-base migration with lower risk.",
                },
              ],
              video: {
                provider: "youtube",
                id: "roJW0VTxCIA",
                poster: "/images/techtalk/episodes/image1.jpg",
                title: "CPQ Lens — Rules Migration & Audit",
              },
            },
          },
        ],
      },
      {
        id: "days-to-minutes",
        type: "media",
        enabled: true,
        conditions: null,
        data: {
          eyebrow: null,
          heading: "Days → Minutes",
          description: "Quoting cycle compression, start to finish",
          columns: [],
          media: null,
          cta: null,
          highlights: [
            "10% win-rate uplift",
            "30% more active selling time",
            "Stronger first-time quote quality",
          ],
          metrics: [
            {
              value: "3–7 days → Minutes",
              label:
                "Quote cycles that once stretched 3 to 7 business days now compress to minutes.",
            },
          ],
        },
        blocks: [
          {
            id: "video",
            type: "media",
            media: {
              kind: "video",
              src: null,
              assetKey: "days-to-minutes-video",
              alt: "Customer or solution video",
              caption: null,
              provider: "youtube",
              id: "sFzmpcG6RkY",
              poster: "/images/techtalk/episodes/image1.jpg",
            },
            title: "Agentic Quote Accelerator — Quoting cycle compression",
            description:
              "Video proof point showing acceleration from days to minutes.",
          },
        ],
      },
      {
        id: "proof-from-production",
        type: "case_study_grid",
        enabled: true,
        conditions: null,
        data: {
          eyebrow: null,
          heading: "Proof from production.",
          description:
            "Gemini Enterprise engagements already running, with outcomes measured in the environment they were built for.",
          columns: [],
          media: null,
          cta: null,
          headingStructure: {
            highlight: "Proof",
            rest: "from production.",
          },
        },
        blocks: [
          {
            id: "developer-productivity-on-gemini",
            type: "card",
            eyebrow: "Client success",
            title: "Developer productivity on Gemini",
            body: "Gemini-native code assistance across a global technology estate, working inside the tools engineers already use.",
            media: {
              kind: "image",
              src: "/images/partners/gemini/proof/developer-productivity.png",
              assetKey: "production-proof-1",
              alt: "Developer productivity on Gemini",
              caption: null,
            },
            cta: {
              enabled: true,
              label: "Read more >>",
              href: "/case-studies/developer-productivity-on-gemini",
              external: false,
            },
            items: [],
            metric:
              "35 percent faster cycles · 30 to 40 percent higher developer productivity",
            caseStudySlug: "developer-productivity-on-gemini",
            badge: "Client success",
            isTall: false,
          },
          {
            id: "conversational-analytics-and-hyper-automation",
            type: "card",
            eyebrow: "Client success",
            title: "Conversational analytics\nand hyper-automation",
            body: "Multilingual conversational analytics that read intent, answer at source, and route only what needs a person.",
            media: {
              kind: "image",
              src: "/images/partners/gemini/proof/conversational-analytics.png",
              assetKey: "production-proof-2",
              alt: "Conversational analytics and hyper-automation",
              caption: null,
            },
            cta: {
              enabled: true,
              label: "Read more >>",
              href: "/case-studies/conversational-analytics-and-hyper-automation",
              external: false,
            },
            items: [],
            metric:
              "Around 90 percent automation · 94 percent confidence · 50 plus languages",
            caseStudySlug: "conversational-analytics-and-hyper-automation",
            badge: "Client success",
            isTall: false,
          },
          {
            id: "enterprise-mlops-on-vertex-ai",
            type: "card",
            eyebrow: "Client success",
            title: "Enterprise MLOps on Vertex AI",
            body: "The model lifecycle automated end to end, from training through release and monitoring.",
            media: {
              kind: "image",
              src: "/images/partners/gemini/proof/enterprise-mlops.png",
              assetKey: "production-proof-3",
              alt: "Enterprise MLOps on Vertex AI",
              caption: null,
            },
            cta: {
              enabled: true,
              label: "Read more >>",
              href: "/case-studies/enterprise-mlops-on-vertex-ai",
              external: false,
            },
            items: [],
            metric: "30 to 50 percent lower operating cost",
            caseStudySlug: "enterprise-mlops-on-vertex-ai",
            badge: "Client success",
            isTall: true,
          },
        ],
      },
      {
        id: "built-on-gemini",
        type: "card_grid",
        enabled: true,
        conditions: null,
        data: {
          eyebrow: null,
          heading: "Built on Gemini Enterprise.",
          description:
            "Three agent accelerators engineered on the Gemini Enterprise Agent Platform and Google's Agent Development Kit, available through Google Cloud Marketplace.",
          columns: [],
          media: null,
          cta: null,
          headingStructure: {
            highlight: "Built on",
            rest: "Gemini Enterprise.",
          },
        },
        blocks: [
          {
            id: "agentic-quote-accelerator",
            type: "card",
            eyebrow: "Solution",
            title: "Agentic Quote Accelerator",
            body: "Seven agents work alongside the CRM already in place, carrying an RFQ through discovery, pricing, approvals, and proposal.",
            media: {
              kind: "image",
              src: "/images/partners/gemini/accelerators/agentic-quote-accelerator.png",
              assetKey: "gemini-built-1",
              alt: "Agentic Quote Accelerator",
              caption: null,
            },
            cta: {
              enabled: true,
              label: "See the solution >>",
              href: "/solutions/agentic-quote-accelerator",
              external: false,
            },
            items: [],
            slug: "agentic-quote-accelerator",
            metric:
              "60 percent faster quote cycles · 2 to 5 percent order value uplift",
            badge: "Solution",
          },
          {
            id: "strategic-sourcing",
            type: "card",
            eyebrow: "Solution",
            title: "Strategic Sourcing",
            body: "Five agents cover the full procurement lifecycle, unifying spend, contract, risk, and vendor intelligence in one layer.",
            media: {
              kind: "image",
              src: "/images/partners/gemini/accelerators/strategic-sourcing.png",
              assetKey: "gemini-built-2",
              alt: "Strategic Sourcing",
              caption: null,
            },
            cta: {
              enabled: true,
              label: "See the solution >>",
              href: "/solutions/strategic-sourcing",
              external: false,
            },
            items: [],
            slug: "strategic-sourcing",
            metric: "Sourcing cycle time cut by half",
            badge: "Solution",
          },
          {
            id: "zeroq",
            type: "card",
            eyebrow: "Solution",
            title: "ZeroQ",
            body: "Six agents triage, investigate, resolve, and account for IT tickets on ServiceNow, Jira, or Zendesk, with no rebuild per platform.",
            media: {
              kind: "image",
              src: "/images/partners/gemini/accelerators/zeroq.png",
              assetKey: "gemini-built-3",
              alt: "ZeroQ",
              caption: null,
            },
            cta: {
              enabled: true,
              label: "See the solution >>",
              href: "/solutions/zeroq",
              external: false,
            },
            items: [],
            slug: "zeroq",
            metric:
              "2x engineering productivity · 25 to 40 percent lower cost per ticket",
            badge: "Solution",
          },
        ],
      },
    ],
    footerCta: {
      enabled: true,
      heading: "Put Gemini Enterprise to work for measurable business impact.",
      subheading:
        "Let's architect the agentic enterprise together on a platform built to scale from day one.",
      partner: {
        name: "Gemini Enterprise",
        logo: {
          kind: "logo",
          src: "/images/partners/gemini.png",
          assetKey: "gemini-enterprise-logo",
          alt: "Gemini Enterprise logo",
          caption: null,
        },
      },
      primaryCta: null,
      secondaryCta: {
        enabled: true,
        label: "Book a Gemini Enterprise assessment",
        href: "/contact",
        external: false,
        icon: "cube",
      },
      rawHeading:
        "To be decided or kept as is\nPut Gemini Enterprise to work for\nmeasurable business impact.",
    },
  },
};

/**
 * Adapter mapping the standardized CMS partner object into the existing
 * PartnerDetailData interface consumed by page.tsx and partner section components.
 * Ensures zero frontend breaking changes while adopting the backend data standard.
 */
function mapStandardizedToPartnerDetail(
  data: StandardizedPartnerDetailPage
): PartnerDetailData {
  const meta = {
    title: data.seo.title ?? data.title,
    description: data.seo.description ?? "",
  };

  const hero: PartnerHeroData = {
    headingLine1: data.hero.headingLine1 ?? data.title,
    headingLine2: data.hero.headingLine2 ?? "",
    partnerLogo: {
      src: data.hero.partner.logo.src ?? "",
      alt: data.hero.partner.logo.alt ?? data.hero.partner.name,
      width: data.hero.partner.logo.width,
      height: data.hero.partner.logo.height,
    },
    ribbonSrc: data.hero.ribbonSrc ?? data.hero.media.src ?? "",
  };

  const introSec = data.sections.find((s) => s.id === "production-value");
  const quoteSec = data.sections.find((s) => s.id === "customer-quote");
  const quoteBlock = quoteSec?.blocks?.[0];

  const intro: PartnerIntroData = {
    heading: {
      highlight:
        introSec?.data.headingStructure?.highlight ??
        introSec?.data.heading ??
        "",
      suffix: introSec?.data.headingStructure?.suffix ?? "",
    },
    paragraphs:
      introSec?.blocks?.[0]?.paragraphs ??
      (introSec?.blocks?.[0]?.body ? [introSec.blocks[0].body] : []),
    leadershipQuote: {
      quote: quoteBlock?.quote ?? "",
      author: {
        name: quoteBlock?.authorName ?? "",
        role: quoteBlock?.authorRole ?? "",
        portraitSrc: quoteBlock?.authorImage?.src ?? "",
      },
    },
    cta: quoteSec?.data.cta?.enabled
      ? {
          label: quoteSec.data.cta.label ?? "",
          href: quoteSec.data.cta.href ?? "",
        }
      : undefined,
  };

  const storySectionIds = [
    "autonomous-workflows",
    "agent-teams",
    "control",
    "google-cloud-scale",
  ];
  const storySections = data.sections.filter((s) =>
    storySectionIds.includes(s.id)
  );

  const agenticEnterprise: AgenticEnterpriseData = {
    blocks: storySections.map((sec) => {
      const block = sec.blocks?.[0];
      return {
        id: sec.id,
        layout: sec.data.layout,
        heading: {
          highlight: sec.data.headingStructure?.highlight,
          suffix: sec.data.headingStructure?.suffix,
          prefix: sec.data.headingStructure?.prefix,
          text: sec.data.headingStructure?.text,
        },
        body: block?.body ?? sec.data.description ?? "",
        closingStatement: sec.data.closingStatement,
        image: sec.data.media?.src
          ? {
              src: sec.data.media.src,
              alt: sec.data.media.alt ?? "",
              width: sec.data.media.width ?? 437,
              height: sec.data.media.height ?? 279,
            }
          : undefined,
        metrics: block?.items?.length
          ? {
              items: block.items,
              closingStatement: sec.data.closingStatement,
            }
          : undefined,
      };
    }),
  };

  const solutionsSec = data.sections.find((s) => s.id === "gemini-solutions");
  const solutions: PartnerSolutionsData | undefined = solutionsSec
    ? {
        heading: {
          prefix:
            solutionsSec.data.headingStructure?.prefix ??
            solutionsSec.data.heading ??
            "",
          highlight: solutionsSec.data.headingStructure?.highlight ?? "",
        },
        description: solutionsSec.data.description ?? "",
        accelerators: (solutionsSec.blocks ?? []).map((b) => ({
          id: b.id,
          title: b.title ?? "",
          category: b.eyebrow ?? "",
          description: b.body ?? "",
          image: {
            src: b.media?.src ?? "",
            alt: b.media?.alt ?? "",
          },
          challenge: b.challenge ?? "",
          solution: b.solution ?? "",
          agentTeamTitle: b.agentTeamTitle,
          agents: b.agents ?? [],
          proof: b.proof ?? {
            headline: "",
            description: "",
            video: { provider: "youtube", id: "", poster: "", title: "" },
          },
        })),
      }
    : undefined;

  const proofSec = data.sections.find(
    (s) => s.id === "proof-from-production"
  );
  const productionProof: PartnerProductionProofData | undefined = proofSec
    ? {
        heading: {
          highlight:
            proofSec.data.headingStructure?.highlight ??
            proofSec.data.heading ??
            "",
          rest: proofSec.data.headingStructure?.rest ?? "",
        },
        description: proofSec.data.description ?? "",
        cards: (proofSec.blocks ?? []).map((b) => ({
          id: b.id,
          badge: b.badge ?? b.eyebrow ?? undefined,
          title: b.title ?? "",
          description: b.body ?? "",
          metric: b.metric ?? "",
          ctaLabel: b.cta?.label ?? "Read more >>",
          caseStudySlug: b.caseStudySlug ?? b.id,
          image: {
            src: b.media?.src ?? "",
            alt: b.media?.alt ?? "",
          },
        })),
      }
    : undefined;

  const builtSec = data.sections.find((s) => s.id === "built-on-gemini");
  const builtOnGemini: PartnerBuiltOnGeminiData | undefined = builtSec
    ? {
        heading: {
          highlight:
            builtSec.data.headingStructure?.highlight ??
            builtSec.data.heading ??
            "",
          rest: builtSec.data.headingStructure?.rest ?? "",
        },
        description: builtSec.data.description ?? "",
        cards: (builtSec.blocks ?? []).map((b) => ({
          id: b.id,
          badge: b.badge ?? b.eyebrow ?? undefined,
          title: b.title ?? "",
          slug: b.slug ?? b.id,
          description: b.body ?? "",
          metric: b.metric ?? "",
          ctaLabel: b.cta?.label ?? "See the solution >>",
          image: {
            src: b.media?.src ?? "",
            alt: b.media?.alt ?? "",
          },
        })),
      }
    : undefined;

  const cta: PartnerCTAData = {
    heading: data.footerCta.rawHeading ?? data.footerCta.heading,
    description: data.footerCta.subheading ?? "",
    buttonLabel:
      data.footerCta.secondaryCta?.label ?? "Talk to an Amp'd specialist",
    buttonHref: data.footerCta.secondaryCta?.href ?? "/contact",
    buttonIcon: data.footerCta.secondaryCta?.icon,
  };

  return {
    slug: data.slug,
    name: data.name ?? data.hero.partner.name,
    meta,
    hero,
    intro,
    agenticEnterprise,
    solutions,
    productionProof,
    builtOnGemini,
    cta,
  };
}

export async function getPartnerDetail(
  slug: string
): Promise<PartnerDetailData | null> {
  const raw = PARTNERS_DETAIL_DATA[slug];
  if (!raw) return null;
  return mapStandardizedToPartnerDetail(raw);
}

export async function getStandardizedPartnerDetail(
  slug: string
): Promise<StandardizedPartnerDetailPage | null> {
  return PARTNERS_DETAIL_DATA[slug] ?? null;
}

export function getAllPartnerSlugs(): string[] {
  return Object.keys(PARTNERS_DETAIL_DATA);
}