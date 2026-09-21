import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { DatabricksAgenticExecutionData } from "@/types/partnerDetail";
import styles from "./DatabricksAgenticExecution.module.css";

export interface DatabricksAgenticExecutionProps {
  data: DatabricksAgenticExecutionData;
}

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
 * DatabricksAgenticExecution
 *
 * Section 3 of the Databricks Partner Single Page (/partners/databricks).
 * Dedicated editorial component featuring:
 * 1. Full-width header area:
 *    - Eyebrow: "From data intelligence to agentic execution." (36px black)
 *    - Heading: "Amp’d by Agivant" (64px purple)
 *    - Supporting statement: "Build the agent. Ground it in enterprise context..." (36px gray, full container width)
 * 2. Two-column content grid:
 *    - Left: 3 body paragraphs (with bold styling on key Databricks capabilities) and purple closing statement
 *    - Right: 437 × 408 px rounded editorial artwork
 *
 * Consumes design tokens exclusively from variables.css.
 * Server Component: pure presentation, no client overhead.
 */
export function DatabricksAgenticExecution({
  data,
}: DatabricksAgenticExecutionProps) {
  if (!data) return null;

  return (
    <section className={styles.section} id="agentic-enterprise">
      <Container size="xl" className={styles.container}>
        {/* Full-width header block spanning the complete container width */}
        <header className={styles.header}>
          {data.eyebrow && <p className={styles.eyebrow}>{data.eyebrow}</p>}
          {data.heading && <h2 className={styles.heading}>{data.heading}</h2>}
          {data.supportingStatement && (
            <p className={styles.supportingStatement}>
              {data.supportingStatement}
            </p>
          )}
        </header>

        {/* Two-column content area: Left paragraphs/closing, Right artwork */}
        <div className={styles.grid}>
          <div className={styles.leftCol}>
            <div className={styles.paragraphs}>
              {data.paragraphs.map((p, idx) => (
                <p key={idx} className={styles.body}>
                  {renderFormattedText(p)}
                </p>
              ))}
            </div>
            {data.closingStatement && (
              <p className={styles.closingStatement}>{data.closingStatement}</p>
            )}
          </div>

          <div className={styles.rightCol}>
            {data.image && (
              <div className={styles.imageWrapper}>
                <Image
                  src={data.image.src}
                  alt={data.image.alt}
                  width={data.image.width}
                  height={data.image.height}
                  className={styles.image}
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
