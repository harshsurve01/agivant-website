export interface PatternCardItem {
  id: string;
  title: string;
  body: string;
}

export interface QuoteCardItem {
  id: string;
  body: string;
  author: string;
}

export interface MovementStageItem {
  id: string;
  label: string;
  status: "default" | "active";
}

export interface EnterpriseMovementProps {
  heading: string;
  stages: MovementStageItem[];
}

export interface RepeatablePatternProps {
  title?: string;
  cards: PatternCardItem[];
  quote?: QuoteCardItem;
  movement?: EnterpriseMovementProps;
}
