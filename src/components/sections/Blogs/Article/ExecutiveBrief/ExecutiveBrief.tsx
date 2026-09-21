import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import type { ExecutiveBriefProps } from "./types";
import styles from "./ExecutiveBrief.module.css";

/**
 * ExecutiveBrief
 *
 * Renders the Blog Inner page's "Executive Brief" section: a small
 * brand-colored accent bar beside a two-tone heading, followed by
 * the section's body copy. Figma: node 2097:1282 ("Executive
 * Brief"), 2097:1288 (accent bar), 2097:1290 (body copy), all direct
 * children of "Blog Inside page" (node 2097:1214) — this section has
 * no dedicated Figma frame of its own, unlike the Hero above it.
 *
 * `title`'s last word is rendered in the brand highlight color,
 * mirroring the same two-tone pattern Featured already uses for its
 * own heading (first word highlighted there) — kept purely
 * presentational, not encoded in the data, same reasoning as
 * Featured.
 *
 * No shared background/particle treatment here — Figma shows this
 * section on the page's plain white background, unlike Hero, so
 * HeroBackground is intentionally not used. Container IS reused,
 * same "xl" default ArticleHero's own Container already renders at
 * — its 1280px max-width plus padding lines up with Figma's ~96px
 * left edge for this content closely enough (1280px container in a
 * 1440px frame + the shared --container-padding-inline token lands
 * at 100px) that a dedicated width value isn't warranted here.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no data imports. Every value arrives via props, so this component
 * is already shaped for a future WordPress-sourced article object
 * with zero changes required on this end.
 */
export function ExecutiveBrief({
  id,
  title,
  paragraphs,
  showBar = true,
  spacing = "hero",
  highlightPosition,
  highlightCount,
  ribbonSrc,
  ribbonClassName,
}: ExecutiveBriefProps) {
  const renderHeading = () => {
    if (!title) return null;

    const hasLineBreak =
      typeof title === "string" && (title.includes("<br") || title.includes("\n"));
    if (hasLineBreak) {
      const lines = title
        .split(/<br\s*\/?>|\n/gi)
        .map((line) => line.trim())
        .filter(Boolean);
      return (
        <>
          <span className={styles.highlight}>{lines[0]}</span>
          <br />
          <span>{lines.slice(1).join(" ")}</span>
        </>
      );
    }

    if (highlightPosition === "start") {
      const words = title.split(" ");
      const count = highlightCount ?? 1;
      const prefix = words.slice(0, count).join(" ");
      const rest = words.slice(count).join(" ");
      return (
        <>
          <span className={styles.highlight}>{prefix}</span>
          {rest ? ` ${rest}` : ""}
        </>
      );
    }

    const colonIndex = title.indexOf(":");
    if (colonIndex !== -1 && (highlightPosition === "colon" || !highlightPosition)) {
      const prefix = title.slice(0, colonIndex + 1);
      const rest = title.slice(colonIndex + 1);
      return (
        <>
          <span>{prefix}</span>
          <span className={styles.highlight}>{rest}</span>
        </>
      );
    }

    const words = title.split(" ");
    const count = highlightCount ?? 1;
    const prefix = words.slice(0, -count).join(" ");
    const highlighted = words.slice(-count).join(" ");
    return (
      <>
        {prefix ? `${prefix} ` : ""}
        <span className={styles.highlight}>{highlighted}</span>
      </>
    );
  };

  return (
    <section
      id={id}
      className={clsx(
        styles.executiveBrief,
        spacing === "standard" && styles.standardSpacing
      )}
    >
      {ribbonSrc && (
        <div
          className={clsx(styles.ribbonWrapper, ribbonClassName)}
          aria-hidden="true"
        >
          <Image
            src={ribbonSrc}
            alt=""
            width={1682}
            height={922}
            className={styles.ribbonImage}
            loading="eager"
          />
        </div>
      )}

      <Container className={styles.container}>
        {showBar ? (
          <div className={styles.headingRow}>
            <span className={styles.bar} aria-hidden="true" />
            <h2 className={styles.title}>{renderHeading()}</h2>
          </div>
        ) : (
          <div className={styles.headingStandalone}>
            <h2 className={styles.title}>{renderHeading()}</h2>
          </div>
        )}

        <div className={styles.body}>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
