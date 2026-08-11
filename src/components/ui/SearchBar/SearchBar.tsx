import { Button } from "@/components/ui/Button";
import styles from "./SearchBar.module.css";

/**
 * SearchBar
 *
 * A reusable, project-wide UI primitive: an input paired with a
 * search button. Intentionally has no state, no hooks, and no search
 * logic of its own — `value`, `onChange`, and `onSubmit` are all
 * optional so any consumer (Blogs Hero today, filters/listing pages
 * later) can wire it up however it needs to, without this component
 * ever knowing what "search" means for that page.
 *
 * The button itself is the shared Button primitive (same one
 * TechTalk's Hero CTA uses), not a bespoke <button> — it inherits
 * Button's full visual surface and motion system (magnetic hover,
 * cursor glow, rolling text) for free instead of duplicating any of
 * it here. SearchBar only supplies flex layout around it.
 */
export interface SearchBarProps {
  /** Placeholder copy shown inside the input. */
  placeholder: string;
  /** Label rendered on the search button. */
  buttonLabel: string;
  /** Controlled input value. Omit for an uncontrolled/static input. */
  value?: string;
  /** Change handler for a controlled input. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Submit handler for the surrounding form. */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function SearchBar({
  placeholder,
  buttonLabel,
  value,
  onChange,
  onSubmit,
}: SearchBarProps) {
  return (
    <form className={styles.searchBar} role="search" onSubmit={onSubmit}>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={onChange}
      />
      <span className={styles.buttonWrap}>
        <Button type="submit" variant="primary" size="lg">
          {buttonLabel}
        </Button>
      </span>
    </form>
  );
}