import { Container } from "@/components/ui/Container";
import { Gradient } from "@/components/effects/Gradient";
import { AmpdStep } from "./AmpdStep";
import type { HowYourEnterpriseGetsAmpdSectionData } from "@/data/services";
import styles from "./HowYourEnterpriseGetsAmpd.module.css";

export interface HowYourEnterpriseGetsAmpdProps {
  data: HowYourEnterpriseGetsAmpdSectionData;
}

/**
 * HowYourEnterpriseGetsAmpd
 *
 * Section 4 of the Services Landing Page:
 * - Left-aligned heading: "How your " (black) + "enterprise gets Amp'd" (purple)
 * - Supporting description: "Four moves, whichever pillar the work starts in."
 * - 5 vertical step rows with number circles, purple titles, dark descriptions,
 *   and thin purple horizontal dividers between each step (no divider below step 5).
 *
 * GRADIENT: Two ambient glows portaled into the shared GradientLayer canvas.
 * Position/size/opacity can be tuned here without touching the section layout.
 */
export function HowYourEnterpriseGetsAmpd({ data }: HowYourEnterpriseGetsAmpdProps) {
  const highlightText = "enterprise gets Amp'd";
  const hasHighlight = data.heading.includes(highlightText);
  const prefix = hasHighlight ? data.heading.replace(highlightText, "") : data.heading;

  return (
    <section
      className={styles.section}
      aria-label="How your enterprise gets Amp'd"
    >
      {/* ── Services ambient gradients (tune position/size/opacity here) ── */}
      <Gradient
        top="15%"
        right="20%"
        size="40rem"
        stops={[
          "color-mix(in srgb, #9d84f2 85%, transparent) 0%",
          "transparent 78%",
        ]}
        opacity={0.4}
        blur="85px"
      />
      <Gradient
        kind="linear"
        angle="180deg"
        top="70%"
        left="-15%"
        size="28rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.5}
        blur="75px"
      />

      <Container size="xl">
        <div className={styles.inner}>
          <header className={styles.header}>
            <h2 className={styles.heading}>
              {prefix}
              {hasHighlight && (
                <span className={styles.highlight}>{highlightText}</span>
              )}
            </h2>

            {data.description && (
              <p className={styles.description}>{data.description}</p>
            )}
          </header>

          <ol className={styles.stepList}>
            {data.steps.map((step) => (
              <AmpdStep key={step.id} step={step} />
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
