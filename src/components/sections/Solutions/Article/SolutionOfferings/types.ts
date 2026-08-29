import type { SolutionSectionData, SolutionSectionBlock } from "@/data/solutionPage";

export interface SolutionOfferingsProps {
  data: SolutionSectionData;
  blocks: SolutionSectionBlock[];
}

export interface OfferingCardProps {
  block: SolutionSectionBlock;
  index: number;
}
