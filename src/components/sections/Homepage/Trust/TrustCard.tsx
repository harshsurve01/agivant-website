import type { CSSProperties } from "react";
import { TrustBadge } from "./TrustBadge";
import styles from "./TrustCard.module.css";

interface TrustCardProps {
  title: string;
  description: string;
  badge: string;
  accentColor: string;
}

/**
 * TrustCard
 *
 * Renders one card's title, description, and badge. Owns presentation
 * only — no transforms, no perspective, no opacity logic, no scroll
 * logic. accentColor is applied as a CSS custom property so TrustBadge
 * and the title can theme themselves without TrustCard reaching into
 * either of their stylesheets.
 */
export function TrustCard({ title, description, badge, accentColor }: TrustCardProps) {
  // Text/badge tinting is intentionally uniform across every card now —
  // it no longer reads each card's individual accentColor. accentColor
  // is still passed through (Trust.tsx also forwards it to
  // TrustAnimation, which uses it for the ambient scroll glow behind
  // the whole stack — a separate visual from this card's own text) and
  // is kept here as a data attribute rather than dropped from the
  // component's contract.
  const accentStyle = { "--trust-accent": "var(--color-purple-500)" } as CSSProperties;

  return (
    <article className={styles.card} style={accentStyle} data-accent={accentColor}>
      <div className={styles.badgeSlot}>
        <TrustBadge label={badge} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </article>
  );
}