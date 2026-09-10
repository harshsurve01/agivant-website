import clsx from "clsx";
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
  /** Optional container class name. */
  className?: string;
  /** Optional leading search icon. Defaults to false. */
  showSearchIcon?: boolean;
  /** Button visual variant. Defaults to "primary". */
  buttonVariant?: "primary" | "dark";
  /** Visual variant of the SearchBar container. Defaults to "default". */
  variant?: "default" | "solid";
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function SearchBar({
  placeholder,
  buttonLabel,
  value,
  onChange,
  onSubmit,
  className,
  showSearchIcon = false,
  buttonVariant = "primary",
  variant = "default",
}: SearchBarProps) {
  const isSolid = variant === "solid";

  return (
    <form
      className={clsx(styles.searchBar, isSolid && styles.solid, className)}
      role="search"
      onSubmit={onSubmit}
    >
      <div className={clsx(styles.inputArea, isSolid && styles.solidInputArea)}>
        {showSearchIcon && (
          <span className={styles.iconWrap}>
            <SearchIcon className={styles.searchIcon} />
          </span>
        )}
        <input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          aria-label={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
      <span className={styles.buttonWrap}>
        <Button type="submit" variant={buttonVariant} size="lg">
          {buttonLabel}
        </Button>
      </span>
    </form>
  );
}