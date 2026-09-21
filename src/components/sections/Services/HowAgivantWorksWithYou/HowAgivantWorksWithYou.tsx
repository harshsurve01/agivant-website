import { Container } from "@/components/ui/Container";
import { Gradient } from "@/components/effects/Gradient";
import { LifecycleCards } from "@/components/sections/Homepage/Lifecycle/LifecycleCards";
import type { HowAgivantWorksWithYouData } from "@/data/services";
import styles from "./HowAgivantWorksWithYou.module.css";

export interface HowAgivantWorksWithYouProps {
  data: HowAgivantWorksWithYouData;
}

/**
 * HowAgivantWorksWithYou
 *
 * Section 3 of the Services Landing Page:
 * - Two-part heading ("How Agivant " + "Works With You" in purple)
 * - 2-paragraph supporting copy
 * - Reuses the Homepage Lifecycle card carousel/system
 * - Card 1 ("Cloud & Platform Engineering") active by default
 * - Numbered pagination indicator (① --- 2 --- 3 --- 4 --- 5)
 *
 * GRADIENT: Two ambient glows portaled into the shared GradientLayer canvas.
 * Position/size/opacity can be tuned here without touching the section layout.
 */
export function HowAgivantWorksWithYou({ data }: HowAgivantWorksWithYouProps) {
  const targetHighlight = "Works With You";
  const hasHighlight = data.heading.includes(targetHighlight);
  const prefix = hasHighlight ? data.heading.replace(targetHighlight, "") : data.heading;

  const paragraphs = data.description
    ? data.description.split("\n").map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <section className={styles.section} aria-label="How Agivant Works With You">
      {/* ── Services ambient gradients (tune position/size/opacity here) ── */}
      <Gradient
        top="10%"
        right="20%"
        size="45rem"
        stops={["#8500df 50%", "#edbf79 85%", "transparent 100%"]}
        opacity={0.12}
        blur="80px"
      />
      <Gradient
        kind="linear"
        angle="180deg"
        top="60%"
        left="-18%"
        size="32rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />

      <Container size="xl">
        <div className={styles.inner}>
          <header className={styles.header}>
            <h2 className={styles.heading}>
              {prefix}
              {hasHighlight && (
                <span className={styles.highlight}>{targetHighlight}</span>
              )}
            </h2>

            {paragraphs.length > 0 && (
              <p className={styles.lead}>{paragraphs[0]}</p>
            )}
            {paragraphs.length > 1 && (
              <p className={styles.subtext}>{paragraphs[1]}</p>
            )}
          </header>

          <div className={styles.cardsContainer}>
            <LifecycleCards
              stages={data.stages}
              initialActiveIndex={0}
              enableModal={false}
              indicatorVariant="numbered"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
