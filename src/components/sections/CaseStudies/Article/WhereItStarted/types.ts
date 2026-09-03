export interface ProblemCardItem {
  id: string;
  title: string;
  description: string;
}

export interface RoleSummaryItem {
  title: string;
  description: string;
}

export interface WhereItStartedProps {
  title?: string;
  description?: string;
  cards: ProblemCardItem[];
  role?: RoleSummaryItem;
}
