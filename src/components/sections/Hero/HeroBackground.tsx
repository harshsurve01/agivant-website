import type { ReactNode } from "react";
import styles from "./HeroBackground.module.css";

export interface HeroBackgroundProps {
  /** Hero's existing, untouched content — rendered on top of both
   * decorative layers below, unaffected by either of them. */
  children: ReactNode;
}

/**
 * HeroBackground
 *
 * Sprint 1 of the Hero Experience: the two breathing ambient glows and
 * the static decorative ellipse stroke. Nothing else lives here —
 * no particles (HeroParticles, Sprint 2), no headline motion
 * (HeroHeadlineExperience / HeroRotatingPhrase, Sprints 3–4), no
 * orchestrating timeline (Hero Timeline, Sprint 5 — architecture only
 * for now). Each of those is deliberately its own future file, per
 * the approved chain:
 *
 *   Hero → HeroBackground → HeroParticles → HeroHeadlineExperience
 *        → HeroRotatingPhrase → Hero Timeline
 *
 * This component fills only the first link. It renders `children` —
 * today, Hero's existing content, completely unmodified — inside a
 * `.contentLayer` that simply sits above the two decorative layers by
 * z-index. When HeroParticles lands in Sprint 2, it nests here between
 * the glows and `children`, per the spec's layer order (Background
 * Glow → Particles → Hero Content); this file's job doesn't change,
 * it just gains one more layer in the middle.
 *
 * Server Component: both layers here are pure CSS (absolute
 * positioning + a keyframe animation) — no client boundary is needed
 * yet. That only becomes necessary once HeroParticles is nested
 * inside; at that point it — not this file — becomes the client leaf,
 * the same Server/Client split already used by Button/ButtonMotion.
 */
export function HeroBackground({ children }: HeroBackgroundProps) {
  return (
    <div className={styles.experience}>
      <div className={styles.glowLeft} aria-hidden="true" />
      <div className={styles.glowRight} aria-hidden="true" />

      {/* TODO(figma): exact ellipse position/radius/stroke-width.
          Placeholder geometry below approximates the legacy hero.css
          .hero__curve reference (lower-right, ~620x360) until the
          real spec lands — same "measured off the last known-good
          reference, flagged for a follow-up swap" approach already
          used elsewhere in Hero.module.css. Static this sprint per
          spec; the Hero Timeline (Sprint 5) animates it later. */}
      <svg
        className={styles.ellipseStroke}
        viewBox="0 0 620 360"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <ellipse
          cx="310"
          cy="180"
          rx="300"
          ry="160"
          stroke="var(--color-border-strong)"
          strokeWidth="1.5"
        />
      </svg>

      <div className={styles.contentLayer}>{children}</div>
    </div>
  );
}
