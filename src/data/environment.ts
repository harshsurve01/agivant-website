/**
 * data/environment.ts
 *
 * Mock data source for the "What's Inside The Amp'd Build Environment?"
 * section. Shaped as async getters, not static exports — same reasoning
 * as data/ai-stack.ts and every other data/*.ts file in this project:
 * swapping these internals for a real Headless WordPress fetch later
 * requires zero changes to the Environment components.
 *
 * Three getters, matching the three independently-owned content areas
 * (EnvironmentHeader, the stage list consumed by
 * EnvironmentExperience/Timeline/Card, and the section's own CTA) —
 * same split used in data/ai-stack.ts.
 *
 * CONTENT MODELING NOTE: each stage's body copy is modeled as
 * `sections: { heading, body }[]`, not one paragraph. The supplied
 * screenshot shows the "Architect" stage's card containing two
 * distinct labeled groups ("Architecture & Solution Design" and
 * "Development & Engineering"), each with its own short body — that's
 * semantically two things, not one string with line breaks. Flattening
 * it would lose the per-group heading and make it impossible for
 * EnvironmentCardFace to style or reorder groups independently later.
 *
 * STAT MODELING NOTE: `stat` is new — the vertical timeline now shows
 * a single per-step metric next to whichever stage is currently
 * active (e.g. "12 blueprints mapped"). Modeled as one {value, label}
 * pair, not a list: the timeline has room for exactly one stat per
 * step in the reference behavior, and a list would need its own
 * layout decision that hasn't been specified. Optional on the type
 * because it's unconfirmed for four of the five stages (see below).
 *
 * Today: resolves instantly with hardcoded mock data.
 * Later:  will `fetch()` a WordPress REST/GraphQL endpoint and return
 *         the same shape.
 */

export interface EnvironmentHeaderData {
  heading: {
    /** Leading words of line 1, default color (e.g. "What's Inside The"). */
    line1: string;
    /** Accent-colored close of line 1 (e.g. "Amp'd"). */
    highlight: string;
    /** Second heading line, default color (e.g. "Build Environment?"). */
    line2: string;
  };
  description: string;
}

export interface EnvironmentStageSection {
  heading: string;
  body: string;
}

export interface EnvironmentStageStat {
  value: string;
  label: string;
}

export interface EnvironmentStage {
  id: string;
  /** Zero-padded display number ("01", "02"...) — kept as a string
   *  rather than derived from array index so the display format isn't
   *  implicitly coupled to array position. */
  step: string;
  title: string;
  sections: EnvironmentStageSection[];
  /** Shown next to this stage's timeline row only while it's active.
   *  TODO(content): no stat was visible in the supplied screenshot for
   *  ANY stage — every value below is a placeholder, not confirmed
   *  copy. See the per-stage TODOs. */
  stat: EnvironmentStageStat;
}

export interface EnvironmentCTAData {
  label: string;
  href: string;
}

const mockEnvironmentHeader: EnvironmentHeaderData = {
  heading: {
    line1: "What's Inside The",
    highlight: "Amp'd",
    line2: "Build Environment?",
  },
  description:
    "A visible toolchain our engineers and agents work in across each stage of the Amp'd journey",
};

/**
 * Order matters: EnvironmentTimeline renders these in sequence as the
 * numbered stage list, and EnvironmentExperience's scroll-sync maps
 * scroll progress directly onto this array's index order.
 *
 * CONTENT NOTE: only "Architect" has confirmed section copy — it's
 * the one stage expanded in the supplied screenshot. The other four
 * stages' `sections` (and every stage's `stat`) below are explicitly
 * marked as placeholders, not real copy; do not treat them as
 * confirmed content.
 */
const mockEnvironmentStages: EnvironmentStage[] = [
  {
    id: "architect",
    step: "01",
    title: "Architect",
    sections: [
      {
        heading: "Architecture & Solution Design",
        body: "Intent-to-architecture mapping",
      },
      {
        heading: "Development & Engineering",
        body: "Spec authoring and technical design",
      },
    ],
    stat: { value: "12", label: "blueprints mapped" },
  },

  {
    id: "build",
    step: "02",
    title: "Build",
    sections: [
      {
        heading: "Architecture & Solution Design",
        body: "Agent-orchestrated system design",
      },
      {
        heading: "Development & Engineering",
        body: "Agent-harnessed code generation",
      },
    ],
    stat: { value: "48", label: "components shipped" },
  },

  {
    id: "tune",
    step: "03",
    title: "Tune",
    sections: [
      {
        heading: "Architecture & Solution Design",
        body: "Design validation against production signals",
      },
      {
        heading: "Development & Engineering",
        body: "Automated testing, integration and review",
      },
    ],
    stat: { value: "99.2%", label: "test coverage" },
  },

  {
    id: "operate",
    step: "04",
    title: "Operate",
    sections: [
      {
        heading: "Architecture & Solution Design",
        body: "Architecture compliance and drift detection",
      },
      {
        heading: "Development & Engineering",
        body: "Production reliability and code health",
      },
    ],
    stat: { value: "99.99%", label: "uptime" },
  },

  {
    id: "evolve",
    step: "05",
    title: "Evolve",
    sections: [
      {
        heading: "Architecture & Solution Design",
        body: "Design patterns captured for reuse",
      },
      {
        heading: "Development & Engineering",
        body: "Reusable code and agents lift speed for future build",
      },
    ],
    stat: { value: "6", label: "iterations per quarter" },
  },
];

const mockEnvironmentCTA: EnvironmentCTAData = {
  label: "Explore the full environment",
  href: "/environment", // TODO(content): confirm real destination
};

export async function getEnvironmentHeader(): Promise<EnvironmentHeaderData> {
  return mockEnvironmentHeader;
}

/**
 * Returns the Environment stages in numbered display order — see the
 * ordering note above.
 */
export async function getEnvironmentStages(): Promise<EnvironmentStage[]> {
  return mockEnvironmentStages;
}

export async function getEnvironmentCTA(): Promise<EnvironmentCTAData> {
  return mockEnvironmentCTA;
}
