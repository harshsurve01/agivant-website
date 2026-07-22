// Partners.tsx
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PartnersHeader } from "./PartnersHeader";
import { PartnerLogoStrip } from "./PartnerLogoStrip";
import {
  getPartnersHeader,
  getPartnerLogoPairs,
  getPartnersCTA,
} from "@/data/partners";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import styles from "./Partners.module.css";

/**
 * Partners
 *
 * "Agivant Is Trusted By Global Partners" — a Showcase Section.
 * Feeds PartnerLogoStrip with 4 fixed logo pairs (getPartnerLogoPairs)
 * — one pair per slot, each pair owned entirely by its own LogoShift
 * instance. All per-slot animation lives inside
 * PartnerLogoStrip/LogoShift; this component still has no
 * "use client", no hooks, no state.
 *
 * Server Component: owns section layout, the CTA, and data loading —
 * not the strip's internal layout or animation.
 */
export async function Partners() {
  const [header, pairs, cta] = await Promise.all([
    getPartnersHeader(),
    getPartnerLogoPairs(),
    getPartnersCTA(),
  ]);

  return (
    <section className={styles.partners}>
      <Container>
        <div className={styles.inner}>
          <PartnersHeader heading={header.heading} description={header.description} />

          <PartnerLogoStrip pairs={pairs} />

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