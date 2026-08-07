import type { SVGProps } from "react";

/**
 * ArrowRight
 *
 * Inline SVG icon matching the → mark shown on the TechTalk hero's
 * primary CTA in Figma. Same pattern as the existing ArrowUpRight/Cube
 * components: a plain presentational SVG wrapper, no "use client", no
 * state — drops straight into Button's `rightIcon`/`leftIcon` slot,
 * since Button already centers and sizes whatever ReactNode it's given.
 *
 * Inlined directly (rather than imported via next/image or an SVGR
 * asset path) so it inherits `currentColor` and sits correctly at
 * button text size, same rationale as ArrowUpRight.tsx.
 */
export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M3.333 8h9.334M8.667 3.667 13 8l-4.333 4.333"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
