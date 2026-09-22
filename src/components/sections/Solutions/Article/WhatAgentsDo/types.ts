import type { SolutionSectionBlock, SolutionSectionData } from "@/data/solutionPage";

export interface WhatAgentsDoData {
  heading?: string | null;
  description?: string | null;
  eyebrow?: string | null;
  closingStatement?: string | null;
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
}
