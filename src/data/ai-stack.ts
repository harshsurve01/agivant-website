/**
 * data/ai-stack.ts
 *
 * Mock data source for the AIStack section. Shaped as async getters —
 * not static exports — same reasoning as every other data/*.ts file in
 * this project: swapping these internals for a real Headless
 * WordPress fetch later requires zero changes to the AIStack
 * components.
 *
 * Three getters, matching the three independently-owned content areas
 * (AIStackHeader, AIStackGrid/Card, and the section's own CTA) — same
 * split used in data/lifecycle.ts.
 *
 * CONTENT MODELING NOTE: the heading is two lines where only part of
 * line 2 is accent-colored ("Engineering Every Layer" / "Of Your
 * [AI Stack]"). That's modeled as three fields below, not one string
 * with markup embedded in it — same discipline as Hero's and
 * Lifecycle's title objects.
 *
 * Today: resolves instantly with hardcoded mock data.
 * Later:  will `fetch()` a WordPress REST/GraphQL endpoint and return
 *         the same shape.
 */

export interface AIStackHeaderData {
  heading: {
    /** First heading line, default color (e.g. "Engineering Every Layer"). */
    line1: string;
    /** Leading words of line 2, default color (e.g. "Of Your"). */
    line2Prefix: string;
    /** Accent-colored close of line 2 (e.g. "AI Stack"). */
    highlight: string;
  };
  description: string;
}

export interface AIStackCardData {
  id: string;
  title: string;
  description: string;
  badge: string;
  backgroundImage: string;
  accentColor: string;
  ribbonPosition?: string; // CSS object-position value, e.g. "bottom", "top right"
}

export interface AIStackCTAData {
  label: string;
  href: string;
}

const mockAIStackHeader: AIStackHeaderData = {
  heading: {
    line1: "Engineering Every Layer",
    line2Prefix: "Of Your",
    highlight: "AI Stack",
  },
  description:
    "Agivant engineers the agents, applications, platforms, data and operations that make enterprise AI work",
};

/**
 * Order matters here beyond display sequence: AIStackGrid places the
 * first card in a spanning position (see AIStackGrid.module.css) and
 * lets the rest auto-flow around it. This order — Agentic first, then
 * column-2-top, column-3-top, column-2-bottom, column-3-bottom —
 * is what makes plain CSS Grid auto-placement reproduce the Figma's
 * layout without any explicit per-card position data.
 */
const mockAIStackCards: AIStackCardData[] = [
  {
    id: "agentic-ai-agentops",
    title: "Agentic AI & AgentOps",
    description:
      "We engineer agent-led workflows with orchestration, guardrails and policy enforcement, built in from the first line of the spec.",
    badge: "Agentic",
    // ASSET NOTE: no ribbon artwork was supplied at implementation
    // time, matching Hero's ASSET NOTE precedent. Path is a placeholder
    // for where the real per-card export should land.
    backgroundImage: "/images/ai-stack/agentic-ai-agentops-ribbon.svg",
    accentColor: "#7c3aed", // TODO(design-tokens): confirm brand-purple token name, see other sections' same TODO
  },
  {
    id: "ai-ml-engineering",
    title: "AI & ML Engineering",
    description:
      "We build RAG systems, predictive models, copilots and inference services engineered to spec, tuned for accuracy and built for real business use.",
    badge: "AI / ML",
    backgroundImage: "/images/ai-stack/ai-ml-ribbon.svg",
    accentColor: "#7c3aed",
  },
  {
    id: "cloud-platform-engineering",
    title: "Cloud & Platform Engineering",
    description:
      "We modernize cloud, platform and API foundations so agents and AI systems run at enterprise scale, built to carry what comes next.",
    badge: "Cloud",
    backgroundImage: "/images/ai-stack/cloud-platform-engineering-ribbon.svg",
    accentColor: "#7c3aed",
  },
  {
    id: "ai-ready-data-engineering",
    title: "AI-Ready Data Engineering",
    description:
      "We build pipelines, semantic layers, knowledge systems, vector retrieval and data quality foundations so agents have reliable ground truth from day one.",
    badge: "Data",
    backgroundImage: "/images/ai-stack/ai-ready-data-engineering-ribbon.svg",
    accentColor: "#7c3aed",
  },
  {
    id: "mlops-ai-operations",
    title: "MLOps & AI Operations",
    description:
      "We operationalize agents with deployment pipelines, monitoring, evaluation, FinOps and the runtime controls that keep production systems governed and improving.",
    badge: "Platform",
    backgroundImage: "/images/ai-stack/mlops-ai-operations-ribbon.svg",
    accentColor: "#7c3aed",
  },
];

const mockAIStackCTA: AIStackCTAData = {
  label: "See what we build",
  href: "/what-we-build", // TODO(content): confirm real destination
};

export async function getAIStackHeader(): Promise<AIStackHeaderData> {
  return mockAIStackHeader;
}

/**
 * Returns the AI Stack cards in the exact order AIStackGrid expects
 * for its auto-placement layout — see the ordering note above.
 */
export async function getAIStackCards(): Promise<AIStackCardData[]> {
  return mockAIStackCards;
}

export async function getAIStackCTA(): Promise<AIStackCTAData> {
  return mockAIStackCTA;
}
