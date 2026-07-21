import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import styles from "./ProofContent.module.css";

interface ProofContentProps {
  heading: {
    highlightWord: string;
    line1Rest: string;
    line2: string;
  };
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
 * Unlike PartnersHeader (whole second line highlighted) or
 * EnvironmentHeader (one word highlighted mid-line), this heading
 * highlights only its first word, at the very start of a two-line
 * heading — hence the {highlightWord, line1Rest, line2} shape instead
 * of reusing either existing pattern.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function ProofContent({ heading, description, cta }: ProofContentProps) {
  return (
    <div className={styles.content}>
      <h2 className={styles.heading}>
        <span className={styles.highlight}>{heading.highlightWord}</span>{" "}
        {heading.line1Rest}
        <span className={styles.headingLine}>{heading.line2}</span>
      </h2>

      <p className={styles.description}>{description}</p>

      <Link href={cta.href}>
        <Button variant="dark" size="sm" rightIcon={<ArrowUpRight />}>
          {cta.label}
        </Button>
      </Link>
    </div>
  );
}
