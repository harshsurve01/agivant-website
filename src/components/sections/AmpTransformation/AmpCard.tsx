import type { AmpCardData } from "@/data/ampTransformation";
import styles from "./AmpCard.module.css";

interface AmpCardProps {
  card: AmpCardData;
  /** Which column this card belongs to. Used only to tag the card's
   *  root element for AmpConnectors to discover via the DOM (see
   *  `data-amp-side` below) — AmpCard has no other awareness of the
   *  connector layer and no layout differs between sides. */
  side: "left" | "right";
}

/**
 * AmpCard
 *
 * Reusable feature card. Responsible only for displaying its own
 * content (`card.title`) — no parent awareness, no knowledge of which
 * column it's in beyond the `data-amp-*` tagging below, no index, no
 * offset. This is what lets AmpColumn render an arbitrary number of
 * these without any card needing to know its own position.
 *
 * `data-amp-card`/`data-amp-side` are read-only markers for
 * AmpConnectors (a sibling elsewhere in AmpExperience's tree) to find
 * this card's DOM rect and draw a path to it — AmpCard has zero
 * imports from, or knowledge of, the connector system itself.
 *
 * Server Component: no "use client", no hooks, no state, no
 * animation, no hover interaction of its own.
 */
export function AmpCard({ card, side }: AmpCardProps) {
  return (
    <div className={styles.card} data-amp-card={card.id} data-amp-side={side}>
      <span className={styles.title}>{card.title}</span>
    </div>
  );
}