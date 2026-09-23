import styles from "./LifecycleHeader.module.css";

export interface LifecycleHeaderProps {
  eyebrow?: string | null;
  title:
    | {
        highlight: string;
        suffix: string;
      }
    | string;
  description?: string | null;
}

/**
 * LifecycleHeader
 *
 * Owns the section's heading block: the struck-through "Traditional
 * SDLC" line, the two-tone "AI-Native Engineering Lifecycle" heading,
 * and the supporting description. Three distinct fields (see
 * data/lifecycle.ts), not one string — each needs different styling
 * that a merged string couldn't carry.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function LifecycleHeader({ eyebrow, title, description }: LifecycleHeaderProps) {
  const renderTitle = () => {
    if (typeof title === "object" && title !== null) {
      return (
        <>
          <span className={styles.highlight}>{title.highlight}</span>{" "}
          {title.suffix}
        </>
      );
    }

    const ampdMatch = (title || "").match(/^(The Amp['’]d)(.*)$/i);
    if (ampdMatch) {
      return (
        <>
          <span className={styles.highlight}>{ampdMatch[1]}</span>
          {ampdMatch[2]}
        </>
      );
    }

    return title;
  };

  return (
    <div className={styles.header}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}

      <h2 className={styles.heading}>{renderTitle()}</h2>

      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
