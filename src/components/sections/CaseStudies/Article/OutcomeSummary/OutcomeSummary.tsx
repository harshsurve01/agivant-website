import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Cube } from "@/components/ui/Icon/Cube";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import type { OutcomeSummaryProps } from "./types";
import styles from "./OutcomeSummary.module.css";

/**
 * OutcomeSummary (New Case Study Template)
 *
 * Renders the Outcome summary section for the new Case Study template:
 * - Brand-purple section heading ("Outcome")
 * - Intro description copy
 * - Primary purple CTA button ("See the results" + cube icon)
 * - Secondary dark CTA button ("How it works" + diagonal arrow icon)
 */
export function OutcomeSummary({
  title,
  description,
  primaryCta,
  secondaryCta,
}: OutcomeSummaryProps) {
  return (
    <section className={styles.outcomeSummary}>
      <Container className={styles.container}>
        <h2 className={styles.title}>{title}</h2>

        <p className={styles.description}>{description}</p>

        {(primaryCta?.enabled || secondaryCta?.enabled) && (
          <div className={styles.ctaGroup}>
            {primaryCta?.enabled && primaryCta.href && (
              <Link href={primaryCta.href} className={styles.buttonLink}>
                <Button
                  variant="primary"
                  rightIcon={<Cube />}
                >
                  {primaryCta.label}
                </Button>
              </Link>
            )}
            {secondaryCta?.enabled && secondaryCta.href && (
              <Link href={secondaryCta.href} className={styles.buttonLink}>
                <Button
                  variant="dark"
                  rightIcon={<ArrowUpRight  />}
                >
                  {secondaryCta.label}
                </Button>
              </Link>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
