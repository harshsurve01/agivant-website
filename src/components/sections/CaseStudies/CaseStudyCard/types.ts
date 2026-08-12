export interface CaseStudyCardImage {
  src: string;
  alt: string;
}

/**
 * Shape CaseStudyCard actually needs to render — a structural subset
 * of the full CaseStudy record in data/caseStudies.ts. This component
 * never imports that file directly (per the brief); CaseStudyHub
 * passes one record's worth of data through as this shape instead.
 */
export interface CaseStudyCardData {
  slug: string;
  title: string;
  image: CaseStudyCardImage;
  industry: string;
  capability: string;
}

export interface CaseStudyCardProps {
  caseStudy: CaseStudyCardData;
  /** Label for the card's action link. Defaults to "Deep Dive". */
  deepDiveLabel?: string;
}
