import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Gradient } from "@/components/effects/Gradient";
import { StatsCard } from "./StatsCard";
import type { RunningTodayProps } from "./types";
import styles from "./RunningToday.module.css";

const HIGHLIGHT_PHRASE = "Running Today,";

/**
 * RunningToday
 *
 * Section 2 of the Services Landing Page: "Running Today, Across Enterprises".
 * Renders:
 * - Centered section title with purple accent for "Running Today," and black for "Across Enterprises"
 * - Centered supporting description: "Agent-led work already in production, measured and accountable."
 * - 3x2 responsive card grid of statistics
 * - Subtle lavender tint on the final milestone card ("Every 5 days")
 *
 * GRADIENT: Two ambient glows portaled into the shared GradientLayer canvas.
 * Position/size/opacity can be tuned here without touching the section layout.
 *
 * Server Component: all data arrives via props; no client state.
 */
export function RunningToday({
  heading,
  description,
  metrics,
  className,
  tintLastCard = true,
}: RunningTodayProps) {
  const renderHeading = (text: string) => {
    if (text.includes(HIGHLIGHT_PHRASE)) {
      const parts = text.split(HIGHLIGHT_PHRASE);
      return (
        <>
          {parts[0]}
          <span className={styles.highlight}>{HIGHLIGHT_PHRASE}</span>
          {parts.slice(1).join(HIGHLIGHT_PHRASE)}
        </>
      );
    }
    return text;
  };

  return (
    <section className={clsx(styles.section, className)}>
      {/* ── Services ambient gradients (tune position/size/opacity here) ── */}
      <Gradient
        top="5%"
        right="30%"
        size="42rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 65%",
        ]}
        opacity={0.64}
        blur="80px"
      />
      <Gradient
        kind="linear"
        angle="180deg"
        top="35%"
        left="-8%"
        size="30rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.28}
        blur="90px"
      />

      <Container size="xl">
        <div className={styles.header}>
          <h2 className={styles.heading}>{renderHeading(heading)}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        <div className={styles.grid}>
          {metrics.map((metric, index) => {
            const isLast = tintLastCard && index === metrics.length - 1;
            return (
              <StatsCard
                key={metric.id}
                value={metric.value}
                label={metric.label}
                isTinted={isLast}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
