import Link from "next/link";
import type { FooterNavigationLink } from "@/data/footer";
import styles from "./FooterNavigation.module.css";

export interface FooterNavigationProps {
  /** Navigation links rendered in order. */
  links: FooterNavigationLink[];
}

/**
 * FooterNavigation
 *
 * Owns the footer's navigation list — the top-right visual zone. Uses a
 * semantic <nav>/<ul>/<li> structure with an accessible label, so it's
 * correctly identified by assistive tech independent of any future
 * visual restyling.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function FooterNavigation({ links }: FooterNavigationProps) {
  return (
    <nav className={styles.nav} aria-label="Footer">
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={styles.link}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
