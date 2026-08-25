import { Container } from "@/components/ui/Container";
import { PartnerCard } from "./PartnerCard";
import styles from "./Ecosystem.module.css";
import type { EcosystemSectionProps } from "./types";
import { Gradient } from "@/components/effects/Gradient";

/**
 * Ecosystem (Partners / Our Partners Page)
 *
 * Renders the "Explore the ecosystem" section:
 * - Section header with 36px purple heading and 18px description
 * - Responsive 4-column grid of interactive PartnerCard components
 * - Clean overlap with the bottom of the Partners Hero section
 *
 * Server Component: layout and composition only.
 * Interactive pointer-origin hover behavior is delegated to the PartnerCard client leaves.
 */
export function Ecosystem({
  heading,
  description,
  partners,
}: EcosystemSectionProps) {
  return (
    <section className={styles.ecosystem} aria-labelledby="ecosystem-heading">
            <Gradient
        top="-5%"
        left="-25%"
        size="42rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
         <Gradient
        kind="linear"
        angle="180deg"
        top="10%"
        right="25%"
        size="45rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
      <Container>
        <div className={styles.header}>
          <h2 id="ecosystem-heading" className={styles.heading}>
            {heading}
          </h2>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.grid}>
          {partners.map((partner) => (
            <PartnerCard key={partner.slug} partner={partner} />
          ))}
        </div>
      </Container>
    </section>
  );
}
