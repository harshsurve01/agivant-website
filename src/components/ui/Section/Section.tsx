import React, { forwardRef } from "react";
import clsx from "clsx";
import styles from "./Section.module.css";

/**
 * Supported section height modes.
 * - "viewport": default 100vh minimum height matching the global section baseline.
 * - "auto": content-driven natural height (min-height: auto; height: auto).
 */
export type SectionHeight = "viewport" | "auto";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Section height behavior. Defaults to "viewport" (100vh). */
  height?: SectionHeight;
  /** Custom class name(s) merged after the internal height class. */
  className?: string;
  /** Content rendered inside the section. */
  children?: React.ReactNode;
  /** Semantic HTML element override. Defaults to "section". */
  as?: React.ElementType;
}

/**
 * Section
 *
 * Reusable layout primitive controlling section-level height behavior.
 * Provides a clean, typed mechanism to opt individual sections into
 * natural content sizing ("auto") while preserving the global 100vh
 * viewport default ("viewport") across the rest of the application.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    height = "viewport",
    className,
    children,
    as: Component = "section",
    ...rest
  },
  ref
) {
  return (
    <Component
      ref={ref}
      className={clsx(
        styles.section,
        height === "auto" ? styles.auto : styles.viewport,
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
});
