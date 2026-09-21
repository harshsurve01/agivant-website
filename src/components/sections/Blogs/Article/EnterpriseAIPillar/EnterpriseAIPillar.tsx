import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { EnterpriseAIPillarProps } from "./types";
import styles from "./EnterpriseAIPillar.module.css";

/**
 * Parses markdown bold (**text**) into <strong> tags without external dependencies.
 */
function renderFormattedText(text: string) {
  if (!text.includes("**")) {
    return text;
  }
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/**
 * EnterpriseAIPillar
 *
 * Reusable component representing one Pillar in "The 6 Pillars of Enterprise-Grade AI":
 * - Optional overarching section title (e.g. "The 6 Pillars of Enterprise-Grade AI")
 * - Pillar heading with "Pillar X:" highlighted presentationally in purple
 * - Row 1 (Problem): Variant A (Split: "The problem" + "Why it matters") or Variant B (Full: "The problem")
 * - Row 2 (Enterprise Implementation): Full-width glass card with bullet points & dynamic ribbon artwork
 * - Row 3 (Agivant POV): Full-width glass card with body text & dynamic ribbon artwork
 *
 * Server Component: no "use client", no hooks, no client state. All data arrives via props.
 */
export function EnterpriseAIPillar({
  id,
  sectionTitle,
  title,
  problemLayout,
  problem,
  whyItMatters,
  implementation,
  pov,
  className,
}: EnterpriseAIPillarProps) {
  // Determine layout variant: explicit prop, or infer from whyItMatters presence
  const isSplit =
    problemLayout === "split" ||
    (problemLayout === undefined && Boolean(whyItMatters?.content));

  // Presentational highlight for "Pillar X:"
  const colonIndex = title.indexOf(":");
  const hasPrefix = colonIndex !== -1;
  const prefix = hasPrefix ? title.slice(0, colonIndex + 1) : null;
  const restTitle = hasPrefix ? title.slice(colonIndex + 1).trimStart() : title;

  // Split multi-paragraph text
  const problemParagraphs = problem.content
    ? problem.content.split(/\n\s*\n/).filter(Boolean)
    : [];
  const whyParagraphs = whyItMatters?.content
    ? whyItMatters.content.split(/\n\s*\n/).filter(Boolean)
    : [];
  const povParagraphs = pov.content
    ? pov.content.split(/\n\s*\n/).filter(Boolean)
    : [];

  return (
    <section
      id={id}
      className={`${styles.section} ${className || ""}`.trim()}
    >
      <Container className={styles.container}>
        {sectionTitle && (
          <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
        )}

        <h3 className={styles.pillarTitle}>
          {prefix && <span className={styles.titlePrefix}>{prefix}</span>}
          {restTitle}
        </h3>

        <div className={styles.cardsStack}>
          {/* Row 1: Problem / Why it matters */}
          {isSplit ? (
            <div className={styles.problemRowSplit}>
              <div className={styles.card}>
                <h4 className={styles.cardLabel}>
                  {problem.label || "The problem"}
                </h4>
                {problemParagraphs.map((para, idx) => (
                  <p key={idx} className={styles.cardText}>
                    {renderFormattedText(para)}
                  </p>
                ))}
              </div>

              {whyItMatters && (
                <div className={styles.card}>
                  <h4 className={styles.cardLabel}>
                    {whyItMatters.label || "Why it matters"}
                  </h4>
                  {whyParagraphs.map((para, idx) => (
                    <p key={idx} className={styles.cardText}>
                      {renderFormattedText(para)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.problemRowFull}>
              <div className={styles.card}>
                <h4 className={styles.cardLabel}>
                  {problem.label || "The problem"}
                </h4>
                {problemParagraphs.map((para, idx) => (
                  <p key={idx} className={styles.cardText}>
                    {renderFormattedText(para)}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Row 2: Enterprise Implementation */}
          <div className={`${styles.card} ${styles.cardWithRibbon}`}>
            <div className={styles.cardContent}>
              <h4 className={styles.cardLabel}>
                {implementation.label || "Enterprise Implementation"}
              </h4>
              {implementation.items && implementation.items.length > 0 && (
                <ul className={styles.bulletList}>
                  {implementation.items.map((item, idx) => (
                    <li key={idx} className={styles.bulletItem}>
                      {renderFormattedText(item)}
                    </li>
                  ))}
                </ul>
              )}
              {implementation.content && (
                <p className={styles.cardText}>
                  {renderFormattedText(implementation.content)}
                </p>
              )}
            </div>

            {implementation.ribbonSrc && (
              <div className={styles.ribbonWrapper} aria-hidden="true">
                <Image
                  src={implementation.ribbonSrc}
                  alt={implementation.ribbonAlt || ""}
                  width={480}
                  height={260}
                  className={styles.ribbonImage}
                />
              </div>
            )}
          </div>

          {/* Row 3: Agivant POV */}
          <div className={`${styles.card} ${styles.cardWithRibbon}`}>
            <div className={styles.cardContent}>
              <h4 className={styles.cardLabel}>
                {pov.label || "Agivant POV"}
              </h4>
              {povParagraphs.map((para, idx) => (
                <p key={idx} className={styles.cardText}>
                  {renderFormattedText(para)}
                </p>
              ))}
            </div>

            {pov.ribbonSrc && (
              <div className={styles.ribbonWrapper} aria-hidden="true">
                <Image
                  src={pov.ribbonSrc}
                  alt={pov.ribbonAlt || ""}
                  width={480}
                  height={260}
                  className={styles.ribbonImage}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
