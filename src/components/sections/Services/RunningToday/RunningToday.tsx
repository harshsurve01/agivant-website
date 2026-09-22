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
 * Reusable stats section used on:
 * 1. Services Landing Page: "Running Today, Across Enterprises" (3x2 6-metric grid)
 * 2. Service Inner Pages: Dedicated 4-metric grid with optional tags and intro paragraph
 *
 * GRADIENT: Two ambient glows portaled into the shared GradientLayer canvas.
 * Server Component: all data arrives via props; no client state.
 */
export function RunningToday({
  heading,
  description,
  metrics,
  tags,
  columns = "auto",
  className,
  tintLastCard,
}: RunningTodayProps) {
  const isFourColumns =
    columns === 4 || (columns === "auto" && metrics.length === 4);
  const shouldTint =
    tintLastCard !== undefined
      ? tintLastCard
      : !isFourColumns; // Default: true for 6 cards (landing), false for 4 cards (inner pages)

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
        {(heading || description) && (
          <div className={styles.header}>
            {heading && (
              <h2 className={styles.heading}>{renderHeading(heading)}</h2>
            )}
            {description && (
              <p
                className={clsx(
                  styles.description,
                  !heading && styles.introOnly
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}

        <div
          className={clsx(
            styles.grid,
            isFourColumns && styles.gridColumns4
          )}
        >
          {metrics.map((metric, index) => {
            const isLast = shouldTint && index === metrics.length - 1;
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

        {tags && tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
