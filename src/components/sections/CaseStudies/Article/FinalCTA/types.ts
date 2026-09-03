export interface FinalCTAItem {
  enabled: boolean;
  label: string;
  href: string;
  external?: boolean;
}

export interface FinalCTAProps {
  heading?: string;
  description?: string;
  primaryCta?: FinalCTAItem;
  secondaryCta?: FinalCTAItem;
}
