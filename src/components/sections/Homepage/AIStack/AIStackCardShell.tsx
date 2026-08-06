"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { AIStackBadge } from "./AIStackBadge";
import styles from "./AIStackCardShell.module.css";

interface AIStackCardShellProps {
  badge: string;
  children: ReactNode;
}

// TODO(figma): tilt intensity/timing are best-effort, not measured
// off a spec — no card interaction inspector was supplied.
const MAX_TILT_DEG = 10;
const HOVER_EASE = "power3.out";
const HOVER_DURATION = 0.4;
const RETURN_DURATION = 0.6;
const RETURN_EASE = "elastic.out(1, 0.6)";

type QuickSetter = (value: number) => void;

/**
 * AIStackCardShell
 *
 * The ONLY Client Component in this section and the ONLY interaction
 * engine. Every AIStack card — regardless of which layout it renders
 * — gets its pointer tracking, perspective, rotateX/rotateY tilt, and
 * return-to-rest animation from exactly this one implementation.
 *
 * The shell also owns the two pieces of chrome shared by every card
 * (background fill, badge) because every Figma card places and styles
 * them identically — see the AIStack implementation prompt's
 * "Badge + background ownership" section for why those are NOT
 * duplicated inside every layout. The badge sits inside `.shell`
 * alongside everything else, so it keeps real 3D depth and tilts with
 * the card — its `top` value in the CSS is solved to cancel out the
 * height-dependent position error that perspective projection would
 * otherwise introduce on row-spanning cards (see `.badgeLayer`'s
 * comment for the derivation).
 *
 * The shell knows nothing about what's inside it. `children` is a
 * pre-rendered layout component handed down by AIStackCard (the
 * server resolver) — title, description, image, and spacing are
 * entirely the layout's concern. This component has no idea what
 * card it's wrapping.
 *
 * Pointer math: rotation is derived from the pointer's position
 * within the card's own bounding box (0–1 on each axis), centered so
 * the middle of the card is the neutral (0deg, 0deg) resting point.
 * gsap.quickTo gives cheap, interruptible per-frame tweens for the
 * high-frequency pointermove updates; leaving the card uses a single
 * springy gsap.to back to rest, which is a distinct animation (not
 * just another quickTo call) precisely because it only needs to fire
 * once per hover-out, not on every pixel of movement.
 */
export function AIStackCardShell({ badge, children }: AIStackCardShellProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const quickRotateX = useRef<QuickSetter | null>(null);
  const quickRotateY = useRef<QuickSetter | null>(null);

  const getQuickSetters = () => {
    const shell = shellRef.current;
    if (!shell) return null;

    if (!quickRotateX.current) {
      quickRotateX.current = gsap.quickTo(shell, "rotationX", {
        duration: HOVER_DURATION,
        ease: HOVER_EASE,
      });
    }
    if (!quickRotateY.current) {
      quickRotateY.current = gsap.quickTo(shell, "rotationY", {
        duration: HOVER_DURATION,
        ease: HOVER_EASE,
      });
    }

    return { rotateX: quickRotateX.current, rotateY: quickRotateY.current };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const shell = shellRef.current;
    const setters = getQuickSetters();
    if (!shell || !setters) return;

    const rect = shell.getBoundingClientRect();
    const pointerX = (event.clientX - rect.left) / rect.width; // 0 - 1, left to right
    const pointerY = (event.clientY - rect.top) / rect.height; // 0 - 1, top to bottom

    // Centered so the card's midpoint is neutral (0, 0); pointer above
    // center tilts the top back (positive rotationX), pointer right of
    // center tilts the right edge back (positive rotationY).
    const rotateX = (0.5 - pointerY) * 2 * MAX_TILT_DEG;
    const rotateY = (pointerX - 0.5) * 2 * MAX_TILT_DEG;

    setters.rotateX(rotateX);
    setters.rotateY(rotateY);
  };

  const handlePointerLeave = () => {
    const shell = shellRef.current;
    if (!shell) return;

    gsap.to(shell, {
      rotationX: 0,
      rotationY: 0,
      duration: RETURN_DURATION,
      ease: RETURN_EASE,
    });
  };

  return (
    <div className={styles.wrapper}>
      <div
        ref={shellRef}
        className={styles.shell}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className={styles.background} aria-hidden="true" />

        <div className={styles.badgeLayer}>
          <AIStackBadge label={badge} />
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}