import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import type { FooterButton } from "@/data/footer";
import styles from "./PartnerFooterCTA.module.css";

export interface PartnerFooterCTAProps {
  /** Heading text as one conceptual data field or structured object. */
  heading: string | { line1: string; line2?: string };
  /** Supporting description paragraph. */
  description?: string;
  /** Partner artwork asset displayed on the left side of the card. */
  media?: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  } | null;
  /** CTA action button(s). */
  buttons: FooterButton[];
  /** Optional custom class name. */
  className?: string;
}

/**
 * Generic presenter for partner card headings:
 * "Put [Partner] to work for measurable business impact."
 * Splits into:
 * Line 1 (Purple): "Put [Partner] to work for"
 * Line 2 (Black): "measurable business impact."
 */
function renderPartnerHeading(heading: string | { line1: string; line2?: string }) {
  if (typeof heading !== "string") {
    return (
      <>
        <span className={styles.headingHighlight}>{heading.line1}</span>
        {heading.line2 && (
          <>
            <br />
            <span className={styles.headingRest}>{heading.line2}</span>
          </>
        )}
      </>
    );
  }

  // Support Glean: "Put Glean to work on the questions"
  const gleanTarget = "Put Glean to work";
  if (heading.startsWith(gleanTarget)) {
    const remainder = heading.slice(gleanTarget.length);
    const parts = remainder.split(/<br\s*\/?>|\n/gi);
    if (parts.length >= 2) {
      return (
        <>
          <span className={styles.headingHighlight}>{gleanTarget}</span>
          <span className={styles.headingRest}>{parts[0]}</span>
          <br />
          <span className={styles.headingRest}>{parts.slice(1).join(" ")}</span>
        </>
      );
    }
    return (
      <>
        <span className={styles.headingHighlight}>{gleanTarget}</span>
        <span className={styles.headingRest}>{remainder}</span>
      </>
    );
  }

  const marker = "to work for";
  const markerIdx = heading.indexOf(marker);
  if (markerIdx !== -1) {
    const highlight = heading.slice(0, markerIdx + marker.length);
    const rest = heading.slice(markerIdx + marker.length).trim();
    return (
      <>
        <span className={styles.headingHighlight}>{highlight}</span>
        <br />
        <span className={styles.headingRest}>{rest}</span>
      </>
    );
  }

  const parts = heading.split(/<br\s*\/?>|\n/gi);
  if (parts.length >= 2) {
    return (
      <>
        <span className={styles.headingHighlight}>{parts[0]}</span>
        <br />
        <span className={styles.headingRest}>{parts.slice(1).join(" ")}</span>
      </>
    );
  }

  return heading;
}

function PartnerButtonIcon({
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

/**
 * PartnerFooterCTA
 *
 * Reusable horizontal frosted-glass CTA card component rendered inside Footer
 * on Partner Detail Pages (Databricks, ServiceNow, Shopify, AWS, etc.).
 *
 * Structure:
 * ┌──────────────────────────────────────────────────────────────┐
 * │                                                              │
 * │  PARTNER ARTWORK       HEADING                               │
 * │                        DESCRIPTION                           │
 * │                        BUTTON                                │
 * │                                                              │
 * └──────────────────────────────────────────────────────────────┘
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function PartnerFooterCTA({
  heading,
  description,
  media,
  buttons,
  className,
}: PartnerFooterCTAProps) {
  return (
    <div className={clsx(styles.partnerCard, className)}>
      {media?.src && (
        <div className={styles.artworkWrapper}>
          <Image
            src={media.src}
            alt={media.alt || ""}
            width={media.width ?? 420}
            height={media.height ?? 280}
            className={styles.artwork}
            priority
          />
        </div>
      )}
      <div className={styles.content}>
        <h2 className={styles.heading}>
          {renderPartnerHeading(heading)}
        </h2>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        <div className={styles.buttons}>
          {buttons.map((button) => (
            <Link
              key={button.label}
              href={button.href}
              className={styles.buttonLink}
            >
              <Button
                variant={button.variant ?? "dark"}
                size="lg"
                rightIcon={
                  button.icon ? (
                    <PartnerButtonIcon icon={button.icon} />
                  ) : undefined
                }
              >
                {button.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
