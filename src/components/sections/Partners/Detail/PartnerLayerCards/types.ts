import type { PartnerLayerCardsData } from "@/types/partnerDetail";
import type { SectionHeight } from "@/components/ui/Section";

export interface PartnerLayerCardsProps {
  data: PartnerLayerCardsData;
  height?: SectionHeight;
  className?: string;
  id?: string;
}
