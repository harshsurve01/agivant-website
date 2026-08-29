import type { SolutionMedia } from "@/data/solutionPage";

/**
 * Props for the Solution Inner Page Hero (/solutions/[slug]).
 *
 * Receives typed editorial and presentation data from the page layer,
 * backed by solutionPage.json.
 */
export interface SolutionHeroProps {
  /**
   * Solution page headline, supporting intentional <br> line breaks.
   * Example: "Put goal-driven agents to<br>work across repetitive<br>enterprise workflows"
   */
  heading: string;

  /**
   * Supporting summary paragraph beneath the headline.
   */
  description: string;

  /**
   * Solution-specific hero ribbon media asset.
   */
  media?: SolutionMedia | null;
}
