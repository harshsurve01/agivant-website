/**
 * data/lifecycle.ts
 *
 * Single source of truth for Lifecycle content following AGIVANT_JSON_DATA_RULEBOOK.md.
 * Async getter signatures for seamless Headless WordPress fetch integration.
 */

export interface LifecycleHeaderData {
  eyebrow: string;
  title: {
    highlight: string;
    suffix: string;
  };
  description: string;
}

export interface LifecycleMediaData {
  kind: "image";
  src: string;
  alt: string;
}

export interface LifecycleStage {
  id: string;
  title: string;
  description: string;
  status?: string;
  media: LifecycleMediaData;
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

const mockLifecycleStages: LifecycleStage[] = [
  {
    id: "architect",
    title: "Architect",
    description:
      "Translate business intent into an executable architecture, data, integration, identity model, policy constraints, and security posture before anything is built.",
    status: "Governed",
    media: {
      kind: "image",
      src: "/images/lifecycle/architect.png",
      alt: "Architect stage visualization",
    },
  },
  {
    id: "build",
    title: "Build",
    description:
      "Engineers harness agents to implement the spec, generating code and assembling production-ready workflows inside your environment",
    status: "Governed",
    media: {
      kind: "image",
      src: "/images/lifecycle/build.png",
      alt: "Build stage visualization",
    },
  },
  {
    id: "tune",
    title: "Tune",
    description:
      "Validate against live signals, refine design and code, lift quality and performance without rebuilding from scratch",
    status: "Governed",
    media: {
      kind: "image",
      src: "/images/lifecycle/tune.png",
      alt: "Tune stage visualization",
    },
  },
  {
    id: "operate",
    title: "Operate",
    description:
      "Run in production under full observability, cost controls, and accountability loops. Reliable at load, ready to scale on demand",
    status: "Governed",
    media: {
      kind: "image",
      src: "/images/lifecycle/operate.png",
      alt: "Operate stage visualization",
    },
  },
  {
    id: "evolve",
    title: "Evolve",
    description:
      "Feed production learning back into the spec, turning patterns into reusable engineering assets",
    status: "Governed",
    media: {
      kind: "image",
      src: "/images/lifecycle/evolve.png",
      alt: "Evolve stage visualization",
    },
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

export async function getLifecycleStages(): Promise<LifecycleStage[]> {
  return mockLifecycleStages;
}

export async function getLifecycleSummary(): Promise<LifecycleSummaryData> {
  return mockLifecycleSummary;
}