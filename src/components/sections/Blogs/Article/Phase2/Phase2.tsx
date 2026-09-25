import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { ExperimentItem } from "./ExperimentItem";
import type { Phase2Props } from "./types";
import styles from "./Phase2.module.css";

/**
 * Phase2
 *
 * Renders the Blog Inner page's "Phase 2 — Running Proper
 * Experiments" section: eyebrow, two-tone heading, intro copy, then
 * a numbered list of five experiment-design items (Diff-in-Diff,
 * Power Analysis, Avoiding Novelty and Selection Bias, Include
 * Washout Periods, A/B Testing), each with a divider beneath it
 * except the last.
 *
 * SOURCE NOTE: the connected Figma MCP tool (get_metadata /
 * get_design_context) returned a Starter-plan rate-limit error for
 * every call attempted against this file, so this section was NOT
 * built from live Figma node data the way Hero/ExecutiveBrief/Phase1
 * were — there are no node IDs to cite here. It was built from three
 * PNG screenshots of the section the user exported and shared
 * directly. All spacing/sizing below is an ESTIMATE, chosen by
 * matching the closest step on the existing token scale (the same
 * scale Phase1 and ExecutiveBrief measure against) and eyeballing
 * proportions in the screenshots — none of it is a pixel-accurate
 * Figma readout. The user has confirmed this is acceptable for now
 * and will correct exact sizing later once Figma access is restored.
 *
 * Layout/pattern is otherwise deliberately kept identical to Phase1:
 * same eyebrow/title/description header, same last-section-owns-its-
 * background approach (no HeroBackground — screenshots show a plain
 * background here too), same Container "xl" default, same two-tone
 * heading treatment (see Phase2Props.title doc comment for how the
 * split point differs from Phase1's).
 *
 * Item markup lives in ExperimentItem, reused five times via
 * `items.map`, same reasoning Phase1 already applied to MetricCard.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no data imports. Every value arrives via props, so this component
 * is already shaped for a future WordPress-sourced article object
 * with zero changes required on this end.
 */
export function Phase2({
  id,
  eyebrow,
  title,
  description,
  items,
  highlightPosition,
  highlightCount,
  dividerVariant,
}: Phase2Props) {
  const renderHeading = () => {
    const headingClassName = clsx(
      styles.title,
      !description && styles.titleWithoutDesc
    );

    if (
      highlightPosition === "colon" ||
      (!highlightPosition && title.includes(":"))
    ) {
      const colonIdx = title.indexOf(":");
      if (colonIdx !== -1) {
        const highlighted = title.slice(0, colonIdx + 1);
        const plain = title.slice(colonIdx + 1);
        return (
          <h2 className={headingClassName}>
            <span className={styles.highlight}>{highlighted}</span>
            {plain}
          </h2>
        );
      }
    }

    const words = title.split(" ");

    if (highlightPosition === "start") {
      const count = Math.min(highlightCount ?? 1, words.length);
      const highlighted = words.slice(0, count).join(" ");
      const rest = words.slice(count).join(" ");
      return (
        <h2 className={headingClassName}>
          <span className={styles.highlight}>{highlighted}</span>
          {rest ? ` ${rest}` : ""}
        </h2>
      );
    }

    if (highlightPosition === "end") {
      const count = Math.min(highlightCount ?? 1, words.length);
      const prefix = words.slice(0, -count).join(" ");
      const highlighted = words.slice(-count).join(" ");
      return (
        <h2 className={headingClassName}>
          {prefix ? `${prefix} ` : ""}
          <span className={styles.highlight}>{highlighted}</span>
        </h2>
      );
    }

    // Default: first word plain, rest highlighted (Blog 1 backwards-compatible behavior)
    const rest = words.slice(1).join(" ");
    return (
      <h2 className={headingClassName}>
        {words[0]}
        {rest ? " " : ""}
        <span className={styles.highlight}>{rest}</span>
      </h2>
    );
  };

  return (
    <section id={id} className={styles.phase2}>
      <Container>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        {renderHeading()}
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}

        <div className={styles.list}>
          {items.map((item, index) => (
            <ExperimentItem
              key={item.index}
              item={item}
              showDivider={index < items.length - 1}
              dividerVariant={dividerVariant}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
