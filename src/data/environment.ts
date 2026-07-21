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

export interface EnvironmentStage {
  id: string;
  /** Zero-padded display number ("01", "02"...) — kept as a string
   *  rather than derived from array index so the display format isn't
   *  implicitly coupled to array position. */
  step: string;
  title: string;
  sections: EnvironmentStageSection[];
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
 * numbered stage list, and EnvironmentExperience currently defaults
 * its active stage to index 0 ("Architect") — see that component's
 * comment on why the setter is unused today.
 *
 * CONTENT NOTE: only "Architect" has confirmed section copy — it's
 * the one stage expanded in the supplied screenshot. The other four
 * stages' `sections` below are explicitly marked as placeholders, not
 * real copy; do not treat them as confirmed content.
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
  },
  {
    id: "build",
    step: "02",
    title: "Build",
    // TODO(content): not shown in the supplied screenshot (only
    // "Architect" was expanded) — placeholder pending real copy.
    sections: [
      {
        heading: "Implementation & Delivery",
        body: "Placeholder — real copy pending",
      },
    ],
  },
  {
    id: "tune",
    step: "03",
    title: "Tune",
    // TODO(content): placeholder pending real copy.
    sections: [
      {
        heading: "Testing & Optimization",
        body: "Placeholder — real copy pending",
      },
    ],
  },
  {
    id: "operate",
    step: "04",
    title: "Operate",
    // TODO(content): placeholder pending real copy.
    sections: [
      {
        heading: "Deployment & Operations",
        body: "Placeholder — real copy pending",
      },
    ],
  },
  {
    id: "evolve",
    step: "05",
    title: "Evolve",
    // TODO(content): placeholder pending real copy.
    sections: [
      {
        heading: "Iteration & Growth",
        body: "Placeholder — real copy pending",
      },
    ],
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