import Image from "next/image";
import clsx from "clsx";
import styles from "./PageRibbon.module.css";

export interface PageRibbonProps {
  /** Path to the decorative ribbon PNG asset. */
  src: string;
  /** Natural image width for next/image aspect ratio preservation. */
  width: number;
  /** Natural image height for next/image aspect ratio preservation. */
  height: number;
  /** Optional custom class name for page-specific positioning and responsive overrides. */
  className?: string;
  /** Optional image class name. */
  imageClassName?: string;
  /** Whether to load the image with priority. Defaults to true. */
  priority?: boolean;
}

/**
 * PageRibbon
 *
 * Renders a decorative ribbon in the page-level visual layer behind main in-flow content.
 * Enables proper stacking context inheritance across section boundaries and allows
 * glass elements with `backdrop-filter: blur(...)` in downstream sections to sample
 * and blur the underlying ribbon without boundary clipping.
 *
 * Server Component: no "use client", no state, no hooks.
 */
export function PageRibbon({
  src,
  width,
  height,
  className,
  imageClassName,
  priority = true,
}: PageRibbonProps) {
  return (
    <div className={clsx(styles.wrapper, className)} aria-hidden="true">
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className={clsx(styles.ribbon, imageClassName)}
        priority={priority}
      />
    </div>
  );
}
