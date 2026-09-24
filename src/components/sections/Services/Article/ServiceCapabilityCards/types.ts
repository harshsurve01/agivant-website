import type { StandardizedMediaObject } from "@/data/services";

export interface ServiceCapabilityCardBlock {
  id: string;
  type?: string;
  title: string;
  summary?: string | null;
  media: StandardizedMediaObject | {
    src: string;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
  };
  bullets: string[];
}

export interface ServiceCapabilityRibbonData {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ServiceCapabilityCardsProps {
  heading?: string;
  cards: ServiceCapabilityCardBlock[];
  className?: string;
  ribbon?: ServiceCapabilityRibbonData | null;
}
