import styles from "./ArchitectureEmbed.module.css";

export interface ArchitectureEmbedProps {
  /** The source URL to embed in the iframe (e.g. local mock or future backend URL). */
  src: string;
  /** Accessible title for the iframe. */
  title?: string;
  className?: string;
}

/**
 * ArchitectureEmbed
 *
 * Controlled viewport component for the interactive architecture diagram.
 * Creates an exact 1250px x 650.78px viewport with overflow:hidden around
 * the scaled and translated iframe, cleanly cropping out top headers,
 * step navigation buttons, and bottom instruction copy.
 */
export function ArchitectureEmbed({
  src,
  title = "Architecture Diagram",
  className,
}: ArchitectureEmbedProps) {
  return (
    <div className={`${styles.viewport} ${className ?? ""}`.trim()}>
      <iframe
        src={src}
        title={title}
        className={styles.iframe}
        loading="lazy"
        scrolling="no"
      />
    </div>
  );
}
