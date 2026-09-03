import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Cube } from "@/components/ui/Icon/Cube";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import type { FinalCTAProps } from "./types";
import styles from "./FinalCTA.module.css";
import { Gradient } from "@/components/effects/Gradient";

/**
 * FinalCTA (Case Study Section 8 — Final Section)
 *
 * Renders the standalone final CTA block at the end of the Case Study detail page:
 * - Centered heading ("Ready to get your enterprise" in dark, "Amp'd?" in Agivant purple)
 * - Centered description
 * - Primary purple CTA button with Cube icon ("Find your Amp'd score")
 * - Secondary dark CTA button with ArrowUpRight icon ("Talk to an Amp'd specialist")
 *
 * Server Component.
 */
export function FinalCTA({
  heading = "Ready to get your enterprise Amp'd?",
  description,
  primaryCta,
  secondaryCta,
}: FinalCTAProps) {
  // Split heading: "Ready to get your enterprise" black, "Amp'd?" purple
  const headingParts = heading.endsWith("Amp'd?")
    ? {
        rest: heading.slice(0, heading.lastIndexOf("Amp'd?")),
        highlight: "Amp'd?",
      }
    : { rest: heading, highlight: null };

  return (
    <section className={styles.finalCTA}>

  <Gradient
   kind="linear"
        angle="180deg"
        top="10%"
        left="-10%"
        size="29rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.49}
        blur="60px"
      />
      <Container className={styles.container}>
        <h2 className={styles.heading}>
          {headingParts.highlight ? (
            <>
              {headingParts.rest}
              <span className={styles.headingHighlight}>{headingParts.highlight}</span>
            </>
          ) : (
            heading
          )}
        </h2>

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.buttonsGroup}>
          {primaryCta?.enabled && primaryCta.label && (
            <Link
              href={primaryCta.href || "/ampd-score"}
              className={styles.link}
            >
              <Button
                variant="primary"
                size="lg"
                rightIcon={<Cube />}
              >
                {primaryCta.label}
              </Button>
            </Link>
          )}

          {secondaryCta?.enabled && secondaryCta.label && (
            <Link
              href={secondaryCta.href || "/contact"}
              className={styles.link}
            >
              <Button
                variant="dark"
                size="lg"
                rightIcon={<ArrowUpRight />}
              >
                {secondaryCta.label}
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
