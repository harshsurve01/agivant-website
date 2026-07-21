import { Container } from "@/components/ui/Container";
import { ProofContent } from "./ProofContent";
import { SpotlightExperience } from "./SpotlightExperience";
import { getProofHeader, getCaseStudies } from "@/data/proof";
import styles from "./ProofSection.module.css";

/**
 * ProofSection
 *
 * "Proof Beyond The Pilot" — an Interactive Experience, not a card
 * grid: the section's right side is one Spotlight Container that will
 * later coordinate all three cards together on hover (hovered card
 * expands to fill the container, the other two leave the viewport),
 * rather than three independently-hoverable cards. That coordination
 * lives one level down in SpotlightExperience; this component only
 * owns the two-region section layout (static content on the left,
 * the spotlight experience on the right), spacing, and data loading —
 * same division of responsibility as Partners.tsx.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export async function ProofSection() {
  const [header, caseStudies] = await Promise.all([
    getProofHeader(),
    getCaseStudies(),
  ]);

  return (
    <section className={styles.proof}>
      <Container size="2xl">
        <div className={styles.inner}>
          <ProofContent
            heading={header.heading}
            description={header.description}
            cta={header.cta}
          />

          <SpotlightExperience caseStudies={caseStudies} />
        </div>
      </Container>
    </section>
  );
}
