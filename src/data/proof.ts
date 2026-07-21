/**
 * data/proof.ts
 *
 * CMS-ready data layer for the "Proof Beyond The Pilot" section, same
 * pattern as data/partners.ts: every shape below is the exact JSON
 * contract a future Headless WordPress response would return, so
 * swapping a getter's body from a static object to a `fetch()` call
 * is the only change needed later. No component imports fetch/query
 * logic directly; they only import these types and getters.
 */

/**
 * One case study. Maps to a WP custom post type — `metric`,
 * `metricLabel`, and `footer` are optional because not every case
 * study has them populated today (the two smaller spotlight cards
 * currently render without a metric callout), the same way an
 * editor might leave an ACF field group empty on a given post.
 */
export interface CaseStudy {
  id: string;
  industry: string;
  title: string;
  description: string;
  metric?: string;
  metricLabel?: string;
  footer?: string;
  image: {
    src: string;
    alt: string;
  };
  /**
   * Reserved for future per-card background/accent variation. Every
   * case study uses "default" today (Figma shows the same wave
   * artwork treatment across all three cards) — unused by any
   * component yet, but part of the contract so introducing real
   * variants later is additive, not a data-model migration.
   */
  theme?: string;
}

interface ProofHeaderContent {
  /**
   * Split into three parts (not {line1, line2} like Partners, and not
   * {line1, highlight, line2} like Environment) because this heading
   * highlights only its first word, and that word sits at the start
   * of the first of two lines — a shape neither existing header
   * pattern already covers.
   */
  heading: {
    highlightWord: string;
    line1Rest: string;
    line2: string;
  };
  description: string;
  cta: {
    label: string;
    href: string;
  };
}

/* --------------------------------------------------------------------
   Static content (today's "CMS response").
   Each getter is async and awaited independently in ProofSection.tsx
   via Promise.all — same reasoning as Partners.tsx: swapping any one
   of these for a real WP call later doesn't change the calling
   component at all.
   -------------------------------------------------------------------- */

async function getProofHeaderContent(): Promise<ProofHeaderContent> {
  return {
    heading: {
      highlightWord: "Proof",
      line1Rest: "Beyond",
      line2: "The Pilot.",
    },
    description:
      "How Agivant puts AI agents into production across 12+ industries",
    cta: {
      label: "See more client success",
      href: "/case-studies",
    },
  };
}

// Exported name matches ProofSection.tsx's import (`getProofHeader`).
export const getProofHeader = getProofHeaderContent;

async function getCaseStudiesContent(): Promise<CaseStudy[]> {
  return [
    /**
     * Array order is meaningful: SpotlightContainer maps index 0 to
     * the large slot and indices 1/2 to the top-right/bottom-right
     * slots. A future CMS integration will need an explicit "slot"
     * or "order" field rather than relying on array position once
     * editors can reorder case studies — flagged here, not solved
     * today since today's job is only the static markup.
     */
    {
      id: "agentic-quote-accelerator",
      industry: "Enterprise Sales",
      title: "Agentic Quote Accelerator",
      description:
        "A Fortune 500 sales team was losing weeks to manual quoting. SME-dependent, impossible to scale. Agivant wired agentic systems into the existing sales platform. The revenue team runs the business now. The agents run the process.",
      metric: "Days to Minutes",
      metricLabel: "Quoting cycle compression",
      footer: "Amp'd the sales engineering workflow.",
      image: {
        src: "/images/proof/agentic-quote-accelerator.jpg",
        alt: "Abstract flowing wave artwork for the Agentic Quote Accelerator case study",
      },
      theme: "default",
    },
    {
      id: "ai-native-sre-transformation",
      industry: "Cloud & Infrastructure",
      title: "AI-Native SRE Transformation",
      description:
        "GCE to GKE migration with AI-driven SRE taking ownership of steady-state operations...",
      image: {
        src: "/images/proof/ai-native-transformation.jpg",
        alt: "Abstract flowing wave artwork for the AI-Native SRE Transformation case study",
      },
      theme: "default",
    },
    {
      id: "global-markets-agent-network",
      industry: "Financial Markets",
      title: "Global Markets Agent Network",
      description:
        "Manual transaction operations could not scale without adding headcount...",
      image: {
        src: "/images/proof/global-market-agentic-network.jpg",
        alt: "Abstract flowing wave artwork for the Global Markets Agent Network case study",
      },
      theme: "default",
    },
  ];
}

// Exported name matches ProofSection.tsx's import (`getCaseStudies`).
export const getCaseStudies = getCaseStudiesContent;
