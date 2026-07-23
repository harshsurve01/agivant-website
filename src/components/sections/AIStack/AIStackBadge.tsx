import styles from "./AIStackBadge.module.css";

interface AIStackBadgeProps {
  label: string;
}

/**
 * AIStackBadge
 *
 * A small reusable pill for a card's category (e.g. "Agentic",
 * "AI / ML"). Rendered by AIStackCardShell, not by any layout — every
 * Figma card places and styles its badge identically, so it's shared
 * chrome rather than something each layout composes for itself. Kept
 * as its own component rather than inlined in the shell for the same
 * reason as LifecycleStatus: it's a generic label pattern with
 * nothing shell-specific about its markup, so it's reusable wherever
 * else a category pill is needed.
 */
export function AIStackBadge({ label }: AIStackBadgeProps) {
  return <span className={styles.badge}>{label}</span>;
}
