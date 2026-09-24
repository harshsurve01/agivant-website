import styles from "./AIStackHeader.module.css";

interface AIStackHeaderProps {
  heading:
    | {
        line1: string;
        line2Prefix: string;
        highlight: string;
      }
    | string;
  description?: string | null;
}

/**
 * AIStackHeader
 *
 * Owns the section's heading block.
 * Supports structured heading object (Homepage) or string heading (Service Inner Page).
 * For string headings like "Foundation For The Agentic Enterprise", "Foundation"
 * receives the purple highlight and the rest renders in text primary.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function AIStackHeader({ heading, description }: AIStackHeaderProps) {
  const renderHeading = () => {
    if (typeof heading === "string") {
      if (heading.startsWith("Faster Releases,")) {
        const rest = heading.slice("Faster Releases,".length);
        return (
          <span className={styles.headingLine}>
            <span className={styles.highlight}>Faster Releases,</span>
            {rest}
          </span>
        );
      }
      if (heading.startsWith("Foundation")) {
        const rest = heading.slice("Foundation".length);
        return (
          <span className={styles.headingLine}>
            <span className={styles.highlight}>Foundation</span>
            {rest}
          </span>
        );
      }
      return <span className={styles.headingLine}>{heading}</span>;
    }

    return (
      <span className={styles.headingLine}>
        {heading.line1} <span className={styles.highlight}>{heading.highlight}</span>
      </span>
    );
  };

  return (
    <div className={styles.header}>
      <h2 className={styles.heading}>{renderHeading()}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
}
