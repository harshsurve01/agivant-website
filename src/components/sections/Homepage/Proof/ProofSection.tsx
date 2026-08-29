import { Container } from "@/components/ui/Container";
import { ProofContent } from "./ProofContent";
import { SpotlightExperience } from "./SpotlightExperience";
import type { CaseStudy } from "@/data/proof";
import { Gradient } from "@/components/effects/Gradient";
import styles from "./ProofSection.module.css";

export interface ProofSectionHeader {
  heading: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
}

export interface ProofSectionProps {
  header: ProofSectionHeader;
  caseStudies: CaseStudy[];
  layout?: "large-left" | "large-right";
}

/**
 * ProofSection
 *
 * "Proof Beyond The Pilot" — an Interactive Experience, not a card
 * grid: the section's right side is one Spotlight Container that will
 * later coordinate all three cards together on hover (hovered card
 * expands to fill the container, the other two leave the viewport),
 * rather than three independently-hoverable cards.
 *
 * Presentation Component: pure server component, accepts header and caseStudies
 * from page/data layer. No arbitrary file loading or hardcoded content.
 */
export function ProofSection({
  header,
  caseStudies,
  layout = "large-right",
}: ProofSectionProps) {
  if (!header || !caseStudies || caseStudies.length === 0) {
    return null;
  }

  return (
    <section className={styles.proof}>
      <Gradient
        top="40%"
        left="-10%"
        centerY
        size="clamp(320px, 32vw, 600px)"
        stops={["color-mix(in srgb, #9d84f2 85%, transparent) 0%", "transparent 78%"]}
        opacity={0.45}
        blur="90px"
      />
      <Gradient
        top="40%"
        right="20%"
        centerY
        size="clamp(320px, 32vw, 600px)"
        stops={["color-mix(in srgb, #9d84f2 85%, transparent) 0%", "transparent 78%"]}
        opacity={0.35}
        blur="90px"
      />

      <Container size="2xl">
        <div className={styles.inner}>
          <ProofContent
            heading={header.heading}
            description={header.description}
            cta={header.cta}
          />

          <SpotlightExperience caseStudies={caseStudies} layout={layout} />
        </div>
      </Container>
    </section>
  );
}
