"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import styles from "./ButtonMotion.module.css";

export interface RollingTextChar {
  inner: HTMLSpanElement;
  clone: HTMLSpanElement;
}

export interface RollingTextHandle {
  /**
   * Returns the inner/clone span pair for every character, in order.
   * RollingText's only job is building this DOM — it never calls gsap
   * itself. ButtonMotion reads these refs to build the single
   * coordinated hover timeline (rolling text + icon), per the approved
   * "GSAP animates, RollingText only builds DOM" split.
   */
  getChars: () => RollingTextChar[];
}

export interface RollingTextProps {
  /** The label to render. Split at render time, so it works fine with
   * a string that only exists once WordPress data has loaded — no
   * build-time assumption about length or content. */
  text: string;
}

/**
 * RollingText
 *
 * Layer 3 of the Button Motion System ("rolling typography... every
 * character split individually... subtle stagger"). This component
 * only builds DOM structure — one mask per character, holding two
 * stacked identical glyphs — and exposes refs to those glyphs via
 * useImperativeHandle. The actual roll is animated by a GSAP timeline
 * owned by ButtonMotion (see ButtonMotion.tsx's playHover), matching
 * the original PHP implementation's GSAP-driven wave. No animation
 * logic — CSS or JS — lives in this file.
 *
 * Accessibility: the visible, animated character grid is marked
 * aria-hidden because it's a decorative duplicate of the text, not
 * the text itself. The real label is a second, visually-hidden span
 * holding the plain, unsplit string — always present in the
 * accessibility tree, unaffected by whatever the visual layer is
 * doing, and exactly what a screen reader or "find in page" expects
 * a button's semantic content to be.
 */
export const RollingText = forwardRef<RollingTextHandle, RollingTextProps>(
  function RollingText({ text }, ref) {
    const characters = useMemo(() => Array.from(text), [text]);

    // One ref pair per character. Rebuilt whenever the label's length
    // changes (e.g. a dynamic WordPress-sourced CTA swaps text) so
    // stale entries from a previous render never leak into the
    // timeline ButtonMotion builds off getChars().
    const charRefs = useRef<Array<{ inner: HTMLSpanElement | null; clone: HTMLSpanElement | null }>>(
      characters.map(() => ({ inner: null, clone: null }))
    );
    if (charRefs.current.length !== characters.length) {
      charRefs.current = characters.map(() => ({ inner: null, clone: null }));
    }

    useImperativeHandle(
      ref,
      () => ({
        getChars: () =>
          charRefs.current.filter(
            (c): c is RollingTextChar => c.inner !== null && c.clone !== null
          ),
      }),
      // Re-exposed whenever the character count changes, so ButtonMotion
      // always reads the current DOM, not a stale closure from a
      // previous label.
      [characters.length]
    );

    return (
      <>
        <span className={styles.rollingWrap} aria-hidden="true">
          {characters.map((char, index) => {
            const glyph = char === " " ? "\u00A0" : char;
            return (
              <span key={index} className={styles.charMask}>
                <span
                  className={styles.charInner}
                  ref={(el) => {
                    charRefs.current[index].inner = el;
                  }}
                >
                  {glyph}
                </span>
                <span
                  className={styles.charClone}
                  ref={(el) => {
                    charRefs.current[index].clone = el;
                  }}
                >
                  {glyph}
                </span>
              </span>
            );
          })}
        </span>
        <span className={styles.srOnly}>{text}</span>
      </>
    );
  }
);