export interface AtAGlanceBlock {
  id: string;
  title: string;
  body: string;
}

export interface AtAGlanceProps {
  title: string;
  blocks: AtAGlanceBlock[];
}
