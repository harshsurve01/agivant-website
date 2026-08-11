import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./HeroBackground.module.css";
import { HeroParticleField } from "./HeroParticleField";
import { Gradient } from "@/components/effects/Gradient";

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
 * pixel-perfect with the design file.
 *
 * Sprint 2 (interactive particle field) has now landed as
 * HeroParticleField, nested here between the glows and `children` per
 * the spec's layer order (Background Glow → Particles → Hero
 * Content). Still no headline motion (HeroHeadlineExperience /
 * HeroRotatingPhrase, Sprints 3–4) and no orchestrating timeline
 * (Hero Timeline, Sprint 5 — architecture only for now). Each of
 * those remains its own future file, per the approved chain:
 *
 *   Hero → HeroBackground → HeroParticleField → HeroHeadlineExperience
 *        → HeroRotatingPhrase → Hero Timeline
 *
 * This component renders `children` — Hero's existing content,
 * completely unmodified — inside a `.contentLayer` that sits above
 * all decorative layers by z-index.
 *
 * Server Component, still: the glows and ellipse stroke are pure CSS/
 * markup, and HeroParticleField is a self-contained Client Component
 * leaf (its own canvas, its own pointer listeners, its own rAF loop —
 * see HeroParticleField.tsx). Nesting a Client Component inside a
 * Server Component doesn't require the parent to become a client
 * boundary itself, so this file stays async-Server-safe exactly as
 * before — the same Server/Client split already used by
 * Button/ButtonMotion, just applied one level up the tree than
 * originally anticipated.
 */
export function HeroBackground() {
  return (
    <div className={styles.experience}>
      <Gradient
        top="-18%"
        left="-16%"
        size="clamp(340px, 34vw, 600px)"
        stops={[
          "color-mix(in srgb, var(--color-bg-gradient-start) 85%, transparent) 0%",
          "transparent 38%",
        ]}
        opacity={1}
        blur="60px"
        blurMobile="60px"
        animate="breathe"
      />
       <Gradient
        top="0%"
        right="70%"
        size="25rem"
        stops={["#8500df 50%", "#edbf79 85%", "transparent 100%"]}
        opacity={0.125}
        blur="90px"
      />
      <Gradient
        top="4%"
        right="25%"
        size="clamp(561px, 56vw, 561px)"
        stops={[
          "color-mix(in srgb, var(--color-bg-gradient-end) 85%, transparent) 0%",
          "transparent 68%",
        ]}
        opacity={0.15}
        blur="90px"
        blurMobile="40px"
        animate="breathe"
        animationDelay="-4s"
      />

      <HeroParticleField />

      {/* Decorative design asset, not generated geometry — exported
          directly from Figma. Treated exactly like the ampd-wordmark
          asset in Hero.tsx: referenced by path, not redrawn as CSS or
          SVG markup here, so it stays pixel-perfect with the source
          file and any future re-export just replaces the file on
          disk with zero code changes.
          Rendered at its own intrinsic size — width/height below are
          the asset's native dimensions (next/image requires them
          without `fill`), not a display size this component chooses;
          nothing here scales, crops, or constrains the artwork.
          TODO: drop the real export at /public/images/hero/hero-ellipse-stroke.svg —
          this path doesn't exist yet, same placeholder status as
          ampd-wordmark.svg until the asset is supplied. Swap the
          width/height below for its real intrinsic dimensions once
          it lands. */}
      <Image
        src="/images/hero/hero-ellipse-stroke.svg"
        alt=""
        width={820}
        height={560}
        className={styles.ellipseStroke}
        aria-hidden="true"
      />

    </div>
  );
}