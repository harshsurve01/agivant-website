import type { ReactNode } from "react";
import Image from "next/image";
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
 * the static decorative ellipse stroke — the latter an exported
 * Figma asset (hero-ellipse-stroke.svg), referenced by path rather
 * than redrawn as CSS or inline SVG geometry, so it stays
 * pixel-perfect with the design file. Nothing else lives here —
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

      {/* Decorative design asset, not generated geometry — exported
          directly from Figma. Treated exactly like the ampd-wordmark
          asset in Hero.tsx: referenced by path, not redrawn as CSS or
          SVG markup here, so it stays pixel-perfect with the source
          file and any future re-export just replaces the file on
          disk with zero code changes.
          TODO: drop the real export at /public/images/hero/hero-ellipse-stroke.svg —
          this path doesn't exist yet, same placeholder status as
          ampd-wordmark.svg until the asset is supplied. */}
      <div className={styles.ellipseStroke}>
        <Image
          src="/images/hero/hero-ellipse-stroke.svg"
          alt=""
          fill
          sizes="(min-width: 1024px) 60vw, 90vw"
          className={styles.ellipseStrokeImage}
          aria-hidden="true"
        />
      </div>

      <div className={styles.contentLayer}>{children}</div>
    </div>
  );
}