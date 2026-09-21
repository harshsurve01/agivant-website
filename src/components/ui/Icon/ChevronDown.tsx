import type { SVGProps } from "react";

/**
 * ChevronDown
 *
 * Reusable inline SVG chevron icon following the project's Icon conventions.
 * Can be rotated 180deg via CSS to indicate an open/expanded state.
 */
export function ChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M1 1L5 5L9 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
