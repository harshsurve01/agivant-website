import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Container.module.css";

/**
 * Supported width steps. Maps directly onto the container tokens
 * defined in src/styles/variables.css (--container-sm ... --container-2xl),
 * plus "full" for an unconstrained width.
 */
export type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ContainerProps {
  /** Content to render inside the width-constrained wrapper. */
  children: ReactNode;
  /** Optional extra class(es), merged after the internal size class. */
  className?: string;
  /** Max-width step. Defaults to "xl". */
  size?: ContainerSize;
}

/**
 * Maps the public `size` prop to its CSS Module class. Kept as a lookup
 * object (not a template string) so the "2xl" prop value can resolve to
 * the "twoXl" class without any string-manipulation logic.
 */
const sizeClassMap: Record<ContainerSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
  "2xl": styles.twoXl,
  full: styles.full,
};

/**
 * Container
 *
 * Controls content width only: max-width, horizontal centering, and
 * horizontal padding. It renders a single semantic <div> and takes no
 * position on layout mode, vertical spacing, color, or typography —
 * those belong to whatever is placed inside it, or to a sibling layout
 * component.
 *
 * Server Component: no "use client", no hooks, no state, no effects.
 */
export function Container({
  children,
  className,
  size = "xl",
}: ContainerProps) {
  return (
    <div className={clsx(styles.container, sizeClassMap[size], className)}>
      {children}
    </div>
  );
}
