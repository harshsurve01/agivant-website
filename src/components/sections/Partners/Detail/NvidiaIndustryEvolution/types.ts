export interface EvolutionItem {
  label: string;
  description: string;
}

export interface EvolutionColumn {
  title: string;
  items: EvolutionItem[];
}

export interface NvidiaIndustryEvolutionData {
  heading: string;
  description?: string;
  legacy: EvolutionColumn;
  modern: EvolutionColumn;
  ribbon?: {
    src: string;
    width: number;
    height: number;
    alt?: string;
  };
}

export interface NvidiaIndustryEvolutionProps {
  data: NvidiaIndustryEvolutionData;
  className?: string;
}
