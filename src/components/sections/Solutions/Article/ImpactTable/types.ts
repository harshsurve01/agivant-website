import type { SolutionSectionData, SolutionSectionBlock } from "@/data/solutionPage";

export interface ImpactTableProps {
  data: SolutionSectionData;
  blocks: SolutionSectionBlock[];
  variant?: "glass" | "default";
  className?: string;
}
