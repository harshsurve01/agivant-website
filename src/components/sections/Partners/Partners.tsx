import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PartnersHeader } from "./PartnersHeader";
import { PartnerLogoStrip } from "./PartnerLogoStrip";
import {
  getPartnersHeader,
  getPartnerLogoSlots,
  getPartnersCTA,
} from "@/data/partners";
// TODO: confirm the actual arrow/external-link icon component this
// project already exports (Environment used Icon/Cube for its CTA —
// this section's Figma shows a ↗ arrow instead, which may already
// exist under @/components/ui/Icon).
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import styles from "./Partners.module.css";

/**
 * Partners
 *
 * "Agivant Is Trusted By Global Partners" — a Showcase Section, not an
 * Interactive Experience. Nothing here is driven by shared state or
 * external interaction: heading, logo strip, and CTA are three
 * independent, static pieces. The only future motion — each slot's
 * own logo fading up while the next rises in — is self-contained
 * inside a single slot (see PartnerLogoShift) and never needs to
 * coordinate with sibling slots or a parent's state, unlike
 * Environment's Timeline/Card pair. That's why this stays a plain
 * Server Component composition, the same shape as Hero and AIStack.
 *
 * Server Component: no "use client", no hooks, no state. Owns section
 * layout, composition, spacing, the CTA, and data loading — not the
 * strip's internal layout (PartnerLogoStrip) or any slot's future
 * animation (PartnerLogoShift).
 */
export async function Partners() {
  const [header, slots, cta] = await Promise.all([
    getPartnersHeader(),
    getPartnerLogoSlots(),
    getPartnersCTA(),
  ]);

  return (
    <section className={styles.partners}>
      <Container>
        <div className={styles.inner}>
          <PartnersHeader heading={header.heading} description={header.description} />

          <PartnerLogoStrip slots={slots} />

          <Link href={cta.href}>
            <Button variant="primary" size="lg" rightIcon={<ArrowUpRight />}>
              {cta.label}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
