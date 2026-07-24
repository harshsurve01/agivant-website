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
   *  or re-renders it; it only decides where it sits in the layout. */
  header: ReactNode;
  stages: EnvironmentStage[];
  /** Same pre-rendered-slot reasoning as `header`, for the section's
   *  closing CTA (Link + Button). Rendered OUTSIDE the pinned track
   *  now — see the "PIN MECHANICS" comment below for why. */
  cta: ReactNode;
}

/**
 * EnvironmentExperience
 *
 * Owns the section's PINNED storytelling experience — heading,
 * Timeline, and Card Deck — plus the CTA that follows it in normal
 * flow once the pin releases.
 *
 * `header` and `cta` arrive as already-rendered ReactNode props
 * (see the interface above) rather than being imported and rendered
 * here — this component still owns *where* they sit in the layout,
 * just not what's inside them. `stages` remains plain serializable
 * data, since the scroll-sync logic below needs to read
 * `stages.length` and index into it directly.
 *
 * PIN MECHANICS
 * `.pinTrack` is an oversized block — `stages.length` viewport-heights
 * tall — that exists purely to give the browser somewhere to scroll
 * while the header/timeline/deck stay visually still. `.pinStage`
 * inside it is `position: sticky; top: 0`, so it locks to the
 * viewport for exactly as long as `.pinTrack` is scrolling past, then
 * releases naturally once `.pinTrack` runs out — no scroll-hijacking,
 * no JS-driven scrollTo, no library. The scroll listener below only
 * ever READS scroll position to derive state; it never writes to it.
 *
 * The CTA is deliberately rendered as a SIBLING of `.pinTrack`, not
 * inside `.pinStage`/`.stageInner` — it's ordinary in-flow content
 * that should scroll in right after the deck once the pin lets go,
 * not stay locked to the viewport for the full
 * `stages.length`-viewport-heights scroll distance the pin holds
 * open for the header/timeline/deck. Only content that's part of the
 * actual scroll-synced storytelling (header, timeline, deck) belongs
 * inside the pinned subtree; the CTA never needed to be pinned, it
 * just used to render there because it was composed inside the same
 * component.
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
    <div className={styles.environmentExperience}>
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
          </div>
        </div>
      </div>

      {/* Deliberately OUTSIDE .pinTrack — see "PIN MECHANICS" above.
          Normal in-flow content: scrolls in right after the deck,
          once the pin has released, rather than staying pinned for
          the full stages.length-viewport-heights scroll distance. */}
      <div className={styles.ctaRow}>{cta}</div>
    </div>
  );
}