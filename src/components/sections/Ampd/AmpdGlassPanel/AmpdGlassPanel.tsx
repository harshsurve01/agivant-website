import { Children } from "react";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import styles from "./AmpdGlassPanel.module.css";

export interface AmpdGlassPanelProps {
  /** Section id (anchor). */
  id?: string;
  /** Main section title, rendered OUTSIDE the glass panel (one string). */
  title: string;
  /** Number of leading words of `title` rendered in brand purple. Defaults to 0 (all black). */
  highlightWords?: number;
  /** Sub-sections — each one is rendered in its OWN glass card. */
  children: React.ReactNode;
  /** Page-level class for scoped overrides. */
  className?: string;
}

/**
 * AmpdGlassPanel (Amp'd landing page)
 *
 * Main section shell: a centred title above a stack of translucent glass
 * cards — one card per child sub-section (see AmpdSubSection). New
 * sub-sections are added as extra children — the shell never changes.
 *
 * Server Component: presentation only; content arrives via props.
 */
export function AmpdGlassPanel({
  id,
  title,
  highlightWords = 0,
  children,
  className,
}: AmpdGlassPanelProps) {
  const words = title.split(" ");
  const highlighted = words.slice(0, highlightWords).join(" ");
  const rest = words.slice(highlightWords).join(" ");

  return (
    <section id={id} className={clsx(styles.section, className)}>
      <Container size="xl">
        <h2 className={styles.title}>
          {highlighted && (
            <span className={styles.titleAccent}>{highlighted}</span>
          )}
          {highlighted && rest ? " " : ""}
          {rest}
        </h2>

        <div className={styles.panels}>
          {Children.toArray(children).map((child, idx) => (
            <div key={idx} className={styles.panel}>
              {child}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
