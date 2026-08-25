import type { CaseStudiesHeroProps } from "@/components/sections/CaseStudies/Hero";

/**
 * ASSUMPTION: no existing caseStudies.ts was provided with the
 * uploaded files, so this is the minimum data needed for the Hero
 * only, per the brief ("do not create fake case-study records yet").
 * If a caseStudies.ts already exists elsewhere in the project (e.g.
 * with a different shape, or already holding case-study records),
 * delete this file and instead add a `hero` export to the real one,
 * matching CaseStudiesHeroProps below.
 *
 * File location is also an assumption — Blogs' equivalent data file
 * wasn't part of the uploaded set, so this mirrors the most common
 * `src/data/` convention rather than a confirmed one.
 */
export const caseStudiesHero: CaseStudiesHeroProps = {
  heading: "Client success,\nin production",
  description:
    "See how Agivant engineers enterprise AI into production across several industries.",
  search: {
    placeholder: "Search by industry, capability or platform",
    buttonLabel: "Search",
  },
};

/* ==========================================================================
   CaseStudyHub data
   Added for the Case Studies Hub/listing section. Kept in this same
   file rather than a second data file, since it's the same domain
   (case studies) and the brief's data-flow diagram only names one
   file (caseStudies.ts). CaseStudyCard and PortfolioFilters never
   import this module directly — only CaseStudyHub (via
   app/case-studies/page.tsx) does, per the approved data flow.
   ========================================================================== */

export interface CaseStudyImage {
  src: string;
  alt: string;
}

/**
 * Full case-study record. Deliberately minimal — every field here is
 * one visibly required by the Figma card or filter panel:
 *  - slug/title/image/industry/capability: rendered on the card
 *  - techPlatform: not shown on the card itself, but required for the
 *    Tech Platform filter to have a field to match against
 */
export interface SolutionCardItem {
  text: string;
  ribbon?: string;
}

export interface CaseStudyArchitectureEmbed {
  type: "iframe";
  src: string;
  title?: string;
  minHeight?: string | number;
}

export interface CaseStudyArchitectureImage {
  type?: "image";
  image: CaseStudyImage;
  imageWidth?: number;
  imageHeight?: number;
}

export type CaseStudyArchitecture =
  | CaseStudyArchitectureEmbed
  | CaseStudyArchitectureImage;

export interface CaseStudy {
  slug: string;
  title: string;
  image: CaseStudyImage;
  industry: string;
  capability: string;
  techPlatform: string;
  heroHeading?: string;
  heroDescription?: string;
  objectivesTitle?: string;
  challengesTitle?: string;
  challenges?: string[];
  solutionTitle?: string;
  solutionItems?: (string | SolutionCardItem)[];
  technologyTitle?: string;
  technologies?: string;
  technologyNote?: string;
  outcomeTitle?: string;
  outcomeItems?: OutcomeResult[];
  architecture?: CaseStudyArchitecture;
  architectureImage?: CaseStudyImage;
  architectureImageWidth?: number;
  architectureImageHeight?: number;
}

/**
 * One Outcome result record. Mirrors the Outcome section's own
 * `OutcomeItem` shape (index/emphasis/text) exactly — duplicated
 * here rather than imported, per the same "data module stays
 * decoupled from UI components" rule `FilterGroupConfig.id` follows
 * above (Outcome never imports this file directly; only
 * app/case-studies/[slug]/page.tsx does).
 */
export interface OutcomeResult {
  index: string;
  emphasis: string;
  text: string;
}

export interface FilterOptionConfig {
  value: string;
  label: string;
}

export interface FilterGroupConfig {
  /**
   * Duplicated (not imported) from PortfolioFilters/types.ts's
   * FilterGroupId, intentionally — keeps this data module fully
   * decoupled from UI components, per the brief ("do NOT import
   * caseStudies.ts directly inside CaseStudyCard/PortfolioFilters").
   * CaseStudyHub is the one place allowed to know both shapes match.
   */
  id: "industry" | "capability" | "techPlatform";
  title: string;
  options: FilterOptionConfig[];
}

/**
 * ASSUMPTION: Figma's mock content repeats the exact same title and
 * tags ("Automating Enterprise Claims Processing with Agentic AI" /
 * "BFSI" / "Agentic AI Systems") across all 6 visible cards. Per the
 * brief ("do not invent additional content"), these 6 records reuse
 * that same content with unique slugs rather than inventing varied
 * industries/capabilities that aren't in the design.
 *
 * `techPlatform` isn't visible on the card itself, so a single
 * placeholder value ("Python") is used across all records — replace
 * with real per-case-study values once WordPress data lands.
 *
 * Image sources are placeholders (the abstract wave renders in Figma
 * aren't exported assets we have access to) — same TODO pattern as
 * HeroBackground's ellipse-stroke asset: swap the path once real
 * exports land, no code changes needed.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "automating-enterprise-claims-processing-with-agentic-ai-1",
    title: "Automating Enterprise Claims Processing with Agentic AI",
    image: { src: "/images/case-studies/case-study-01.jpg", alt: "" },
    industry: "BFSI",
    capability: "Agentic AI Systems",
    techPlatform: "Python",
    /**
     * ASSUMPTION: the "Case Study Inside Page" Figma reference isn't
     * itself tied to a specific Hub card/slug — it's a standalone
     * inner-page mock. Attached to this first record (rather than
     * left orphaned) so the [slug] route has one real, working page
     * to render, matching the "current slug should resolve to the
     * appropriate case study" requirement. Content is copied
     * verbatim from the brief, not rewritten.
     */
    heroHeading: "AI for Scalable Tech Support",
    heroDescription:
      "A platform architecture consulting project for a global software firm for demand forecasting using a configurable and highly scalable forecasting system for a significant cost optimization and NPI improvement program across channels and geographies.",
    objectivesTitle: "Objectives",
    challengesTitle: "Challenges",
    challenges: [
      "Data quality and availability; highly manual and broken data sources.",
      "50+ channels for support incidents.",
      "Different forecasting algorithm across channels and geographies.",
      "Delay in forecasting availability to different support and corporate functions.",
      "Business value add and data science functions not in sync.",
    ],
    solutionTitle: "Solution",
    solutionItems: [
      {
        text: "Implemented machine learning models and ensemble techniques to address seasonality, low volume behaviour, and small dataset issues for high quality forecast.",
        ribbon: "/images/case-studies/solution-ribbon-01.png",
      },
      {
        text: "Unified data hub architected for curated data across global support tools using Azure Data Factory, Data Lake, and Azure SQL.",
        ribbon: "/images/case-studies/solution-ribbon-02.png",
      },
      {
        text: "Daily, weekly, and monthly forecast per business need using statistical models and snapshots.",
        ribbon: "/images/case-studies/solution-ribbon-03.png",
      },
      {
        text: "Single source of truth with refresh of actuals, budget, and generation of forecasts in sync with rhythm of business.",
        ribbon: "/images/case-studies/solution-ribbon-04.png",
      },
      {
        text: "Cloud-hosted self-service reports and dashboards for accurate data and forecasts on a timely basis for support, operations, and finance leadership.",
        ribbon: "/images/case-studies/solution-ribbon-05.png",
      },
    ],
    technologyTitle: "Technology",
    technologies:
      "Azure Data Factory, Azure Databricks, Azure Data Lake, Synapse, Python, Spark, Lakehouse, Azure Purview, Message Hub, Azure Data Lake Storage Gen2, Azure Blob Storage, Event Hubs, scikit-learn, H2O",
    technologyNote: "Anaplan for productivity modelling",
    outcomeTitle: "Outcome",
    outcomeItems: [
      {
        index: "01",
        emphasis: "A 100% automated,",
        text: "scalable engine to deliver forecast on demand.",
      },
      {
        index: "02",
        emphasis: "Improved forecasting frequency",
        text: "from a three-month cycle to monthly.",
      },
      {
        index: "03",
        emphasis: "97.6% forecasting accuracy",
        text: "delivered (from 65%).",
      },
      {
        index: "04",
        emphasis: "120 locales supported;",
        text: "40,000+ time series supported.",
      },
      {
        index: "05",
        emphasis: "35% cost reduction",
        text: "NPI improved by 45%.",
      },
      {
        index: "06",
        emphasis: "97% automated",
        text: "anomalies engine.",
      },
      {
        index: "07",
        emphasis: "99.7%",
        text: "platform availability.",
      },
    ],
    /**
     * Asset provided directly (not exported from Figma) — see
     * Architecture.tsx/.module.css for the full container/padding
     * derivation. 1003 x 658 is the provided asset's real intrinsic
     * pixel size (not the ~1250 x 715 Figma container it sits inside).
     */
    architecture: {
      type: "iframe",
      src: "/embeds/azure-analytics-architecture.html",
      title: "Azure Analytics Architecture",
    },
    architectureImage: {
      src: "/images/case-studies/architecture-workflow.jpg",
      alt: "Data pipeline architecture: on-premises SQL Server, other relational databases, Azure SQL database, storage tables, and a web API feed into an Azure Data Factory-orchestrated ingestion step (Storage Blob), then Azure Synapse Analytics storage, Azure Analysis Services analysis (authenticated via Azure Active Directory), and Power BI visualization. Separately, an Azure Logic App triggers an Azure Container Instance that pulls worker and scheduler images from Docker Hub to run an Azure Batch Cluster, which reads input data and R models from and writes results back to Azure Blob Storage.",
    },
    architectureImageWidth: 1003,
    architectureImageHeight: 658,
  },
  {
    slug: "automating-enterprise-claims-processing-with-agentic-ai-2",
    title: "Automating Enterprise Claims Processing with Agentic AI",
    image: { src: "/images/case-studies/case-study-02.jpg", alt: "" },
    industry: "BFSI",
    capability: "Agentic AI Systems",
    techPlatform: "Python",
  },
  {
    slug: "automating-enterprise-claims-processing-with-agentic-ai-3",
    title: "Automating Enterprise Claims Processing with Agentic AI",
    image: { src: "/images/case-studies/case-study-03.jpg", alt: "" },
    industry: "BFSI",
    capability: "Agentic AI Systems",
    techPlatform: "Python",
  },
  {
    slug: "automating-enterprise-claims-processing-with-agentic-ai-4",
    title: "Automating Enterprise Claims Processing with Agentic AI",
    image: { src: "/images/case-studies/case-study-04.jpg", alt: "" },
    industry: "BFSI",
    capability: "Agentic AI Systems",
    techPlatform: "Python",
  },
  {
    slug: "automating-enterprise-claims-processing-with-agentic-ai-5",
    title: "Automating Enterprise Claims Processing with Agentic AI",
    image: { src: "/images/case-studies/case-study-05.jpg", alt: "" },
    industry: "BFSI",
    capability: "Agentic AI Systems",
    techPlatform: "Python",
  },
  {
    slug: "automating-enterprise-claims-processing-with-agentic-ai-6",
    title: "Automating Enterprise Claims Processing with Agentic AI",
    image: { src: "/images/case-studies/case-study-06.jpg", alt: "" },
    industry: "BFSI",
    capability: "Agentic AI Systems",
    techPlatform: "Python",
  },
  {
    slug: "developer-productivity-on-gemini",
    title: "Developer productivity on Gemini",
    image: {
      src: "/images/partners/gemini/proof/developer-productivity.png",
      alt: "Developer productivity on Gemini",
    },
    industry: "Cloud & AI",
    capability: "Agentic AI Systems",
    techPlatform: "Google Cloud / Gemini",
    heroHeading: "Developer productivity on Gemini",
    heroDescription:
      "Gemini-native code assistance across a global technology estate, working inside the tools engineers already use.",
    objectivesTitle: "Objectives",
    challengesTitle: "Challenges",
    challenges: [
      "Fragmented developer tooling across enterprise repositories.",
      "Lengthy ramp-up times and complex legacy code comprehension.",
      "Strict compliance and IP privacy requirements for AI-generated code.",
    ],
    solutionTitle: "Solution",
    solutionItems: [
      {
        text: "Integrated Gemini Enterprise code assist directly into IDEs and CI/CD pipelines.",
        ribbon: "/images/case-studies/solution-ribbon-01.png",
      },
      {
        text: "Context-aware repository grounding using private enterprise knowledge graphs.",
        ribbon: "/images/case-studies/solution-ribbon-02.png",
      },
    ],
    technologyTitle: "Technology",
    technologies: "Gemini 1.5 Pro, Vertex AI, Google Cloud Platform, GitHub Enterprise",
    technologyNote: "Enterprise security and governance compliant",
    outcomeTitle: "Outcome",
    outcomeItems: [
      {
        index: "01",
        emphasis: "35% faster",
        text: "development cycle times.",
      },
      {
        index: "02",
        emphasis: "30 to 40% higher",
        text: "developer productivity across global teams.",
      },
    ],
    architecture: {
      type: "iframe",
      src: "/embeds/azure-analytics-architecture.html",
      title: "Gemini Developer Productivity Architecture",
    },
  },
  {
    slug: "conversational-analytics-and-hyper-automation",
    title: "Conversational analytics and hyper-automation",
    image: {
      src: "/images/partners/gemini/proof/conversational-analytics.png",
      alt: "Conversational analytics and hyper-automation",
    },
    industry: "Customer Experience",
    capability: "Agentic AI Systems",
    techPlatform: "Google Cloud / Vertex AI",
    heroHeading: "Conversational analytics and hyper-automation",
    heroDescription:
      "Multilingual conversational analytics that read intent, answer at source, and route only what needs a person.",
    objectivesTitle: "Objectives",
    challengesTitle: "Challenges",
    challenges: [
      "High contact center volume across 50+ regional languages.",
      "Slow intent classification leading to excessive customer transfers.",
    ],
    solutionTitle: "Solution",
    solutionItems: [
      {
        text: "Real-time multilingual intent recognition and automated agentic routing.",
        ribbon: "/images/case-studies/solution-ribbon-03.png",
      },
    ],
    technologyTitle: "Technology",
    technologies: "Vertex AI Conversation Agents, Gemini Flash, BigQuery",
    technologyNote: "Zero data retention architecture",
    outcomeTitle: "Outcome",
    outcomeItems: [
      {
        index: "01",
        emphasis: "Around 90%",
        text: "end-to-end automation rate.",
      },
      {
        index: "02",
        emphasis: "94% confidence",
        text: "across 50+ supported languages.",
      },
    ],
    architecture: {
      type: "iframe",
      src: "/embeds/azure-analytics-architecture.html",
      title: "Conversational Analytics Architecture",
    },
  },
  {
    slug: "enterprise-mlops-on-vertex-ai",
    title: "Enterprise MLOps on Vertex AI",
    image: {
      src: "/images/partners/gemini/proof/enterprise-mlops.png",
      alt: "Enterprise MLOps on Vertex AI",
    },
    industry: "MLOps & Cloud",
    capability: "AIOps & Cloud",
    techPlatform: "Vertex AI",
    heroHeading: "Enterprise MLOps on Vertex AI",
    heroDescription:
      "The model lifecycle automated end to end, from training through release and monitoring.",
    objectivesTitle: "Objectives",
    challengesTitle: "Challenges",
    challenges: [
      "Manual model deployment processes causing multi-month release delays.",
      "Lack of unified drift detection and automated rollback controls.",
    ],
    solutionTitle: "Solution",
    solutionItems: [
      {
        text: "Automated model training, continuous evaluation, and Vertex AI Model Registry deployment pipelines.",
        ribbon: "/images/case-studies/solution-ribbon-04.png",
      },
    ],
    technologyTitle: "Technology",
    technologies: "Vertex AI Pipelines, Cloud Monitoring, BigQuery ML, Kubeflow",
    technologyNote: "Automated model drift alerting",
    outcomeTitle: "Outcome",
    outcomeItems: [
      {
        index: "01",
        emphasis: "30 to 50%",
        text: "lower ongoing operational and infrastructure cost.",
      },
    ],
    architecture: {
      type: "iframe",
      src: "/embeds/azure-analytics-architecture.html",
      title: "Enterprise MLOps Architecture",
    },
  },
];

/**
 * Filter group + option labels — exact per the brief. Options carry
 * no counts here: CaseStudyHub computes real counts from whatever
 * `caseStudies` array it's given, rather than hardcoding Figma's mock
 * counts (2, 3, 2, 3, 2...), which are static design-file numbers
 * that don't correspond to the 6 identical mock records above and
 * would go stale the moment real WordPress data replaces them.
 */
export const caseStudyFilterGroups: FilterGroupConfig[] = [
  {
    id: "industry",
    title: "Industry Segment",
    options: [
      { value: "BFSI", label: "BFSI" },
      { value: "Healthcare", label: "Healthcare" },
      { value: "Retail & E-commerce", label: "Retail & E-commerce" },
      { value: "Logistics", label: "Logistics" },
      { value: "Manufacturing", label: "Manufacturing" },
    ],
  },
  {
    id: "capability",
    title: "Core Capability",
    options: [
      { value: "Agentic AI Systems", label: "Agentic AI Systems" },
      { value: "Physical AI & Automation", label: "Physical AI & Automation" },
      {
        value: "UX Strategy & Design Systems",
        label: "UX Strategy & Design Systems",
      },
      { value: "AIOps & Cloud", label: "AIOps & Cloud" },
      { value: "MLOps & Data Engineering", label: "MLOps & Data Engineering" },
    ],
  },
  {
    id: "techPlatform",
    title: "Tech Platform",
    options: [
      { value: "Python", label: "Python" },
      { value: "OpenAI/Anthropic APIs", label: "OpenAI/Anthropic APIs" },
      { value: "React/Node.js", label: "React/Node.js" },
      { value: "PyTorch/TensorFlow", label: "PyTorch/TensorFlow" },
      { value: "AWS/Azure/GCP", label: "AWS/Azure/GCP" },
    ],
  },
];

/**
 * Looks up one Case Study by its slug, for the Case Study Inner
 * ("/case-studies/[slug]") route. Mirrors `getArticleBySlug`'s
 * contract exactly: returns `undefined` for a nonexistent slug OR a
 * slug whose record has no Inner Page content yet (missing
 * `heroHeading`/`heroDescription`, or missing Objectives/Solution/
 * Technology/Outcome fields) — the route calls `notFound()` in either
 * case, rather than rendering a partial page.
 */
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  const caseStudy = caseStudies.find((item) => item.slug === slug);
  const hasHero = caseStudy?.heroHeading && caseStudy?.heroDescription;
  const hasObjectives =
    caseStudy?.objectivesTitle &&
    caseStudy?.challengesTitle &&
    caseStudy?.challenges?.length;
  const hasSolution =
    caseStudy?.solutionTitle && caseStudy?.solutionItems?.length;
  const hasTechnology =
    caseStudy?.technologyTitle &&
    caseStudy?.technologies &&
    caseStudy?.technologyNote;
  const hasOutcome =
    caseStudy?.outcomeTitle && caseStudy?.outcomeItems?.length;
  const hasArchitecture =
    Boolean(caseStudy?.architecture) ||
    Boolean(
      caseStudy?.architectureImage &&
        caseStudy?.architectureImageWidth &&
        caseStudy?.architectureImageHeight,
    );
  if (
    !hasHero ||
    !hasObjectives ||
    !hasSolution ||
    !hasTechnology ||
    !hasOutcome ||
    !hasArchitecture
  ) {
    return undefined;
  }
  return caseStudy;
}
