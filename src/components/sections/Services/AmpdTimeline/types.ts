export interface AmpdTimelineItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface AmpdTimelineProps {
  heading?: string;
  items: AmpdTimelineItem[];
  className?: string;
  defaultActiveIndex?: number;
}
