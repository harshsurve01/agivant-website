import type { AmpHeaderData } from "@/data/ampTransformation";
import styles from "./AmpHeader.module.css";

interface AmpHeaderProps {
  heading: AmpHeaderData["heading"];
  description: AmpHeaderData["description"];
}

/**
 * AmpHeader
 *
 * Responsible only for rendering the section's title and description —
 * no layout logic beyond its own internal stack, no business logic, no
 * animation. Same shape/reasoning as EnvironmentHeader and
 * AIStackHeader: the heading is two explicit line <span>s (rather than
 * relying on text wrap) so the break matches the supplied screenshot
 * regardless of container width, and the description is split into an
 * accent-colored lead-in sentence plus a default-color supporting
 * sentence, matching how data/ampTransformation.ts models it.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function AmpHeader({ heading, description }: AmpHeaderProps) {
  return (
    <div className={styles.header}>
<h2 className={styles.heading}>
  {heading.line1} {heading.line2Prefix}
  <span className={styles.highlight}>{heading.highlight}</span>
</h2>

      <p className={styles.description}>
        <span className={styles.descriptionHighlight}>{description.highlight}</span>{" "}
        <span className={styles.descriptionBody}>{description.body}</span>
      </p>
    </div>
  );
}
