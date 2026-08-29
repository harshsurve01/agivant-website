import type { SolutionSectionBlock, SolutionSectionData } from "@/data/solutionPage";

/**
 * Props for WhatAgentsDo section component.
 * Content arrives strictly via typed props from solutionPage.json.
 */
export interface WhatAgentsDoProps {
  data: SolutionSectionData;
  blocks: SolutionSectionBlock[];
}
