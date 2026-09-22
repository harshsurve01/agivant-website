import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Section, type SectionHeight } from "@/components/ui/Section";
import type { DatabricksControlData } from "@/types/partnerDetail";
import styles from "./DatabricksControl.module.css";

export interface DatabricksControlProps {
  data: DatabricksControlData;
  imagePosition?: "left" | "right";
  height?: SectionHeight;
  className?: string;
  id?: string;
}

/**
 * Presentational helper to highlight the purple accent in the section heading:
 * "Keep cost," in Agivant purple, rest in black.
 * Preserves the heading as one single conceptual data field.
 */
function renderHeading(heading: string) {
  const targets = [
    "Keep cost,",
    "Get Amp’d to move",
    "Get Amp'd to move",
    "Every figure an agent states,",
    "Keep judgment with",
  ];
  for (const target of targets) {
    if (heading.startsWith(target)) {
      return (
        <>
          <span className={styles.headingHighlight}>{target}</span>
          {heading.slice(target.length)}
        </>
      );
    }
  }
  return heading;
}

/**
 * Presentational helper to bold the required governance phrase:
 * "Unity Catalog, AI Gateway, MLflow, and Databricks’ built-in governance capabilities"
 * Handles both markdown ** syntax and direct string matching with curly or straight apostrophes.
 */
function renderBodyWithBold(text: string) {
  if (text.includes("**")) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className={styles.boldText}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  }

  const regex =
    /(Unity Catalog,\s*AI Gateway,\s*MLflow,\s*and Databricks['’]\s*built-in governance capabilities)/i;
  if (regex.test(text)) {
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (regex.test(part)) {
        return (
          <strong key={i} className={styles.boldText}>
            {part}
          </strong>
        );
      }
      return part;
    });
  }

  return text;
}

/**
 * DatabricksControl
 *
 * Section 5 of the Databricks Partner Single Page (/partners/databricks).
 * Renders the "Keep cost, access, and agent behavior under clear control" editorial section:
 * - Left: Large rounded editorial image
 * - Right: Heading ("Keep cost," in purple, rest in black) + body copy with bold governance emphasis
 *
 * Consumes design tokens exclusively from variables.css.
 * Server Component: pure presentation, zero client overhead.
 */
export function DatabricksControl({
  data,
  imagePosition = "left",
  height = "viewport",
  className,
  id = "control",
}: DatabricksControlProps) {
  if (!data) return null;

  return (
    <Section
      height={height}
      className={clsx(styles.section, className)}
      id={id}
    >
      <Container size="xl" className={styles.container}>
        <div
          className={clsx(
            styles.contentGrid,
            imagePosition === "right" && styles.imageRight
          )}
        >
          <div className={styles.imageWrapper}>
            <Image
              src={data.image.src}
              alt={data.image.alt}
              width={data.image.width}
              height={data.image.height}
              className={styles.image}
            />
          </div>
          <div className={styles.textContent}>
            <h2 className={styles.heading}>{renderHeading(data.heading)}</h2>
            <p className={styles.body}>{renderBodyWithBold(data.description)}</p>
            {data.closingStatement && (
              <p className={styles.closingStatement}>{data.closingStatement}</p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
