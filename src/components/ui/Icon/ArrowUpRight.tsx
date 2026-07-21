import type { SVGProps } from "react";

/**
 * ArrowUpRight
 *
 * Inline SVG icon matching the ↗ mark shown on the Partners CTA in
 * Figma. Same pattern as the existing Icon/Cube component: a plain
 * presentational SVG wrapper, no "use client", no state — it can be
 * dropped into Button's `rightIcon`/`leftIcon` slot as-is because
 * Button already centers and sizes whatever ReactNode it's given.
 *
 * Source mark lives at src/assets/icons/arrow-up-right.svg; inlined
 * here (rather than imported via next/image) so it can inherit
 * `currentColor` and sit correctly at button text size.
 */
export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
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
        d="M4 12L12 4M12 4H5.5M12 4V10.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
