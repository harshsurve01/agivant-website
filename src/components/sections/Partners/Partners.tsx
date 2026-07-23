// Partners.tsx
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PartnersHeader } from "./PartnersHeader";
import { PartnerLogoStrip, type PartnerLogoSlotTiming } from "./PartnerLogoStrip";
import {
  getPartnersHeader,
  getPartnerLogoPairs,
  getPartnersCTA,
} from "@/data/partners";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import styles from "./Partners.module.css";

// Each slot's own hold time, indexed 1:1 with the pairs returned by
// getPartnerLogoPairs(). This is the "dedicated timer per slot": slot
// 0 shifts every 2.2s, slot 1 every 3.4s, etc. — independent cadences
// rather than one shared interval. TODO(figma/content): move this to
// data/partners.ts alongside the pairs once per-partner timing is
// confirmed with design, rather than hardcoding it here.
const PARTNER_SLOT_TIMINGS: PartnerLogoSlotTiming[] = [
  { holdMs: 3400 },
  { holdMs: 2200 },
  { holdMs: 2800 },
  { holdMs: 4000 },
];

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

          <PartnerLogoStrip pairs={pairs} slotTimings={PARTNER_SLOT_TIMINGS} />

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