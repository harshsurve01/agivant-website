import type { SolutionHubItem } from "@/data/solutions";

export interface SolutionsHubProps {
  solutions: SolutionHubItem[];
  categories?: readonly string[];
  domains?: readonly string[];
  className?: string;
}
