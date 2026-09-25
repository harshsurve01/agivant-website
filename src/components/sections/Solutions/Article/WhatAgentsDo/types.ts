import type { SolutionSectionBlock, SolutionSectionData } from "@/data/solutionPage";

export interface WhatAgentsDoData {
  heading?: string | null;
  description?: string | null;
  eyebrow?: string | null;
  closingStatement?: string | null;
}

export interface WhatAgentsDoOutcome {
  label?: string | null;
  value: string;
  text?: string | null;
}

export interface WhatAgentsDoBlock {
  id: string;
  body?: string | null;
  title?: string | null;
}

/**
 * Props for WhatAgentsDo section component.
 * Content arrives strictly via typed props from solutionPage.json or partner pages.
 */
export interface WhatAgentsDoProps {
  data: SolutionSectionData | WhatAgentsDoData;
  blocks: (SolutionSectionBlock | WhatAgentsDoBlock)[];
  className?: string;
  id?: string;
  variant?: "default" | "partner";
  showAccentBar?: boolean;
  /** Optional full-width outcome panel below the grid. Omitted = not rendered. */
  outcome?: WhatAgentsDoOutcome;
}
