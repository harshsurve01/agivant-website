export interface BentoMetricItem {
  id: string;
  value: string;
  label: string;
  variant?: "small" | "wide";
}

export interface SubheadingBlock {
  heading: string;
  description?: string;
}

export interface ProofAndResultsProps {
  title?: string;
  description?: string;
  subheadingBlock?: SubheadingBlock;
  metrics: BentoMetricItem[];
}
