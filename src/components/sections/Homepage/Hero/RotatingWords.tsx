"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import clsx from "clsx";
import styles from "./RotatingWords.module.css";

interface RotatingWordsProps {
  words: string[];
  className?: string;
}

/**
 * Glyphora Kinetic Headline
 *
 * Word-by-word reveal for the rotating phrase. Instead of animating
 * the whole phrase as one block (the old behavior), each word in the
 * incoming/outgoing phrase gets its own span and its own staggered
 * tween — so the phrase visibly builds itself word by word rather
 * than swapping as a single unit.
 *
 * Three reveal styles, cycled in order (Rise -> Blur -> Flip -> Rise
 * -> ...) so consecutive rotations don't repeat the same motion:
 *   - "rise": words lift up from below on a soft fade
 *   - "blur": words resolve into focus from a soft blur, no motion
 *   - "flip": words rotate in on the X axis (the original effect),
 *              now per-word instead of per-phrase
 *
 * Layout/stacking scaffolding (two absolutely-positioned layers, the
 * invisible ::before placeholder that reserves space) is unchanged
 * from the original component — only what happens *inside* a layer
 * changed, from one text node to N word spans.
 */

const HOLD_TIME = 3;
const WORD_DURATION = 0.6;
const WORD_STAGGER = 0.07;
const CROSSOVER_OFFSET = 0.12; // next phrase starts revealing slightly
                                 // before the active one finishes leaving

type RevealStyle = "rise" | "blur" | "flip";
const REVEAL_STYLES: RevealStyle[] = ["rise", "blur", "flip"];

const RESTING: gsap.TweenVars = {
  y: 0,
  rotationX: 0,
  opacity: 1,
  filter: "blur(0px)",
};

// Per-style start state for a word entering, and end state for a word leaving.
const STYLE_STATES: Record<
  RevealStyle,
  { enter: gsap.TweenVars; leave: gsap.TweenVars }
> = {
  rise: {
    enter: { y: 22, rotationX: 0, opacity: 0, filter: "blur(0px)" },
    leave: { y: -22, rotationX: 0, opacity: 0, filter: "blur(0px)" },
  },
  blur: {
    enter: { y: 0, rotationX: 0, opacity: 0, filter: "blur(10px)" },
    leave: { y: 0, rotationX: 0, opacity: 0, filter: "blur(10px)" },
  },
  flip: {
    enter: { y: 18, rotationX: 90, opacity: 0, filter: "blur(3px)" },
    leave: { y: -18, rotationX: -90, opacity: 0, filter: "blur(3px)" },
  },
};

/** Rebuilds a layer's contents as one <span class="word"> per word,
 *  joined by real space text nodes so wrapping/spacing behaves like
 *  normal text (the layer itself is deliberately not a flex
 *  container — see RotatingWords.module.css). */
function renderWords(layer: HTMLSpanElement, phrase: string) {
  layer.innerHTML = "";
  const parts = phrase.split(" ");
  parts.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = styles.word;
    span.textContent = word;
    layer.appendChild(span);
    if (i < parts.length - 1) {
      layer.appendChild(document.createTextNode(" "));
    }
  });
}

function wordEls(layer: HTMLSpanElement) {
  return layer.querySelectorAll<HTMLSpanElement>(`.${styles.word}`);
}

export function RotatingWords({ words, className }: RotatingWordsProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const layerARef = useRef<HTMLSpanElement>(null);
  const layerBRef = useRef<HTMLSpanElement>(null);

  const currentIndex = useRef(0);
  const showingLayerA = useRef(true);
  const styleIndex = useRef(0);

  useEffect(() => {
    if (words.length <= 1) return;

    const wrapper = wrapperRef.current;
    const layerA = layerARef.current;
    const layerB = layerBRef.current;

    if (!wrapper || !layerA || !layerB) return;

    renderWords(layerA, words[0]);
    renderWords(layerB, words[1] ?? words[0]);

    gsap.set(wordEls(layerA), RESTING);
    gsap.set(wordEls(layerB), STYLE_STATES.rise.enter);

    // NOTE: this deliberately does NOT use gsap.timeline({ repeat: -1 })
    // with tweens appended dynamically inside a tl.call(). That pattern
    // only animates the first cycle correctly — each time the timeline
    // loops back to its start, tl.call() fires again and appends a new
    // set of tweens onto the END of the already-existing timeline
    // (rather than replacing the previous cycle's tweens). The timeline
    // grows a little longer every rotation, and the playhead spends
    // each loop replaying the *previous* cycle's now-stale tweens
    // (pointing at word spans that renderWords() already destroyed)
    // before it ever reaches the new one — which is why only the very
    // first word-reveal was ever visible.
    //
    // Instead, every cycle gets its own fresh, self-contained timeline
    // that schedules the next cycle itself in onComplete. Nothing
    // accumulates, and every tween always targets the current DOM.
    let cancelled = false;
    let activeTween: gsap.core.Timeline | gsap.core.Tween | null = null;

    const runCycle = () => {
      if (cancelled) return;

      const active = showingLayerA.current ? layerA : layerB;
      const next = showingLayerA.current ? layerB : layerA;

      const nextIndex = (currentIndex.current + 1) % words.length;
      const style = REVEAL_STYLES[styleIndex.current % REVEAL_STYLES.length];
      styleIndex.current += 1;

      renderWords(next, words[nextIndex]);

      const activeWords = wordEls(active);
      const nextWords = wordEls(next);
      const { enter, leave } = STYLE_STATES[style];

      gsap.set(nextWords, enter);

      const cycleTl = gsap.timeline({
        onComplete: () => {
          if (cancelled) return;
          activeTween = gsap.delayedCall(HOLD_TIME, runCycle);
        },
      });

      // Outgoing phrase leaves word by word.
      cycleTl.to(activeWords, {
        ...leave,
        duration: WORD_DURATION,
        stagger: WORD_STAGGER,
        ease: "power3.inOut",
      });

      // Incoming phrase reveals word by word, starting just before the
      // outgoing phrase fully clears so the swap feels continuous.
      cycleTl.to(
        nextWords,
        {
          ...RESTING,
          duration: WORD_DURATION,
          stagger: WORD_STAGGER,
          ease: "power3.inOut",
        },
        `<+=${CROSSOVER_OFFSET}`
      );

      showingLayerA.current = !showingLayerA.current;
      currentIndex.current = nextIndex;
      activeTween = cycleTl;
    };

    activeTween = gsap.delayedCall(HOLD_TIME, runCycle);

    return () => {
      cancelled = true;
      activeTween?.kill();
    };
  }, [words]);

  return (
    <span ref={wrapperRef} className={clsx(styles.wrapper, className)}>
      <span ref={layerARef} className={styles.layer} aria-hidden="true" />
      <span ref={layerBRef} className={styles.layer} aria-hidden="true" />
    </span>
  );
}