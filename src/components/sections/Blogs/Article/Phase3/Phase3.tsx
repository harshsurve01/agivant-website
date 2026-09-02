import { Container } from "@/components/ui/Container";
import { InstrumentationCard } from "./InstrumentationCard";
import type { Phase3Props } from "./types";
import styles from "./Phase3.module.css";

/**
 * Phase3
 *
 * Renders the Blog Inner page's "Phase 3 — End-to-End
 * Instrumentation Strategy" section: eyebrow, two-tone heading,
 * intro copy, then a 2x2 grid of instrumentation cards (Prompt/tool
 * telemetry, Override reasons, User satisfaction, Business KPIs),
 * each pairing a primary black heading+body with a secondary purple
 * heading+body beneath a divider.
 *
 * SOURCE NOTE: the connected Figma MCP tool returned a Starter-plan
 * rate-limit error on every call attempted for this task, same as
 * Phase2 — there are no Figma node IDs to cite anywhere in this
 * section. Built entirely from one PNG screenshot the user exported
 * and shared directly. All spacing/sizing is an ESTIMATE, matched to
 * the closest step on the existing token scale and to Phase1's own
 * card-grid conventions (same grid shape, same card surface
 * treatment) — none of it is a pixel-accurate Figma readout. Flagged
 * throughout Phase3.module.css / InstrumentationCard.module.css for
 * correction once Figma access is restored.
 *
 * Grid layout intentionally mirrors Phase1's 2x2 card grid (same
 * column count, same gap token, same responsive collapse to a single
 * column) since the screenshot shows the same visual arrangement —
 * but the CARD component itself (InstrumentationCard) is new, not
 * MetricCard reused, because the internal card structure differs
 * (see Phase3Card's doc comment). No HeroBackground — screenshot
 * shows a plain background, same as every other Article section
 * after the Hero.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no data imports. Every value arrives via props, so this component
 * is already shaped for a future WordPress-sourced article object
 * with zero changes required on this end.
 */
export function Phase3({ eyebrow, title, description, cards }: Phase3Props) {
  const words = title.split(" ");
  const rest = words.slice(1).join(" ");

  return (
    <section className={styles.phase3}>
      <Container>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}

        <h2 className={styles.title}>
          {words[0]}
          {rest ? " " : ""}
          <span className={styles.highlight}>{rest}</span>
        </h2>

        <p className={styles.description}>{description}</p>

        <div className={styles.grid}>
          {cards.map((card) => (
            <InstrumentationCard key={card.primaryTitle} card={card} />
          ))}
        </div>
      </Container>
    </section>
  );
}
