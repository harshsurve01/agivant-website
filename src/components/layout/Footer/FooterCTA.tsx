import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import type { FooterButton, FooterBrandMedia } from "@/data/footer";
import type { FooterVariant } from "./Footer";
import styles from "./FooterCTA.module.css";

export interface FooterCTAProps {
  /** Section heading text or structured object. */
  heading:
    | {
        line1: string;
        line2?: string;
        line2Prefix?: string;
        line2Brand?: string;
        line3?: string;
      }
    | string;
  /** Optional supporting description text (rendered below heading). */
  description?: string;
  /** Brand media asset (e.g. Amp'd wordmark/gif) inserted inline in the heading. */
  brandMedia?: FooterBrandMedia;
  /** CTA buttons rendered below the heading. */
  buttons: FooterButton[];
  /** Visual variant (e.g. "default", "partners", or "partner-detail"). */
  variant?: FooterVariant;
}

/**
 * FooterCTA
 *
 * Owns the footer's heading, supporting text, and CTA buttons zone.
 * - "default": Centered 3-line heading with inline Amp'd brand asset, 2 CTA buttons (Dark + Purple).
 * - "partners": Centered 2-line heading with 1 primary purple CTA button.
 * - "partner-detail": Centered 3-line heading (64px / 120%), 18px supporting text,
 *                     and single primary purple CTA button with cube icon.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function FooterCTA({
  heading,
  description,
  brandMedia,
  buttons,
  variant = "default",
}: FooterCTAProps) {
  const isPartners = variant === "partners";
  const isPartnerDetail = variant === "partner-detail";

  return (
    <div
      className={clsx(
        styles.cta,
        isPartners && styles.ctaPartners,
        isPartnerDetail && styles.ctaPartnerDetail
      )}
    >
      {isPartners || isPartnerDetail ? (
        <h2
          className={
            isPartnerDetail
              ? styles.headingPartnerDetail
              : styles.headingPartners
          }
        >
          {typeof heading === "string" ? (
            heading.split(/<br\s*\/?>|\n/gi).map((line, index) => (
              <span
                key={index}
                className={
                  isPartnerDetail
                    ? clsx(
                        styles.headingLinePartnerDetail,
                        index === 0 && styles.headingLinePartnerDetailHighlight
                      )
                    : styles.headingLinePartners
                }
              >
                {line}
              </span>
            ))
          ) : (
            <>
              <span
                className={
                  isPartnerDetail
                    ? clsx(
                        styles.headingLinePartnerDetail,
                        styles.headingLinePartnerDetailHighlight
                      )
                    : styles.headingLinePartners
                }
              >
                {heading.line1}
              </span>
              {heading.line2 && (
                <span
                  className={
                    isPartnerDetail
                      ? styles.headingLinePartnerDetail
                      : styles.headingLinePartners
                  }
                >
                  {heading.line2}
                </span>
              )}
              {heading.line3 && (
                <span
                  className={
                    isPartnerDetail
                      ? styles.headingLinePartnerDetail
                      : styles.headingLinePartners
                  }
                >
                  {heading.line3}
                </span>
              )}
            </>
          )}
        </h2>
      ) : (
        <h2 className={styles.heading}>
          {typeof heading === "string" ? (
            (() => {
              const rawLines = heading.split(/<br\s*\/?>|\n/gi);
              let lines = rawLines;

              // When brandMedia exists and heading is 1 or 2 lines containing the universal footer phrase:
              // e.g. "Ready To Get Your Enterprise Amp'd With Agivant?" or "Ready To Get Your Enterprise With Agivant?"
              if (brandMedia) {
                if (rawLines.length === 1) {
                  const match = rawLines[0].trim().match(/^(Ready To Get Your)\s+(Enterprise)(?:\s+Amp'd)?\s+(With Agivant\??)$/i);
                  if (match) {
                    lines = [match[1], match[2], match[3]];
                  }
                } else if (rawLines.length === 2) {
                  const line2Match = rawLines[1].trim().match(/^(Enterprise)(?:\s+Amp'd)?\s+(With Agivant\??)$/i);
                  if (line2Match) {
                    lines = [rawLines[0].trim(), line2Match[1], line2Match[2]];
                  }
                }
              }

              // When brandMedia exists and there are at least 3 segments (e.g. "Ready To Get Your<br>Enterprise<br>With Agivant?"):
              // Segment 1 remains line 1.
              // Segment 2 ("Enterprise") + brandMedia + Segment 3 ("With Agivant?") are combined into ONE visual line.
              if (brandMedia && lines.length >= 3) {
                const firstSegment = lines[0].trim();
                let secondSegment = lines[1].trim();
                let thirdSegment = lines.slice(2).join(" ").trim();

                // Strip textual "Amp'd" if present in the text segments to avoid duplication with brandMedia
                secondSegment = secondSegment.replace(/\s+Amp'd$/i, "");
                thirdSegment = thirdSegment.replace(/^Amp'd\s+/i, "");

                return (
                  <>
                    <span className={styles.headingLine}>{firstSegment}</span>
                    <span className={clsx(styles.headingLine, styles.brandLine)}>
                      <span>{secondSegment}</span>
                      <span className={styles.brandMediaWrapper}>
                        <Image
                          src={brandMedia.src}
                          alt={brandMedia.alt}
                          width={brandMedia.width ?? 360}
                          height={brandMedia.height ?? 150}
                          className={styles.brandMedia}
                          unoptimized={brandMedia.src.endsWith(".svg") || brandMedia.src.endsWith(".gif")}
                          priority
                        />
                      </span>
                      <span>{thirdSegment}</span>
                    </span>
                  </>
                );
              }

              return lines.map((line, index) => {
                const trimmed = line.trim();
                const isSecondLine =
                  index === 1 || trimmed.toLowerCase() === "enterprise";

                if (brandMedia && isSecondLine && !/Amp'd\??/i.test(trimmed)) {
                  return (
                    <span
                      key={index}
                      className={clsx(styles.headingLine, styles.brandLine)}
                    >
                      <span>{trimmed}</span>
                      <span className={styles.brandMediaWrapper}>
                        <Image
                          src={brandMedia.src}
                          alt={brandMedia.alt}
                          width={brandMedia.width ?? 360}
                          height={brandMedia.height ?? 150}
                          className={styles.brandMedia}
                          unoptimized={brandMedia.src.endsWith(".svg") || brandMedia.src.endsWith(".gif")}
                          priority
                        />
                      </span>
                    </span>
                  );
                }

                if (/Amp'd\??/i.test(trimmed)) {
                  const parts = trimmed.split(/(Amp'd\??)/i);
                  return (
                    <span key={index} className={styles.headingLine}>
                      {parts.map((part, pIdx) =>
                        /Amp'd\??/i.test(part) ? (
                          <span key={pIdx} className={styles.headingHighlight}>
                            {part}
                          </span>
                        ) : (
                          part
                        )
                      )}
                    </span>
                  );
                }

                return (
                  <span key={index} className={styles.headingLine}>
                    {line}
                  </span>
                );
              });
            })()
          ) : (
            <>
              <span className={styles.headingLine}>{heading.line1}</span>
              {brandMedia ? (
                <span
                  className={clsx(styles.headingLine, styles.brandLine)}
                >
                  <span>
                    {"line2" in heading
                      ? heading.line2
                      : `${heading.line2Prefix ?? ""} ${heading.line2Brand ?? ""}`.trim()}
                  </span>
                  <span className={styles.brandMediaWrapper}>
                    <Image
                      src={brandMedia.src}
                      alt={brandMedia.alt}
                      width={brandMedia.width ?? 240}
                      height={brandMedia.height ?? 80}
                      className={styles.brandMedia}
                      unoptimized={brandMedia.src.endsWith(".svg") || brandMedia.src.endsWith(".gif")}
                      priority
                    />
                  </span>
                  {heading.line3 && <span>{heading.line3}</span>}
                </span>
              ) : (
                <span className={styles.headingLine}>
                  {(() => {
                    const line2Text =
                      "line2" in heading
                        ? heading.line2
                        : `${heading.line2Prefix ?? ""} ${heading.line2Brand ?? ""}`.trim();
                    if (line2Text && /Amp'd\??/i.test(line2Text)) {
                      return line2Text.split(/(Amp'd\??)/i).map((part, pIdx) =>
                        /Amp'd\??/i.test(part) ? (
                          <span key={pIdx} className={styles.headingHighlight}>
                            {part}
                          </span>
                        ) : (
                          part
                        )
                      );
                    }
                    return line2Text;
                  })()}
                </span>
              )}
              {!brandMedia && heading.line3 ? (
                <span className={styles.headingLine}>{heading.line3}</span>
              ) : null}
            </>
          )}
        </h2>
      )}

      {description && <p className={styles.description}>{description}</p>}

      <div
        className={clsx(
          styles.buttons,
          (isPartners || isPartnerDetail) && styles.buttonsPartners
        )}
      >
        {buttons.map((button) => (
          <Link
            key={button.label}
            href={button.href}
            className={styles.buttonLink}
          >
            <Button
              variant={button.variant}
              size="lg"
              rightIcon={
                button.icon ? (
                  <FooterButtonIcon icon={button.icon} />
                ) : undefined
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
