import styles from "./FooterCopyright.module.css";

export interface FooterCopyrightProps {
  /** Copyright text to display. */
  text: string;
}

/**
 * FooterCopyright
 *
 * Owns the copyright line — the bottom-center visual zone. Deliberately
 * a small, single-purpose component: one piece of text with no logic,
 * kept separate from FooterBrandmark/FooterNavigation so each visual
 * zone maps 1:1 to a component, matching this project's component
 * philosophy elsewhere (Environment, Partners, Proof).
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function FooterCopyright({ text }: FooterCopyrightProps) {
  return (
    <div className={styles.copyright}>
      <small className={styles.text}>{text}</small>
    </div>
  );
}
