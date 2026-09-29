import clsx from "clsx";
import styles from "./AmpdGlassPanel.module.css";

export interface AmpdSubSectionProps {
  /** Sub-section id (anchor). */
  id?: string;
  /** Purple sub-section heading. */
  title: string;
  /** Intro split — left: large lead statement. */
  lead?: string | null;
  /** Intro split — right: supporting description. */
  description?: string | null;
  /** Sub-section content (video, numbered steps, cards…). */
  children?: React.ReactNode;
  className?: string;
}

/**
 * AmpdSubSection (Amp'd landing page)
 *
 * One sub-section inside AmpdGlassPanel: purple heading, a two-column
 * intro (lead | divider | description), then free content via children.
 * Stacked sub-sections are separated by the panel's own spacing.
 *
 * Server Component: presentation only.
 */
export function AmpdSubSection({
  id,
  title,
  lead,
  description,
  children,
  className,
}: AmpdSubSectionProps) {
  return (
    <div id={id} className={clsx(styles.subSection, className)}>
      <h3 className={styles.subTitle}>{title}</h3>

      {(lead || description) && (
        <div className={styles.intro}>
          {lead && (
            <p className={styles.introLead}>
              {lead.split(/<br\s*\/?>/i).map((line, idx) => (
                <span key={idx} className={styles.introLeadLine}>
                  {line.trim()}
                </span>
              ))}
            </p>
          )}
          {lead && description && (
            <span className={styles.introDivider} aria-hidden="true" />
          )}
          {description && <p className={styles.introBody}>{description}</p>}
        </div>
      )}

      {children && <div className={styles.subContent}>{children}</div>}
    </div>
  );
}
