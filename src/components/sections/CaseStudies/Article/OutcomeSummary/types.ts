export interface OutcomeSummaryCTA {
  enabled: boolean;
  label: string | null;
  href: string | null;
}

export interface OutcomeSummaryProps {
  title: string;
  description: string;
  primaryCta?: OutcomeSummaryCTA | null;
  secondaryCta?: OutcomeSummaryCTA | null;
}
