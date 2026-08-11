import type { SVGProps } from "react";

/**
 * Clock
 *
 * Inline SVG icon matching the read-time clock glyph shown on each
 * BlogCard in Figma (Blog Hub → Group 216/217). Same pattern as the
 * existing ArrowRight/ArrowUpRight components: a plain presentational
 * SVG wrapper, no "use client", no state — inherits `currentColor` so
 * it sits correctly at the meta-row text color/size without a
 * separate fill prop.
 */
export function Clock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="7" cy="7" r="5.833" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M7 4.083V7l2.042 1.167"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
