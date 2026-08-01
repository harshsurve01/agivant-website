"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import clsx from "clsx";
import styles from "./ShineHighlight.module.css";

interface ShineHighlightProps {
  text: string;
  className?: string;
}

/**
 * ShineHighlight
 *
 * One-shot entrance for the hero's static "real business value" line:
 * words fade in word-by-word on mount with a soft blur-to-sharp
 * resolve plus a slight lift (a gentler blend of RotatingWords's
 * "rise" and "blur" reveal styles), then a shine sweep loops across
 * the settled text.
 *
 * Deliberately its own component rather than reusing RotatingWords:
 * RotatingWords is built around cycling between N phrases on a
 * repeating timer (two stacked layers, HOLD_TIME, style cycling that
 * advances every rotation). This is a single phrase that animates in
 * once and never swaps — bolting that onto RotatingWords would mean
 * threading a "don't rotate" mode through logic that assumes
 * rotation, so it's simpler as its own small component.
 *
 * Words are rendered with inline opacity:0 / translateY so they're
 * hidden from first paint — no flash of static, fully-visible text
 * before the GSAP entrance tween takes over post-hydration.
 */
export function ShineHighlight({ text, className }: ShineHighlightProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const wordEls = wrapper.querySelectorAll<HTMLSpanElement>(
      `.${styles.word}`
    );

    const tl = gsap.timeline({
      delay: 0.15, // small beat after the other heading lines land
      onComplete: () => {
        // Shine only starts once the reveal has fully settled, and is
        // applied as a class (not baked into the entrance timeline) so
        // it can loop independently via CSS animation without GSAP
        // having to manage an infinite tween.
        wrapper.classList.add(styles.shineActive);
      },
    });

    tl.to(wordEls, {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <span ref={wrapperRef} className={clsx(styles.wrapper, className)}>
      {words.map((word, i) => (
        <span
          key={i}
          className={styles.word}
          style={{
            opacity: 0,
            transform: "translateY(14px)",
            filter: "blur(8px)",
          }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}