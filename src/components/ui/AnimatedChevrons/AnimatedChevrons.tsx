import clsx from "clsx";
import styles from "./AnimatedChevrons.module.css";

interface AnimatedChevronsProps {
  className?: string;
}

/**
 * AnimatedChevrons
 *
 * Reusable animated 3-chevron transition indicator.
 * Matches the exact chevron geometry and `chevronChase` keyframes animation
 * established by Homepage `AmpTransformation` (AmpFooter.tsx & AmpFooter.module.css).
 */
export function AnimatedChevrons({ className }: AnimatedChevronsProps) {
  return (
    <svg
      className={clsx(styles.chevrons, className)}
      viewBox="0 0 24 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 2L6 9L0 16"
        transform="translate(0 0)"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0 2L6 9L0 16"
        transform="translate(7 0)"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0 2L6 9L0 16"
        transform="translate(14 0)"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
