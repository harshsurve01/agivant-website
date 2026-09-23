export interface CleanDataMedia {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface CleanDataCardBlock {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  bullets?: string[];
  media?: CleanDataMedia | null;
  layout?: "media-top" | "media-bottom" | "split-center" | string;
}

export interface CleanDataProps {
  heading?: string;
  cards: CleanDataCardBlock[];
  className?: string;
}
