import { Container } from "@/components/ui/Container";
import { LifecycleHeader } from "./LifecycleHeader";
import { LifecycleCards } from "./LifecycleCards";
import { LifecycleSummary } from "./LifecycleSummary";
import {
  getLifecycleHeader,
  getLifecycleStages,
  getLifecycleSummary,
} from "@/data/lifecycle";
import { Gradient } from "@/components/effects/Gradient";
import styles from "./Lifecycle.module.css";

/**
 * Lifecycle
 *
 * The "AI-Native Engineering Lifecycle" section:
 * - Eyebrow & Heading
 * - 5-Stage Horizontal Cards (Architect, Build, Tune, Operate, Evolve)
 * - Animated Chevron Connector
 * - Amplify Summary & CTA Button
 */
export async function Lifecycle() {
  const [header, stages, summary] = await Promise.all([
    getLifecycleHeader(),
    getLifecycleStages(),
    getLifecycleSummary(),
  ]);

  return (
    <section className={styles.lifecycle}>
      <Gradient
        top="5%"
         right="30%"
        size="49rem"
        stops={[
          "color-mix(in srgb, #f2dc84ce 70%, transparent) 0%",
          "transparent 65%",
        ]}
        opacity={0.45}
        blur="10px"
      />
      <Gradient
        kind="linear"
        angle="180deg"
        top="40%"
        left="-25%"
        size="32rem"
        stops={["#b31aef 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.2}
        blur="90px"
      />

      <Container>
        <div className={styles.inner}>
          <LifecycleHeader
            eyebrow={header.eyebrow}
            title={header.title}
            description={header.description}
          />

          <LifecycleCards stages={stages} />

          <div className={styles.connector} aria-hidden="true">
            <svg viewBox="0 0 24 30" fill="none" className={styles.connectorIcon}>
              <path
                className={styles.connectorArrow1}
                d="M5 5L12 12L19 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className={styles.connectorArrow2}
                d="M5 13L12 20L19 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className={styles.connectorArrow3}
                d="M5 21L12 28L19 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <LifecycleSummary
            title={summary.title}
            description={summary.description}
            cta={summary.cta}
          />
        </div>
      </Container>
    </section>
  );
}