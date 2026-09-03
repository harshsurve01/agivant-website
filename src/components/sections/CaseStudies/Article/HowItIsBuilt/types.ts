export interface TableRowItem {
  id: string;
  label: string;
  value: string;
}

export interface BeforeAfterCardItem {
  id: string;
  title: string;
  body: string;
}

export interface HowItIsBuiltProps {
  title?: string;
  rows: TableRowItem[];
  beforeCard?: BeforeAfterCardItem;
  afterCard?: BeforeAfterCardItem;
}
