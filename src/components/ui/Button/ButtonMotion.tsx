"use client";

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { useMagneticHover } from "./useMagneticHover";
import { useCursorGlow } from "./useCursorGlow";
import { RollingText, type RollingTextHandle } from "./RollingText";
import styles from "./ButtonMotion.module.css";

// Values match the original PHP button.js implementation exactly — this
// task is behavioural parity, not a redesign. See hero.php / button.js
// for the reference the numbers below are pulled from.
const ROLL_DURATION = 0.2;
const ROLL_EASE = "power3.out";
const CHAR_STAGGER = 0.015;
const ICON_OFFSET_X = 3;
const ICON_ROTATE = 8;
const GLOW_DURATION = 0.35; // matches button.js's BG_DURATION
const PRESS_DURATION = 0.15;
const PRESS_TRANSLATE = 1; // px, small mousedown nudge

export interface ButtonMotionProps {
  type: "button" | "submit" | "reset";
  disabled: boolean;
  /** Fully pre-composed className from Button.tsx — .button + variant +
   * size + any caller className. Never inspected or altered here, only
   * appended to. ButtonMotion owns behavior, not this visual surface. */
  className: string;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * ButtonMotion
 *
 * Owns behavior: the actual <button> DOM node, and every interactive
 * layer (magnetic hover, cursor glow, rolling text, icon motion,
 * elevation, press state). Visual surface still arrives pre-computed
 * via `className` from Button.module.css and is never touched here.
 *
 * GSAP is now the interaction engine for the whole system, matching
 * the original PHP button.js one-to-one instead of splitting the work
 * across a CSS transition here, a rAF loop there, and a GSAP timeline
 * for just the text. Concretely:
 *
 *  - Magnetic hover (Layer 1) & cursor glow position (Layer 2): both
 *    now `gsap.quickTo`, owned inside useMagneticHover / useCursorGlow
 *    respectively — continuous, pointer-driven, and independent of
 *    hover enter/leave because they respond to *movement*, not a
 *    boolean hover state (same as the reference).
 *  - Rolling text, icon motion, glow opacity, and elevation (Layers
 *    2's opacity, 3, 4, 5): a single `playHover` timeline below, so
 *    they start on the same frame and ease on the same curve — "one
 *    animation," not four independent ones.
 *  - Press (Layer 6): a short, separate GSAP tween on the button's own
 *    `y`, driven by mousedown/mouseup — not CSS `:active` — so it's
 *    GSAP-owned like everything else, per the brief.
 *  - Leave (Layer 7): mouseleave reverses the hover timeline AND
 *    resolves the press tween back to rest, so nothing is left
 *    mid-animation if the pointer leaves while the button is held down.
 *
 * Two separate transform owners, unchanged from before: the magnetic
 * pull lives on the outer wrapper <span>; the button itself is where
 * the press tween writes `y`.
 */
export function ButtonMotion({
  type,
  disabled,
  className,
  children,
  leftIcon,
  rightIcon,
}: ButtonMotionProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const rollingRef = useRef<RollingTextHandle>(null);
  const leftIconRef = useRef<HTMLSpanElement>(null);
  const rightIconRef = useRef<HTMLSpanElement>(null);
  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const pressTweenRef = useRef<gsap.core.Tween | null>(null);
  // Read once, from the CSS token itself, so this file never hardcodes
  // a duplicate shadow value — --shadow-md in variables.css stays the
  // single source of truth, GSAP just animates toward it instead of
  // CSS :hover doing so.
  const shadowValueRef = useRef<string>("none");

  // Read once on mount (client-only component, so window exists at
  // render time). Same check useMagneticHover / useCursorGlow already
  // make independently — kept local here rather than shared, so this
  // file has no new dependency on those hooks' internals.
  const reducedMotionRef = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useMagneticHover(wrapRef);
  useCursorGlow(buttonRef);

  useEffect(() => {
    if (typeof window === "undefined") return;
    shadowValueRef.current =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--shadow-md")
        .trim() || "none";
  }, []);

  // Set the two rolling layers to their resting state. gsap.set is
  // immediate (no animation), so this just establishes the same
  // starting point button.js's gsap.set(...) calls did: base row
  // visible, hover row parked one full glyph-height below.
  useEffect(() => {
    if (typeof children !== "string" || reducedMotionRef.current) return;

    const chars = rollingRef.current?.getChars() ?? [];
    if (chars.length === 0) return;

    gsap.set(chars.map((c) => c.inner), { yPercent: 0 });
    gsap.set(chars.map((c) => c.clone), { yPercent: 100 });

    return () => {
      hoverTimelineRef.current?.kill();
      hoverTimelineRef.current = null;
      pressTweenRef.current?.kill();
      pressTweenRef.current = null;
    };
  }, [children]);

  function playHover(direction: "in" | "out") {
    if (reducedMotionRef.current) return;

    // Kill any in-flight timeline before starting the next one — a fast
    // mouseenter/mouseleave shouldn't stack animations, it should
    // redirect the current one, same as button.js's hoverTimeline.kill().
    hoverTimelineRef.current?.kill();
    const tl = gsap.timeline();
    hoverTimelineRef.current = tl;
    const entering = direction === "in";

    // One coordinated timeline, everything starting at position 0:
    // rolling text, icon, glow opacity, and elevation all read as a
    // single gesture rather than independent animations.
    if (typeof children === "string") {
      const chars = rollingRef.current?.getChars() ?? [];
      if (chars.length > 0) {
        tl.to(
          chars.map((c) => c.inner),
          {
            yPercent: entering ? -100 : 0,
            duration: ROLL_DURATION,
            ease: ROLL_EASE,
            stagger: { each: CHAR_STAGGER, from: "start" },
          },
          0
        );

        tl.to(
          chars.map((c) => c.clone),
          {
            yPercent: entering ? 0 : 100,
            duration: ROLL_DURATION,
            ease: ROLL_EASE,
            stagger: { each: CHAR_STAGGER, from: "start" },
          },
          0
        );
      }
    }

    const iconTargets = [leftIconRef.current, rightIconRef.current].filter(
      (el): el is HTMLSpanElement => el !== null
    );
    if (iconTargets.length > 0) {
      tl.to(
        iconTargets,
        {
          x: entering ? ICON_OFFSET_X : 0,
          rotate: entering ? ICON_ROTATE : 0,
          duration: ROLL_DURATION,
          ease: ROLL_EASE,
        },
        0
      );
    }

    if (glowRef.current) {
      tl.to(
        glowRef.current,
        {
          opacity: entering ? 1 : 0,
          duration: GLOW_DURATION,
          ease: "power2.out",
        },
        0
      );
    }

    if (buttonRef.current) {
      tl.to(
        buttonRef.current,
        {
          boxShadow: entering ? shadowValueRef.current : "0 0 0 0 rgba(0,0,0,0)",
          duration: GLOW_DURATION,
          ease: "power2.out",
        },
        0
      );
    }
  }

  function handlePressStart() {
    if (reducedMotionRef.current || disabled || !buttonRef.current) return;
    pressTweenRef.current?.kill();
    pressTweenRef.current = gsap.to(buttonRef.current, {
      y: PRESS_TRANSLATE,
      duration: PRESS_DURATION,
      ease: "power2.out",
    });
  }

  function handlePressEnd() {
    if (reducedMotionRef.current || !buttonRef.current) return;
    pressTweenRef.current?.kill();
    pressTweenRef.current = gsap.to(buttonRef.current, {
      y: 0,
      duration: PRESS_DURATION,
      ease: "power2.out",
    });
  }

  return (
    <span ref={wrapRef} className={styles.magneticWrap}>
      <button
        ref={buttonRef}
        type={type}
        disabled={disabled}
        className={clsx(className, styles.motion)}
        onMouseEnter={() => playHover("in")}
        onMouseLeave={() => {
          // Layer 7: leave is a single coordinated reverse — the hover
          // timeline reverses AND any in-progress press resolves back
          // to rest, so nothing is left mid-animation if the pointer
          // leaves while the button is held down.
          playHover("out");
          handlePressEnd();
        }}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onFocus={() => playHover("in")}
        onBlur={() => {
          playHover("out");
          handlePressEnd();
        }}
      >
        <span ref={glowRef} className={styles.glow} aria-hidden="true" />

        {leftIcon ? (
          <span ref={leftIconRef} className={styles.icon}>
            {leftIcon}
          </span>
        ) : null}

        {typeof children === "string" ? (
          <RollingText ref={rollingRef} text={children} />
        ) : (
          children
        )}

        {rightIcon ? (
          <span ref={rightIconRef} className={styles.icon}>
            {rightIcon}
          </span>
        ) : null}
      </button>
    </span>
  );
}