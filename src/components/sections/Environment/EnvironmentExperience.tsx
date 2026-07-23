"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { EnvironmentTimeline } from "./EnvironmentTimeline";
import { EnvironmentCardDeck } from "./EnvironmentCardDeck";
import type { EnvironmentStage } from "@/data/environment";
import styles from "./EnvironmentExperience.module.css";

interface EnvironmentExperienceProps {
  /** Pre-rendered by Environment (a Server Component) and passed in
   *  as a slot — see Environment.tsx's doc comment for why this can't
   *  just be an `import { EnvironmentHeader } from "./EnvironmentHeader"`
   *  inside this Client Component file. This component never inspects
   *  or re-renders it; it only decides where it sits in the pinned
   *  layout. */
  header: ReactNode;
  stages: EnvironmentStage[];
  /** Same pre-rendered-slot reasoning as `header`, for the section's
   *  closing CTA (Link + Button). Still static, data-driven content
   *  with no reason to live inside the Client Component boundary —
   *  only now that boundary is *this* component instead of a sibling
   *  outside the pin, so it arrives as a prop rather than being laid
   *  out by the parent independently. */
  cta: ReactNode;
}

/**
 * EnvironmentExperience
 *
 * The owner of the section's ENTIRE pinned storytelling experience:
 * heading, the Timeline/Card Deck, and the CTA are now all inside the
 * same pinned stage and stay visible together for the full scroll
 * interaction — not just Timeline/Card Deck as before. This fixes the
 * previous behavior where the heading scrolled away before the pin
 * engaged: it wasn't part of the pinned subtree, just a sibling above
 * it.
 *
 * `header` and `cta` arrive as already-rendered ReactNode props
 * (see the interface above) rather than being imported and rendered
 * here — this component still owns *where* they sit in the pinned
 * layout (.stageInner's flex stack), just not what's inside them.
 * `stages` remains plain serializable data, same as before, since the
 * scroll-sync logic below needs to read `stages.length` and index
 * into it directly.
 *
 * PIN MECHANICS
 * `.pinTrack` is an oversized block — `stages.length` viewport-heights
 * tall — that exists purely to give the browser somewhere to scroll
 * while this section stays visually still. `.pinStage` inside it is
 * `position: sticky; top: 0`, so it locks to the viewport for exactly
 * as long as `.pinTrack` is scrolling past, then releases naturally
 * once `.pinTrack` runs out — no scroll-hijacking, no JS-driven
 * scrollTo, no library. The scroll listener below only ever READS
 * scroll position to derive state; it never writes to it. Unchanged
 * from before this refactor — only what's *inside* `.pinStage` grew.
 *
 * SCROLL → STATE
 * On every scroll/resize, `handleScroll` measures how far `.pinTrack`
 * has scrolled past the top of the viewport relative to its own
 * scrollable range (`trackHeight - viewportHeight`), producing a
 * continuous `scrollProgress` in [0, 1]. `activeStageIndex` is the
 * stepped version of that same progress (`floor(progress * stages.length)`,
 * clamped) — the deck and the timeline's active dot/title both need a
 * discrete "which stage" answer, but the timeline's line-fill wants
 * the continuous value so it doesn't visibly jump between steps.
 * Both are derived from one measurement per frame so they can never
 * drift out of sync with each other.
 *
 * `requestAnimationFrame`-throttled: `scroll` can fire far more often
 * than the browser paints; the rAF guard collapses a burst of scroll
 * events into at most one state update per frame instead of one per
 * event.
 */
export function EnvironmentExperience({ header, stages, cta }: EnvironmentExperienceProps) {
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const trackEl = pinTrackRef.current;
    if (!trackEl) return;

    const measure = () => {
      const rect = trackEl.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;

      // Track is shorter than one viewport (e.g. a single-stage data
      // set, or a very tall viewport) — nothing to progress through.
      if (scrollableDistance <= 0) {
        setScrollProgress(0);
        setActiveStageIndex(0);
        return;
      }

      const progress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));
      const steppedIndex = Math.min(stages.length - 1, Math.floor(progress * stages.length));

      setScrollProgress(progress);
      setActiveStageIndex(steppedIndex);
    };

    const handleScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [stages.length]);

  const activeStage = stages[activeStageIndex];

  return (
    <div
      ref={pinTrackRef}
      className={styles.pinTrack}
      // TODO(figma): "how long the section stays pinned" has no
      // measurable equivalent in a static screenshot — one viewport
      // height of scroll per stage is a reasonable default pace, not
      // a confirmed spec value.
      style={{ ["--stage-count" as string]: stages.length }}
    >
      <div className={styles.pinStage}>
        <div className={styles.stageInner}>
          {header}

          <div className={styles.experience}>
            <EnvironmentTimeline
              stages={stages}
              activeStageId={activeStage.id}
              activeStageIndex={activeStageIndex}
              progress={scrollProgress}
            />
            <EnvironmentCardDeck stages={stages} activeIndex={activeStageIndex} />
          </div>

          <div className={styles.ctaRow}>{cta}</div>
        </div>
      </div>
    </div>
  );
}