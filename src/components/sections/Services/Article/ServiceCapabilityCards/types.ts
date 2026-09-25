import type { StandardizedMediaObject } from "@/data/services";

export interface ServiceCapabilityCardBlock {
  id: string;
  type?: string;
  title: string;
  eyebrow?: string | null;
  label?: string | null;
  summary?: string | null;
  description?: string | null;
  media: StandardizedMediaObject | {
    src: string;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
  };
  bullets: string[];
  cta?: {
    label?: string;
    href?: string;
  } | null;
}

export interface ServiceCapabilityRibbonData {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ServiceCapabilityCardsProps {
  id?: string;
  heading?: string;
  description?: string;
  align?: "center" | "left";
  highlightPhrase?: string;
  cards: ServiceCapabilityCardBlock[];
  className?: string;
  ribbon?: ServiceCapabilityRibbonData | null;
  variant?: "default" | "nvidia";
  nvidiaTypography?: boolean;
}
