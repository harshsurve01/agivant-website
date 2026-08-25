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

/** Exactly two logos — everything one LogoShift instance holds. */
export type PartnerLogoPair = [PartnerLogo, PartnerLogo];

// Widened from 4 to 5 static slots to fit the full 10-partner
// roster as clean pairs — each slot still owns exactly one
// independent LogoShift instance holding exactly one logo pair (the
// Framer component's "one logo pair per instance" model is
// unchanged; there's just one more instance of it now). SLOT_COUNT *
// PAIR_SIZE (10) matches the roster below exactly, so nothing is
// held in reserve.
const SLOT_COUNT = 5;
const PAIR_SIZE = 2;

/**
 * Builds the 5 fixed pairs consumed by the 5 LogoShift instances:
 * the first 10 asset-verified logos, taken in fixed roster order and
 * chunked consecutively — [0,1], [2,3], [4,5], [6,7], [8,9].
 * Deterministic, never randomized, never duplicated as filler.
 *
 * If the roster ever grows past SLOT_COUNT * PAIR_SIZE again, the
 * leftover logic below holds the excess in reserve (dev-only warning)
 * rather than force-fitting a 3rd logo into any one slot — add a 6th
 * slot (bump SLOT_COUNT) or trim the roster instead.
 */
async function getPartnerLogoPairsContent(): Promise<PartnerLogoPair[]> {
  const availableLogos = ALL_PARTNER_LOGOS.filter((logo) =>
    assetExists(logo.image.src)
  );

  if (process.env.NODE_ENV !== "production") {
    const missing = ALL_PARTNER_LOGOS.filter(
      (logo) => !assetExists(logo.image.src)
    );
    if (missing.length > 0) {
      console.warn(
        `[Partners] Skipping ${missing.length} logo(s) with missing asset file(s): ${missing
          .map((logo) => `${logo.id} (${logo.image.src})`)
          .join(", ")}`
      );
    }

    const capacity = SLOT_COUNT * PAIR_SIZE;
    if (availableLogos.length > capacity) {
      const leftover = availableLogos.slice(capacity);
      console.warn(
        `[Partners] ${leftover.length} logo(s) held in reserve, not shown — ` +
          `${SLOT_COUNT} slots × ${PAIR_SIZE} logos/pair = ${capacity} capacity, ` +
          `but ${availableLogos.length} logos are available: ${leftover
            .map((logo) => logo.id)
            .join(", ")}. Trim the roster to ${capacity} or add a 5th slot.`
      );
    } else if (availableLogos.length < capacity) {
      console.warn(
        `[Partners] Only ${availableLogos.length} logo(s) available — fewer ` +
          `than the ${capacity} needed to fill all ${SLOT_COUNT} slots. Some ` +
          `slots will be omitted rather than given an incomplete pair.`
      );
    }
  }

  const pairs: PartnerLogoPair[] = [];
  for (let slot = 0; slot < SLOT_COUNT; slot++) {
    const a = availableLogos[slot * PAIR_SIZE];
    const b = availableLogos[slot * PAIR_SIZE + 1];
    if (!a || !b) break; // not enough logos left to complete this pair
    pairs.push([a, b]);
  }

  return pairs;
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
   Partner Detail Pages Data (/partners/[partner])
   CMS-ready structure for dynamic routing
   ========================================================================== */

import type { PartnerDetailData } from "@/types/partnerDetail";

export const PARTNERS_DETAIL_DATA: Record<string, PartnerDetailData> = {
  "gemini-enterprise": {
    slug: "gemini-enterprise",
    name: "Gemini Enterprise",
    meta: {
      title: "Gemini Enterprise Partnership | Agivant",
      description:
        "Turn AI pilots into enterprise-wide business value with Gemini Enterprise and Agivant Technologies.",
    },
    hero: {
      headingLine1: "Turn AI pilots into enterprise-wide",
      headingLine2: "business value with",
      partnerLogo: {
        src: "/images/partners/gemini.png",
        alt: "Gemini Enterprise",
        width: 567,
        height: 67,
      },
      ribbonSrc: "/images/partners/gemini/gemini-hero-ribbon.png",
    },
    intro: {
      heading: {
        highlight: "From Gemini Enterprise",
        suffix: "to production value",
      },
      paragraphs: [
        "Agivant Technologies launches a dedicated Gemini Enterprise practice with Google Cloud, turning ambitious AI pilots into production-grade agents that deliver real business outcomes every day.",
        "Built on the Gemini Enterprise Agent Platform, Google's Agent Development Kit (ADK), and production-grade architectures, we help organizations advance from early prototypes to resilient, self-orchestrating agentic environments in days and weeks.",
      ],
      leadershipQuote: {
        quote:
          "The shift to the agentic enterprise is redefining how businesses operate, innovate, and grow. Our dedicated Gemini Enterprise practice helps organizations move beyond experimentation and into real, enterprise-wide impact.",
        author: {
          name: "Ajay Malgaonkar",
          role: "Chief Digital Delivery Officer, Agivant Technologies",
          portraitSrc: "/images/partners/gemini/intro/ajay-malgaonkar.png",
        },
      },
      cta: {
        label: "See the accelerators in action",
        href: "#accelerators",
      },
    },
    agenticEnterprise: {
      blocks: [
        {
          id: "ambition",
          heading: {
            highlight: "Get Amp’d",
            text: "to move from AI ambition to autonomous workflows.",
          },
          body: "Enterprise AI proves its worth in production, not in the pilot. Amp’d is how Agivant delivers real business value for every enterprise, bringing together Agivant’s AI Engineering toolkit: Bolt, forward-deployed engineers, production-grade AI agents, and reusable engineering assets. Together, they move AI from ambition to autonomous workflows. Every Build amplifies the next.",
          image: {
            src: "/images/partners/gemini/agentic-enterprise/agentic-enterprise-ambition.png",
            alt: "AI ambition to autonomous workflows",
            width: 437,
            height: 251,
          },
          layout: "text-image",
        },
        {
          id: "coordinated-teams",
          heading: {
            prefix: "Put coordinated agent teams to work across",
            highlight: "core enterprise systems.",
          },
          body: "On Gemini Enterprise, Agivant builds multi-agent teams that connect directly with existing CRM, ITSM, and ERP systems. One agent orchestrates the workflow while specialist agents parse, research, build, and validate. Work moves continuously, and speed is the first change an enterprise feels. The proof is measurable:",
          metrics: {
            items: [
              "Quoting cycles compress from days to minutes",
              "Sourcing cycles fall by 50% end-to-end",
              "Engineering teams reach 2x productivity as the queue runs itself",
              "PQ migrations move at 2x speed with lower risk",
            ],
            closingStatement: "Speed matters most when the enterprise stays in control.",
          },
          layout: "text-metrics",
        },
        {
          id: "teams-in-control",
          heading: {
            prefix: "Keep teams in control\n",
            highlight: "while agents run the work.",
          },
          body: "Every Agivant agent is production-ready from day one, observable and always on, with a human in the loop wherever judgment matters. Revenue and engineering teams continue to lead the business while agents run the process. Reusable assets built on Bolt and Google’s Agent Development Kit strengthen each engagement and accelerate what comes next.",
          closingStatement: "Control matters most where enterprise data already lives.",
          image: {
            src: "/images/partners/gemini/agentic-enterprise/agentic-enterprise-control.png",
            alt: "Keep teams in control while agents run the work",
            width: 437,
            height: 279,
          },
          layout: "image-text",
        },
        {
          id: "google-cloud-scale",
          heading: {
            highlight: "Scale securely on Google Cloud\n",
            text: "with Marketplace-ready accelerators.",
          },
          body: "Certified Gemini Enterprise engineers deploy on secure Google Cloud infrastructure, and Agivant’s industry-validated accelerators are available directly through Google Cloud Marketplace. Standardized 90-day sprints turn ambition into measurable ROI, while enterprise-grade governance scales with every new workload. This is what an Amp’d enterprise looks like in production.",
          image: {
            src: "/images/partners/gemini/agentic-enterprise/agentic-enterprise-marketplace.png",
            alt: "Scale securely on Google Cloud with Marketplace-ready accelerators",
            width: 437,
            height: 279,
          },
          layout: "text-image",
        },
      ],
    },
    solutions: {
      heading: {
        prefix: "Accelerate business outcomes with production-ready\n",
        highlight: "Gemini Enterprise solutions.",
      },
      description:
        "Explore Agivant’s industry-validated Gemini Enterprise agent accelerators, live on Google Cloud Marketplace.",
      accelerators: [
        {
          id: "quote-accelerator",
          title: "Agentic Quote\nAccelerator",
          category: "CPQ & REVENUE OPERATIONS",
          description: "Compress complex quoting cycles from days to minutes.",
          image: {
            src: "/images/partners/gemini/solutions/agentic-quote-accelerator.png",
            alt: "Agentic Quote Accelerator",
          },
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
          title: "Agivant\nSourceX",
          category: "PROCUREMENT & VENDOR INTELLIGENCE",
          description:
            "Turn fragmented procurement data into faster, smarter decisions.",
          image: {
            src: "/images/partners/gemini/solutions/sourcex.png",
            alt: "Agivant SourceX",
          },
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
          title: "Agentic\nZeroQueue",
          category: "IT SERVICE MANAGEMENT",
          description:
            "Run IT service operations with a governed, self-managing queue.",
          image: {
            src: "/images/partners/gemini/solutions/zeroqueue.png",
            alt: "Agentic ZeroQueue",
          },
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
            description: "Engineering teams reach 2x productivity as the queue runs itself",
            highlights: [
              "2x engineering productivity",
              "Self-resolving Tier 1/2 tickets",
              "Zero SLA breaches",
            ],
            metrics: [
              {
                value: "2x",
                label:
                  "Engineering productivity gain as the queue runs itself.",
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
          title: "CPQ Lens",
          category: "AGENTIC CPQ RULES MIGRATOR & AUDITOR",
          description:
            "Accelerate CPQ migration while reducing pricing and revenue risk.",
          image: {
            src: "/images/partners/gemini/solutions/cpq-lens.png",
            alt: "CPQ Lens",
          },
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
    productionProof: {
      heading: {
        highlight: "Proof",
        rest: "from production.",
      },
      description:
        "Gemini Enterprise engagements already running, with outcomes measured in the environment they were built for.",
      cards: [
        {
          id: "developer-productivity-on-gemini",
          badge: "Client success",
          title: "Developer productivity on Gemini",
          description:
            "Gemini-native code assistance across a global technology estate, working inside the tools engineers already use.",
          metric:
            "35 percent faster cycles · 30 to 40 percent higher developer productivity",
          ctaLabel: "Read more >>",
          caseStudySlug: "developer-productivity-on-gemini",
          image: {
            src: "/images/partners/gemini/proof/developer-productivity.png",
            alt: "Developer productivity on Gemini",
          },
        },
        {
          id: "conversational-analytics-and-hyper-automation",
          badge: "Client success",
          title: "Conversational analytics\nand hyper-automation",
          description:
            "Multilingual conversational analytics that read intent, answer at source, and route only what needs a person.",
          metric:
            "Around 90 percent automation · 94 percent confidence · 50 plus languages",
          ctaLabel: "Read more >>",
          caseStudySlug: "conversational-analytics-and-hyper-automation",
          image: {
            src: "/images/partners/gemini/proof/conversational-analytics.png",
            alt: "Conversational analytics and hyper-automation",
          },
        },
        {
          id: "enterprise-mlops-on-vertex-ai",
          badge: "Client success",
          title: "Enterprise MLOps on Vertex AI",
          description:
            "The model lifecycle automated end to end, from training through release and monitoring.",
          metric: "30 to 50 percent lower operating cost",
          ctaLabel: "Read more >>",
          caseStudySlug: "enterprise-mlops-on-vertex-ai",
          image: {
            src: "/images/partners/gemini/proof/enterprise-mlops.png",
            alt: "Enterprise MLOps on Vertex AI",
          },
        },
      ],
    },
    builtOnGemini: {
      heading: {
        highlight: "Built on",
        rest: "Gemini Enterprise.",
      },
      description:
        "Three agent accelerators engineered on the Gemini Enterprise Agent Platform and Google's Agent Development Kit, available through Google Cloud Marketplace.",
      cards: [
        {
          id: "agentic-quote-accelerator",
          badge: "Solution",
          title: "Agentic Quote Accelerator",
          description:
            "Seven agents work alongside the CRM already in place, carrying an RFQ through discovery, pricing, approvals, and proposal.",
          metric:
            "60 percent faster quote cycles · 2 to 5 percent order value uplift",
          ctaLabel: "See the solution >>",
          solutionId: "quote-accelerator",
          image: {
            src: "/images/partners/gemini/accelerators/agentic-quote-accelerator.png",
            alt: "Agentic Quote Accelerator",
          },
        },
        {
          id: "strategic-sourcing",
          badge: "Solution",
          title: "Strategic Sourcing",
          description:
            "Five agents cover the full procurement lifecycle, unifying spend, contract, risk, and vendor intelligence in one layer.",
          metric: "Sourcing cycle time cut by half",
          ctaLabel: "See the solution >>",
          solutionId: "sourcex",
          image: {
            src: "/images/partners/gemini/accelerators/strategic-sourcing.png",
            alt: "Strategic Sourcing",
          },
        },
        {
          id: "zeroq",
          badge: "Solution",
          title: "ZeroQ",
          description:
            "Six agents triage, investigate, resolve, and account for IT tickets on ServiceNow, Jira, or Zendesk, with no rebuild per platform.",
          metric:
            "2x engineering productivity · 25 to 40 percent lower cost per ticket",
          ctaLabel: "See the solution >>",
          solutionId: "zeroqueue",
          image: {
            src: "/images/partners/gemini/accelerators/zeroq.png",
            alt: "ZeroQ",
          },
        },
      ],
    },
    cta: {
      heading:
        "To be decided or kept as is\nPut Gemini Enterprise to work for\nmeasurable business impact.",
      description:
        "Let's architect the agentic enterprise together on a platform built to scale from day one.",
      buttonLabel: "Book a Gemini Enterprise assessment",
      buttonHref: "/contact",
      buttonIcon: "cube",
    },
  },
};

export async function getPartnerDetail(
  slug: string
): Promise<PartnerDetailData | null> {
  return PARTNERS_DETAIL_DATA[slug] ?? null;
}

export function getAllPartnerSlugs(): string[] {
  return Object.keys(PARTNERS_DETAIL_DATA);
}