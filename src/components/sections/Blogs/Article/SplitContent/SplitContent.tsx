import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { SplitContentProps } from "./types";
import styles from "./SplitContent.module.css";

/**
 * SplitContent
 *
 * Renders a full-width section with a two-tone heading and a large rounded
 * glass card containing a content column (left) and visual media (right).
 *
 * Designed to cleanly match the Figma "coordination-cost" section while
 * remaining fully reusable for any future split-content blog section.
 *
 * Server Component: no "use client", no hooks, no state, no data imports.
 */
export function SplitContent({
  eyebrow,
  title,
  content,
  image,
  highlightPosition = "colon",
  highlightCount = 1,
}: SplitContentProps) {
  // Normalize content into an array of paragraphs
  const paragraphs: string[] = Array.isArray(content)
    ? content
    : typeof content === "string"
      ? content.split(/\n\s*\n/).filter(Boolean)
      : [];

  // Normalize image media
  const imageSrc =
    typeof image === "string" ? image : image && image.src ? image.src : null;
  const imageAlt =
    typeof image === "object" && image && image.alt ? image.alt : "";

  // Two-tone heading handling (generic and content-agnostic)
  const renderHeading = () => {
    if (
      highlightPosition === "colon" ||
      (!highlightPosition && title.includes(":"))
    ) {
      const colonIdx = title.indexOf(":");
      if (colonIdx !== -1) {
        const highlighted = title.slice(0, colonIdx + 1);
        const plain = title.slice(colonIdx + 1);
        return (
          <h2 className={styles.title}>
            <span className={styles.highlight}>{highlighted}</span>
            {plain}
          </h2>
        );
      }
    }

    const words = title.split(" ");

    if (highlightPosition === "start") {
      const count = Math.min(highlightCount, words.length);
      const highlighted = words.slice(0, count).join(" ");
      const rest = words.slice(count).join(" ");
      return (
        <h2 className={styles.title}>
          <span className={styles.highlight}>{highlighted}</span>
          {rest ? ` ${rest}` : ""}
        </h2>
      );
    }

    // Default or "end"
    const count = Math.min(highlightCount, words.length);
    const lead = words.slice(0, -count).join(" ");
    const highlighted = words.slice(-count).join(" ");
    return (
      <h2 className={styles.title}>
        {lead}
        {lead ? " " : ""}
        <span className={styles.highlight}>{highlighted}</span>
      </h2>
    );
  };

  return (
    <section className={styles.splitContent}>
      <Container className={styles.container}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        {renderHeading()}

        <div className={styles.card}>
          <div className={styles.contentColumn}>
            {paragraphs.map((para, idx) => (
              <p key={idx} className={styles.paragraph}>
                {para}
              </p>
            ))}
          </div>

          {imageSrc && (
            <div className={styles.mediaColumn}>
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 617px"
                className={styles.image}
                priority={false}
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
