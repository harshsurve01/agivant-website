import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { PageRibbon } from "@/components/ui/PageRibbon";
import { Gradient } from "@/components/effects/Gradient";
import type { AgenticEngineeringNowProps } from "./types";
import styles from "./AgenticEngineeringNow.module.css";

/**
 * AgenticEngineeringNow (Amp'd landing page, section "Agentic engineering now")
 *
 * Two-column editorial + statistics section:
 * - Left: two-tone heading (first `<br>` line purple, rest black), a large
 *   supporting statement, and a smaller body paragraph.
 * - Right: a 2-column grid of statistic cards. The second column is offset
 *   downward (staggered) and its values render in the warm accent colour;
 *   first-column values are brand purple — a positional presentation rule,
 *   so the data stays plain `metric` blocks.
 * - Optional decorative ribbon behind the section via the shared PageRibbon.
 *
 * Server Component: all content arrives via props; no client state.
 */
export function AgenticEngineeringNow({
  id,
  heading,
  description,
  body,
  metrics,
  ribbon,
  className,
}: AgenticEngineeringNowProps) {
  const [firstLine, ...restLines] = heading
    .split(/<br\s*\/?>/i)
    .map((line) => line.trim());

  return (
    <section id={id} className={clsx(styles.section, className)}>
      <Gradient
        kind="linear"
        angle="180deg"
        top="-10%"
        right="-12%"
        size="30rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.18}
        blur="90px"
      />

      {ribbon?.src && (
        <PageRibbon
          src={ribbon.src}
          width={ribbon.width ?? 1440}
          height={ribbon.height ?? 600}
          className={styles.ribbonWrapper}
          imageClassName={styles.ribbonImage}
          priority={false}
        />
      )}

      <Container size="xl" className={styles.container}>
        <div className={styles.copy}>
          <h2 className={styles.heading}>
            <span className={styles.headingAccent}>{firstLine}</span>
            {restLines.length > 0 && (
              <span className={styles.headingPrimary}>
                {restLines.join(" ")}
              </span>
            )}
          </h2>
          {description && <p className={styles.statement}>{description}</p>}
          {body && <p className={styles.body}>{body}</p>}
        </div>

        <div className={styles.cards}>
          {metrics.map((metric) => (
            <article key={metric.id} className={styles.card}>
              <p className={styles.value}>{metric.value}</p>
              <p className={styles.label}>{metric.label}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
