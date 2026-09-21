import clsx from "clsx";
import type { Phase1Card } from "./types";
import styles from "./MetricCard.module.css";

export interface MetricCardProps {
  card: Phase1Card;
  /** Whether the card should expand to full width of container (e.g. single-column layout). */
  fullWidth?: boolean;
}

/**
 * MetricCard
 *
 * Renders one metric card: title, body copy, a divider, then one or
 * more "Case Reference" entries. Figma shows this exact shape
 * repeated four times in the Phase 1 grid (2097:1302, 2097:1306,
 * 2097:1304, 2097:1308) — pulled out as its own component, per the
 * task instructions, instead of inlining the markup four times in
 * Phase1.tsx.
 *
 * A single divider renders once above the reference list regardless
 * of whether there's one reference or two ("Rework Required" in the
 * mock content has two, "Case Reference A"/"Case Reference B",
 * stacked directly beneath one shared divider — confirmed against
 * Figma's node layout, which has no second divider between them).
 *
 * Server Component: no "use client", no hooks, no state, no data
 * imports. Every value arrives via props.
 */
export function MetricCard({ card, fullWidth }: MetricCardProps) {
  const hasReferences = Array.isArray(card.references) && card.references.length > 0;
  const paragraphs = card.description
    ? card.description.split(/\n\s*\n/).filter(Boolean)
    : [];

  return (
    <article className={clsx(styles.card, fullWidth && styles.fullWidth)}>
      <h3 className={styles.title}>{card.title}</h3>
      {paragraphs.length > 0 ? (
        paragraphs.map((paragraph, idx) => (
          <p key={idx} className={styles.description}>
            {paragraph}
          </p>
        ))
      ) : (
        <p className={styles.description}>{card.description}</p>
      )}

      {hasReferences && (
        <>
          <hr className={styles.divider} aria-hidden="true" />

          <div className={styles.references}>
            {card.references?.map((reference) => (
              <div key={reference.label} className={styles.reference}>
                <p className={styles.referenceLabel}>{reference.label}</p>
                <p className={styles.referenceText}>{reference.text}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
