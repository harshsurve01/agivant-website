import { Container } from "@/components/ui/Container";
import { MetricCard } from "./MetricCard";
import type { Phase1Props } from "./types";
import styles from "./Phase1.module.css";

/**
 * Phase1
 *
 * Renders the Blog Inner page's "Phase 1 — Establishing Baselines"
 * section: eyebrow, two-tone heading, intro copy, then a 2x2 grid of
 * metric cards. Figma: "Phase 1" (2097:1298), "Establishing
 * Baselines" (2097:1284), intro paragraph (2097:1293), and the four
 * card surfaces (2097:1302, 2097:1306, 2097:1304, 2097:1308), all
 * direct children of "Blog Inside page" (node 2097:1214) — same as
 * ExecutiveBrief, this section has no dedicated Figma frame of its
 * own.
 *
 * `title`'s last word is rendered in the brand highlight color, same
 * two-tone pattern ExecutiveBrief already applies to its own
 * heading — kept purely presentational here too, not encoded in the
 * data.
 *
 * Card markup itself lives in MetricCard, reused four times via
 * `cards.map` rather than inlined here, per the task's own guidance.
 *
 * No shared background/particle treatment — Figma shows this section
 * on the same plain background as ExecutiveBrief, so HeroBackground
 * is intentionally not used here either. Reuses the same Container
 * "xl" default already established by Hero and ExecutiveBrief.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no data imports. Every value arrives via props, so this component
 * is already shaped for a future WordPress-sourced article object
 * with zero changes required on this end.
 */
export function Phase1({ eyebrow, title, description, cards }: Phase1Props) {
  const words = title.split(" ");
  const highlighted = words[words.length - 1];
  const rest = words.slice(0, -1).join(" ");

  return (
    <section className={styles.phase1}>
      <Container>
        <p className={styles.eyebrow}>{eyebrow}</p>

        <h2 className={styles.title}>
          {rest ? `${rest} ` : ""}
          <span className={styles.highlight}>{highlighted}</span>
        </h2>

        <p className={styles.description}>{description}</p>

        <div className={styles.grid}>
          {cards.map((card) => (
            <MetricCard key={card.title} card={card} />
          ))}
        </div>
      </Container>
    </section>
  );
}
