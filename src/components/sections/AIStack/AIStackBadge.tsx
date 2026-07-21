import styles from "./AIStackBadge.module.css";

interface AIStackBadgeProps {
  label: string;
}

/**
 * AIStackBadge
 *
 * A small reusable pill for a card's category (e.g. "Agentic",
 * "AI / ML"). Kept as its own component rather than inlined in
 * AIStackCard for the same reason as LifecycleStatus: it's a generic
 * label pattern with nothing accordion- or card-specific about its
 * markup, so it's reusable wherever else a category pill is needed.
 */
export function AIStackBadge({ label }: AIStackBadgeProps) {
  return <span className={styles.badge}>{label}</span>;
}
