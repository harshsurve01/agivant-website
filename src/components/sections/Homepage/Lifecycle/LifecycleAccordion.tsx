"use client";

import { useState } from "react";
import { LifecycleItem } from "./LifecycleItem";
import type { LifecycleStage } from "@/data/lifecycle";
import styles from "./LifecycleAccordion.module.css";

interface LifecycleAccordionProps {
  stages: LifecycleStage[];
}

/**
 * LifecycleAccordion
 *
 * The only Client Component in this section. It owns a single piece
 * of state — which stage is "selected" (click-confirmed) — plus a
 * transient "hovered" value that previews a stage without changing the
 * selection. Every LifecycleItem is fully controlled from here: it
 * receives isOpen and a handful of callbacks, and renders based on
 * those alone.
 *
 * Why the state lives here and not in each LifecycleItem: "only one
 * item may be open at a time" is a constraint on the *set* of items,
 * not on any single item. If each row tracked its own open/closed
 * state, keeping that invariant would mean every row reaching into
 * its siblings to close them — effectively re-implementing this same
 * shared state in a more fragile way. A single controlled value
 * (openId) makes "only one open" true by construction: there is
 * exactly one id it can equal.
 *
 * Why hover and click are separate pieces of state rather than one:
 * hover is supposed to be a temporary preview that reverts on mouse
 * leave, while click is a durable choice that persists after the
 * mouse moves away. Collapsing them into one value would lose the
 * "return to selection" behavior on mouse leave.
 */
export function LifecycleAccordion({ stages }: LifecycleAccordionProps) {
  const defaultStage = stages.find((stage) => stage.isDefaultOpen) ?? stages[0];

  const [selectedId, setSelectedId] = useState<string | undefined>(defaultStage?.id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Hover previews a stage; leaving the row always falls back to
  // whatever is currently selected — never to nothing open.
  const openId = hoveredId ?? selectedId;

  return (
    <div className={styles.accordion}>
      {stages.map((stage) => (
        <LifecycleItem
          key={stage.id}
          stage={stage}
          isOpen={stage.id === openId}
          onSelect={() => setSelectedId(stage.id)}
          onHoverStart={() => setHoveredId(stage.id)}
          onHoverEnd={() => setHoveredId(null)}
        />
      ))}
    </div>
  );
}
