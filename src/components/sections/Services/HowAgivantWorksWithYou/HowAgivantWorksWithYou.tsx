import { Container } from "@/components/ui/Container";
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
