import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import styles from "./ProofContent.module.css";

interface ProofContentProps {
  heading: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
}

/**
 * ProofContent
 *
 * Owns the section's static left column: heading, description, CTA.
 * Parses the heading string for <br> forced line breaks, dynamically highlights
 * the leading element without hardcoding any specific copy, and renders
 * line breaks via .headingLine.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function ProofContent({ heading, description, cta }: ProofContentProps) {
  const lines = typeof heading === "string"
    ? heading.split(/<br\s*\/?>|\n/gi).map((line) => line.trim()).filter(Boolean)
    : [];

  return (
    <div className={styles.content}>
      <h2 className={styles.heading}>
        {lines.length > 1 ? (
          lines.map((line, index) => (
            <span key={index} className={styles.headingLine}>
              {index === 0 ? (
                <span className={styles.highlight}>{line}</span>
              ) : (
                line
              )}
            </span>
          ))
        ) : lines.length === 1 ? (
          (() => {
            const words = lines[0].split(" ");
            const firstWord = words[0];
            const rest = words.slice(1).join(" ");
            return (
              <span className={styles.headingLine}>
                <span className={styles.highlight}>{firstWord}</span>
                {rest ? ` ${rest}` : ""}
              </span>
            );
          })()
        ) : null}
      </h2>

      <p className={styles.description}>{description}</p>

      <Link href={cta.href}>
        <Button variant="dark" size="lg" rightIcon={<ArrowUpRight />}>
          {cta.label}
        </Button>
      </Link>
    </div>
  );
}
