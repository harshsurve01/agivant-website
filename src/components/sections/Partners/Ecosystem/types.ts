export interface PartnerLogoData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface PartnerCardData {
  name: string;
  slug: string;
  logo: PartnerLogoData;
  description: string;
  href: string;
  hoverColor?: string;
  hoverAccent?: string;
}

export interface EcosystemSectionProps {
  heading: string;
  description: string;
  partners: PartnerCardData[];
}
