import type { AmpCardData } from "@/data/ampTransformation";
import styles from "./AmpNode.module.css";

interface AmpNodeProps {
  card: AmpCardData;
  /** Which column this node belongs to. Used only to tag the node's
   *  root element for AmpConnectorLayer to discover via the DOM (see
   *  `data-amp-side` below) — AmpNode has no other awareness of the
   *  connector layer and no layout differs between sides. */
  side: "left" | "right";
}

/**
 * AmpNode
 *
 * Reusable feature card — one per entry in a column. Named "Node"
 * rather than "Card" because each one is also a connector endpoint:
 * AmpConnectorLayer draws exactly one path from every AmpNode to
 * AmpCore (see the section spec's "Exactly one path per card" /
 * "The orb is the central node" rules). Responsible only for
 * displaying its own content (`card.title`) — no parent awareness, no
 * knowledge of which column it's in beyond the `data-amp-*` tagging
 * below, no index, no offset. This is what lets AmpColumn render an
 * arbitrary number of these without any node needing to know its own
 * position.
 *
 * `data-amp-node`/`data-amp-side` are read-only markers for
 * AmpConnectorLayer (a sibling elsewhere in AmpExperience's tree) to
 * find this node's DOM rect and draw a path to it — AmpNode has zero
 * imports from, or knowledge of, the connector system itself.
 *
 * Server Component today: no "use client", no hooks, no state. The
 * card-reveal animation (opacity/blur/scale, scroll-driven, staggered
 * — see the section spec's "Cards" behaviour) is owned by
 * AmpExperience's GSAP timeline via a ref/selector on
 * `[data-amp-node]`, not by this component, so AmpNode itself never
 * needs to become a Client Component just to be animated.
 */
export function AmpNode({ card, side }: AmpNodeProps) {
  return (
    <div className={styles.node} data-amp-node={card.id} data-amp-side={side}>
      <span className={styles.title}>{card.title}</span>
    </div>
  );
}
