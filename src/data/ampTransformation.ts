/**
 * data/ampTransformation.ts
 *
 * Mock data source for the "What Changes When Your Enterprise Gets
 * Amp'd?" section. Shaped as async getters, not static exports — same
 * reasoning as every other data/*.ts file in this project (see
 * data/environment.ts, data/ai-stack.ts): swapping these internals
 * for a real Headless WordPress fetch later requires zero changes to
 * any AmpTransformation component.
 *
 * Six getters, matching the six independently-owned content areas
 * called out in the section's data structure (header, leftColumn,
 * hub, rightColumn, statement, progress) — same one-getter-per-owned-area
 * split used across every other data/*.ts file.
 *
 * CONTENT MODELING NOTE (header): the heading is two lines where only
 * the trailing word of line 2 ("Amp'd?") is accent-colored. Modeled
 * as three fields, not one string with markup embedded in it — same
 * discipline as Environment's and AIStack's heading objects. The
 * description is similarly two distinct pieces: a short accent-colored
 * lead-in sentence and a longer default-color supporting sentence —
 * modeled as {highlight, body} rather than one string for the same
 * reason.
 *
 * CONTENT MODELING NOTE (hub): the central "Amp'd" wordmark is split
 * into {lead, body, highlight} rather than a single string so
 * AmpHub can color each fragment independently (accent red / default
 * / brand purple in the supplied screenshot) without hardcoding any
 * of that text inside the component itself.
 *
 * CONTENT MODELING NOTE (connectors): `leftConnectors`/`rightConnectors`
 * on hub tell AmpHub how many connector lines to fan out on each
 * side. They are data, not derived from leftColumn.cards.length /
 * rightColumn.cards.length, so AmpHub never needs to reach into a
 * sibling's data to know its own shape — it stays a pure function of
 * the single `hub` object it's handed, per the section's data-flow
 * rule. In today's mock data they intentionally match each column's
 * card count; keep them in sync when editing either.
 *
 * CONTENT MODELING NOTE (statement): the closing statement highlights
 * one trailing phrase ("Autonomous Agentic Enterprise") inside an
 * otherwise default-color sentence — modeled as {prefix, highlight},
 * same {default, accent} split used everywhere else in this file.
 *
 * Today: resolves instantly with hardcoded mock data.
 * Later:  will `fetch()` a WordPress REST/GraphQL endpoint and return
 *         the same shape.
 */

export interface AmpHeaderData {
  heading: {
    /** First heading line, default color (e.g. "What Changes When Your"). */
    line1: string;
    /** Leading words of line 2, default color (e.g. "Enterprise Gets"). */
    line2Prefix: string;
    /** Accent-colored close of line 2 (e.g. "Amp'd?"). */
    highlight: string;
  };
  description: {
    /** Short accent-colored lead-in sentence. */
    highlight: string;
    /** Supporting sentence, default color. */
    body: string;
  };
}

export interface AmpCardData {
  id: string;
  title: string;
}

export interface AmpColumnData {
  title: string;
  cards: AmpCardData[];
}

export interface AmpHubData {
  brand: {
    /** Accent-colored leading fragment (e.g. "A"). */
    lead: string;
    /** Default-color middle fragment (e.g. "mp"). */
    body: string;
    /** Brand-purple closing fragment (e.g. "'d"). */
    highlight: string;
    /**
     * Optional path (under /public) to the Amp'd logo mark. When
     * present, AmpHub renders this image instead of the
     * lead/body/highlight text fragments above — see AmpHub.tsx.
     */
    logoSrc?: string;
    /** Accessible alt text for logoSrc. Defaults to "Amp'd" if omitted. */
    logoAlt?: string;
  };
  /** Number of connector lines fanned out toward the left column. */
  leftConnectors: number;
  /** Number of connector lines fanned out toward the right column. */
  rightConnectors: number;
}

export interface AmpStatementData {
  /** Default-color leading fragment (e.g. "Fragmented systems become the"). */
  prefix: string;
  /** Accent-colored closing fragment (e.g. "Autonomous Agentic Enterprise"). */
  highlight: string;
}

export interface AmpProgressStage {
  id: string;
  /** Displayed score range for this stage (e.g. "1 to 3"). */
  range: string;
  title: string;
  description: string;
}

export interface AmpProgressCTAData {
  label: string;
  href: string;
}

export interface AmpProgressData {
  title: string;
  stages: AmpProgressStage[];
  /** Optional per "Future WordPress Integration": the button is not
   *  guaranteed to always exist. */
  button?: AmpProgressCTAData;
}

const mockAmpHeader: AmpHeaderData = {
  heading: {
    line1: "What Changes When Your",
    line2Prefix: "Enterprise Gets",
    highlight: "Amp'd?",
  },
  description: {
    highlight: "Amp'd is how Agivant engineers, for every enterprise.",
    body: "Your Amp'd score shows where you stand, forward-deployed engineers work inside your environment, production-grade agents and reusable engineering assets carry it into live systems.",
  },
};

/**
 * Order matters: AmpColumn renders these in sequence, top to bottom,
 * exactly as supplied here.
 */
const mockAmpLeftColumn: AmpColumnData = {
  title: "The Agivant Amp'd Way",
  cards: [
    { id: "proof-of-value", title: "Proof of value in weeks" },
    { id: "forward-deployed-engineers", title: "Forward-deployed engineers" },
    { id: "production-grade-agents", title: "Production-grade agents" },
    { id: "every-build-reusable", title: "Every build becomes reusable" },
  ],
};

const mockAmpRightColumn: AmpColumnData = {
  title: "What Global Enterprises Gain",
  cards: [
    { id: "measurable-roi", title: "AI spend becomes measurable ROI" },
    { id: "governed-pilots", title: "Pilots become governed" },
    { id: "enterprise-trust", title: "Risk becomes enterprise-grade trust" },
    { id: "autonomous-workflows", title: "Workflows become autonomous" },
  ],
};

const mockAmpHub: AmpHubData = {
  brand: {
    lead: "A",
    body: "mp",
    highlight: "'d",
    // TODO(content): update this path once the actual logo file is
    // added under /public — see AmpHub.tsx's fallback-to-text logic.
    logoSrc: "/images/hero/ampd-wordmark.svg",
    logoAlt: "Amp'd",
  },
  // Matches the four cards in each column above — see the CONTENT
  // MODELING NOTE (connectors) at the top of this file.
  leftConnectors: mockAmpLeftColumn.cards.length,
  rightConnectors: mockAmpRightColumn.cards.length,
};

const mockAmpStatement: AmpStatementData = {
  prefix: "Fragmented systems become the",
  highlight: "Autonomous Agentic Enterprise",
};

/**
 * Order matters: AmpTimeline renders these left to right, exactly as
 * supplied here — the progression from Foundational to Autonomous is
 * meaningful sequence, not an unordered set.
 */
const mockAmpProgress: AmpProgressData = {
  title: "How Amp'd is Your Enterprise?",
  stages: [
    {
      id: "foundational",
      range: "1 to 3",
      title: "Foundational",
      description: "Use case in place",
    },
    {
      id: "operational",
      range: "4 to 6",
      title: "Operational",
      description: "Live systems emerging",
    },
    {
      id: "autonomous",
      range: "7 to 10",
      title: "Autonomous",
      description: "Agent-led at scale",
    },
  ],
  button: {
    label: "How Amp'd is your enterprise?",
    href: "/amp-score", // TODO(content): confirm real destination
  },
};

export async function getAmpHeader(): Promise<AmpHeaderData> {
  return mockAmpHeader;
}

export async function getAmpLeftColumn(): Promise<AmpColumnData> {
  return mockAmpLeftColumn;
}

export async function getAmpHub(): Promise<AmpHubData> {
  return mockAmpHub;
}

export async function getAmpRightColumn(): Promise<AmpColumnData> {
  return mockAmpRightColumn;
}

export async function getAmpStatement(): Promise<AmpStatementData> {
  return mockAmpStatement;
}

export async function getAmpProgress(): Promise<AmpProgressData> {
  return mockAmpProgress;
}