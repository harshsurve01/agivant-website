import Link from "next/link";
// TODO(path): adjust this import to match wherever Button actually lives
// in this project (e.g. "@/components/ui/Button"). Assumed here to match
// the barrel-export convention used elsewhere in the codebase.
import { Button } from "@/components/ui/Button";
import type { FooterButton } from "@/data/footer";
import styles from "./FooterCTA.module.css";
import Image from "next/image";

export interface FooterCTAProps {
  /** Section heading text. */
  heading: {
    line1: string;
    line2Prefix: string;
    line2Brand: string;
    line3: string;
  };
  /** CTA buttons rendered below the heading. */
  buttons: FooterButton[];
}

/**
 * FooterCTA
 *
 * Owns the footer's heading and CTA buttons — the top-left visual zone.
 * Each button is a real navigational link: <Button> (a presentation-only
 * primitive with no onClick) is wrapped in <Link>, so navigation works
 * without turning this into a Client Component.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function FooterCTA({ heading, buttons }: FooterCTAProps) {
  return (
    <div className={styles.cta}>
      <h2 className={styles.heading}>
  <span className={styles.headingLine}>
    {heading.line1}
  </span>

  <span className={styles.headingLine}>
    {heading.line2Prefix}{" "}

    <Image
      src="/images/hero/ampd-wordmark.svg"
      alt="Amp'd"
      width={260}     // placeholder intrinsic width
      height={88}     // placeholder intrinsic height
      className={styles.ampdWordmark}
    />
  </span>

  <span className={styles.headingLine}>
    {heading.line3}
  </span>
</h2>
      <div className={styles.buttons}>
        {buttons.map((button) => (
          <Link
            key={button.href}
            href={button.href}
            className={styles.buttonLink}
          >
            <Button
              variant={button.variant}
              size="lg"
              rightIcon={
                button.icon ? <FooterButtonIcon icon={button.icon} /> : undefined
              }
            >
              {button.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * FooterButtonIcon
 *
 * Resolves a serializable icon key (FooterButton.icon) to an inline SVG.
 * Kept local to FooterCTA since the footer is the only current consumer
 * of these two icons — promote to a shared Icon component if a future
 * section needs the same key-to-icon mapping.
 *
 * ASSET NOTE: inline placeholder SVGs standing in for the real exported
 * icon assets. Swap the <path> data once the real assets are supplied;
 * no other part of FooterCTA needs to change.
 */
function FooterButtonIcon({
  icon,
}: {
  icon: NonNullable<FooterButton["icon"]>;
}) {
  if (icon === "arrow-up-right") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 12L12 4M12 4H5M12 4V11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // icon === "cube"
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 1.5L14 5V11L8 14.5L2 11V5L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M2 5L8 8.5L14 5M8 8.5V14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
