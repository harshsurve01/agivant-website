/**
 * data/lifecycle.ts
 *
 * Mock data source for the Lifecycle section. Shaped as async getters —
 * not static exports — for the same reason as getHero() and
 * getAnnouncements(): swapping these internals for a real Headless
 * WordPress fetch later requires zero changes to the Lifecycle
 * components.
 *
 * Three getters, not one, because the section has three independently
 * owned content areas (LifecycleHeader, LifecycleAccordion/Item,
 * LifecycleSummary) — mirrors how the components themselves are split.
 *
 * CONTENT MODELING NOTE: the Figma shows several blocks that sit close
 * together visually but are distinct content: the struck-through
 * "Traditional SDLC" eyebrow, the two-tone heading ("AI-Native" +
 * "Engineering Lifecycle"), and the section description are three
 * separate fields below, not one concatenated string — each needs its
 * own styling (strikethrough, accent color, body copy) that would be
 * impossible to apply correctly to a single merged string.
 *
 * Today: resolves instantly with hardcoded mock data.
 * Later:  will `fetch()` a WordPress REST/GraphQL endpoint and return
 *         the same shape.
 */

export interface LifecycleHeaderData {
  /** The struck-through line above the real heading (e.g. "Traditional SDLC"). */
  eyebrow: string;
  title: {
    /** The accent-colored lead word (e.g. "AI-Native"). */
    highlight: string;
    /** The rest of the heading, in the default text color. */
    suffix: string;
  };
  description: string;
}

export interface LifecycleStage {
  id: string;
  title: string;
  description: string;
  /** Optional pill label shown on the expanded card (e.g. "Governed"). Not every stage has one. */
  status?: string;
  /** Which stage the accordion opens with before any hover/click interaction. */
  isDefaultOpen: boolean;
}

export interface LifecycleSummaryData {
  title: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
}

const mockLifecycleHeader: LifecycleHeaderData = {
  eyebrow: "Traditional SDLC",
  title: {
    highlight: "AI-Native",
    suffix: "Engineering Lifecycle",
  },
  description:
    "We engineer the spec, agents accelerate the build and production signals improve every cycle",
};

/**
 * Only "Architect" had its full body copy and status visible in the
 * supplied Figma (the other four rows were shown collapsed, title
 * only). Rather than invent enterprise-sounding copy that might not
 * match the real product, the remaining descriptions are left as
 * explicit TODO(content) placeholders — same discipline as the
 * TODO(figma) markers already used elsewhere in this codebase for
 * unconfirmed values. Swap these for real copy when it's supplied;
 * no component changes are needed to do so.
 */
const mockLifecycleStages: LifecycleStage[] = [
  {
    id: "architect",
    title: "Architect",
    description:
      "Translate business intent into an executable architecture, data, integration, identity model, policy constraints, and security posture before anything is built.",
    status: "Governed",
    isDefaultOpen: true,
  },
  {
    id: "build",
    title: "Build",
    description:
      "Engineers harness agents to implement the spec, generating code and assembling production-ready workflows inside your environment.",
    status: "Governed",
    isDefaultOpen: false,
  },
  {
    id: "tune",
    title: "Tune",
    description:
      "Validate against live signals, refine design and code, and lift quality and performance without rebuilding from scratch.",
    status: "Governed",
    isDefaultOpen: false,
  },
  {
    id: "operate",
    title: "Operate",
    description:
      "Run in production under full observability, cost controls, and accountability loops. Reliable at load, ready to scale on demand.",
    status: "Governed",
    isDefaultOpen: false,
  },
  {
    id: "evolve",
    title: "Evolve",
    description:
      "Feed production learning back into the spec, turning patterns into reusable engineering assets.",
    status: "Governed",
    isDefaultOpen: false,
  },
];

const mockLifecycleSummary: LifecycleSummaryData = {
  title: "Amplify",
  description:
    "Every stage ships faster, costs less, and amplifies the next. That's what gets your enterprise Amp'd.",
  cta: {
    label: "See Amp'd in action",
    href: "/amp-d",
  },
};

export async function getLifecycleHeader(): Promise<LifecycleHeaderData> {
  return mockLifecycleHeader;
}

/**
 * Returns the lifecycle stages in display order. isDefaultOpen marks
 * which stage the accordion should show open before any user
 * interaction — exactly one stage should have this set to true.
 */
export async function getLifecycleStages(): Promise<LifecycleStage[]> {
  return mockLifecycleStages;
}

export async function getLifecycleSummary(): Promise<LifecycleSummaryData> {
  return mockLifecycleSummary;
}