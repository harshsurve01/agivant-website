import { Container } from "@/components/ui/Container";
import { PageRibbon } from "@/components/ui/PageRibbon";
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

const BLOG_HERO_RIBBON = "/images/blogs/innerpages/hero-ribbon.png";

export function Phase1({
  eyebrow,
  title,
  description,
  cards,
  columns = 2,
  ribbonSrc,
  closingParagraph,
  highlightPosition = "start",
  highlightCount = 1,
  highlightStartIndex,
}: Phase1Props) {
  const words = title.split(" ");
  const effectiveRibbon =
    ribbonSrc === undefined ? BLOG_HERO_RIBBON : ribbonSrc;

  let lead = "";
  let highlighted = "";
  let tail = "";

  if (highlightPosition === "quotes") {
    const quoteMatch = title.match(/^(.*?)(["“][^"”]+["”])(.*)$/);
    if (quoteMatch) {
      lead = quoteMatch[1].trimEnd();
      highlighted = quoteMatch[2].trim();
      tail = quoteMatch[3].trimStart();
    } else {
      lead = "";
      highlighted = words.slice(0, highlightCount).join(" ");
      tail = words.slice(highlightCount).join(" ");
    }
  } else if (highlightPosition === "middle") {
    const start =
      highlightStartIndex ?? (title.match(/["“]/) ? undefined : 1);
    if (start !== undefined) {
      lead = words.slice(0, start).join(" ");
      highlighted = words.slice(start, start + highlightCount).join(" ");
      tail = words.slice(start + highlightCount).join(" ");
    } else {
      const quoteMatch = title.match(/^(.*?)(["“][^"”]+["”])(.*)$/);
      if (quoteMatch) {
        lead = quoteMatch[1].trimEnd();
        highlighted = quoteMatch[2].trim();
        tail = quoteMatch[3].trimStart();
      } else {
        lead = words.slice(0, 1).join(" ");
        highlighted = words.slice(1, 1 + highlightCount).join(" ");
        tail = words.slice(1 + highlightCount).join(" ");
      }
    }
  } else if (highlightPosition === "end") {
    lead = words.slice(0, -highlightCount).join(" ");
    highlighted = words.slice(-highlightCount).join(" ");
    tail = "";
  } else {
    // "start" or default
    lead = "";
    highlighted = words.slice(0, highlightCount).join(" ");
    tail = words.slice(highlightCount).join(" ");
  }

  const gridClass = columns === 3 ? styles.gridCols3 : styles.grid;

  return (
    
    <section className={styles.phase1}>
      {effectiveRibbon && (
        <PageRibbon
          src={effectiveRibbon}
          width={1440}
          height={395}
          className={styles.ribbonWrapper}
          imageClassName={styles.ribbonImage}
        />
      )}

      <Container className={styles.container}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}

        <h2 className={styles.title}>
          {lead ? `${lead} ` : ""}
          <span className={styles.highlight}>{highlighted}</span>
          {tail ? ` ${tail}` : ""}
        </h2>

        {description && <p className={styles.description}>{description}</p>}

        <div className={gridClass}>
          {cards.map((card) => (
            <MetricCard key={card.title} card={card} />
          ))}
        </div>

        {closingParagraph && (
          <p className={styles.closingParagraph}>{closingParagraph}</p>
        )}
      </Container>
    </section>
  );
}
