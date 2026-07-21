import { LifecycleStatus } from "./LifecycleStatus";
import type { LifecycleStage } from "@/data/lifecycle";
import styles from "./LifecycleItem.module.css";

interface LifecycleItemProps {
  stage: LifecycleStage;
  isOpen: boolean;
  onSelect: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

/**
 * LifecycleItem
 *
 * Presentation only — no useState, no useReducer, no local notion of
 * "open." It renders `stage` and reflects whatever `isOpen` it's
 * given, and forwards select/hover events straight up to
 * LifecycleAccordion, which is the single source of truth for which
 * stage is open. That keeps this component reusable and easy to
 * reason about (its output is a pure function of its props), and
 * makes "only one item open" a property of the parent's state rather
 * than something every row has to cooperate to maintain.
 *
 * Doesn't need its own "use client" directive: it's only ever
 * imported by LifecycleAccordion (a Client Component), so it's
 * already part of that client bundle. Adding the directive here would
 * be redundant, not incorrect — but leaving it off is the signal that
 * this file itself introduces no interactivity of its own.
 *
 * Accessibility: a real <button> drives the toggle, so Enter/Space
 * activation is native — no keyboard handler needed. aria-expanded
 * reflects isOpen, aria-controls points at the matching panel id, and
 * the panel itself carries role="region" + aria-labelledby back to the
 * button, which is the standard WAI-ARIA accordion pattern.
 *
 * The chevron is a static glyph only (per spec: no animated chevron in
 * this pass) — it swaps between two fixed paths based on isOpen rather
 * than rotating. A later pass can replace this with a shared, animated
 * Chevron UI component without any markup here needing to change.
 */
export function LifecycleItem({
  stage,
  isOpen,
  onSelect,
  onHoverStart,
  onHoverEnd,
}: LifecycleItemProps) {
  const panelId = `lifecycle-panel-${stage.id}`;
  const buttonId = `lifecycle-trigger-${stage.id}`;

  return (
    <div
      className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <h3 className={styles.itemHeading}>
        <button
          id={buttonId}
          type="button"
          className={styles.trigger}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onSelect}
        >
          <span className={styles.title}>{stage.title}</span>
        </button>
      </h3>

      {/* Only shown while open — per Figma, the pill belongs to the
          expanded card, not the collapsed row. Gating on isOpen (not
          just stage.status) matters now that every stage carries a
          status: without it, all four collapsed rows would show the
          pill crowded next to the chevron, which is exactly the bug
          this condition prevents. */}
      {isOpen && stage.status ? (
        <span className={styles.statusSlot}>
          <LifecycleStatus label={stage.status} />
        </span>
      ) : null}

      <svg
        className={styles.chevron}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={isOpen ? "M4 10L8 6L12 10" : "M4 6L8 10L12 6"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={styles.panel}
        hidden={!isOpen}
      >
        <p className={styles.description}>{stage.description}</p>
      </div>
    </div>
  );
}