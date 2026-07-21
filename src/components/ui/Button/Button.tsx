import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Button.module.css";
import { ButtonMotion } from "./ButtonMotion";

/** Visual treatment of the button. */
export type ButtonVariant = "primary" | "dark";

/**
 * Design-system size scale. Named by scale, not by usage context — "sm"
 * happens to match a navbar CTA and "lg" a hero CTA today, but neither
 * name is tied to that placement.
 */
export type ButtonSize = "sm" | "lg";

/** Native button behaviors this component supports. */
export type ButtonType = "button" | "submit" | "reset";

export interface ButtonProps {
  /** Button label/content. */
  children: ReactNode;
  /** Visual variant. Defaults to "primary". */
  variant?: ButtonVariant;
  /** Size step. Defaults to "lg". */
  size?: ButtonSize;
  /** Native button type. Defaults to "button". */
  type?: ButtonType;
  /** Disables the button and applies the disabled visual state. */
  disabled?: boolean;
  /** Optional extra class(es), merged after the internal variant/size classes. */
  className?: string;
  /**
   * Optional icon rendered before the label. Accepts any ReactNode — the
   * caller supplies the icon (e.g. an SVGR-imported component) and
   * controls its own sizing; Button never hardcodes or knows which icon
   * it is rendering. Independent of `variant`: any icon can pair with
   * any variant. Omit to render the label alone, exactly as before.
   */
  leftIcon?: ReactNode;
  /**
   * Optional icon rendered after the label. Same contract as `leftIcon`:
   * any ReactNode, fully caller-controlled, independent of `variant`.
   */
  rightIcon?: ReactNode;
}

/**
 * Button
 *
 * A presentation-only, reusable button primitive. It owns its own visual
 * identity (background, border, radius, typography, padding, cursor,
 * hover/active/disabled states, transitions) and nothing about where it
 * sits on the page — no margin, no positioning, no surrounding layout.
 * API, variants, sizing, colors, and typography are unchanged from the
 * approved architecture.
 *
 * Server Component: no "use client", no hooks, no state, no event
 * handlers — unchanged. The Button Motion System (magnetic hover,
 * cursor glow, rolling text, icon motion, elevation, press state) is
 * delegated to ButtonMotion, a Client Component that owns behavior —
 * the actual <button> DOM node and every interaction on it — while
 * this file continues to own the visual surface (classNames only).
 * Server → ButtonMotion (Client) → Button, the same Server/Client
 * split already established between Header.tsx and HeaderShell.tsx.
 * Button itself still just computes classNames and passes props
 * through — it doesn't know the interaction layer exists.
 */
export function Button({
  children,
  variant = "primary",
  size = "lg",
  type = "button",
  disabled = false,
  className,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  return (
    <ButtonMotion
      type={type}
      disabled={disabled}
      className={clsx(styles.button, styles[variant], styles[size], className)}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
    >
      {children}
    </ButtonMotion>
  );
}